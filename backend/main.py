"""
FastAPI backend for WikiLM — Fine-tuned GPT-2 inference server.

Run with:
    pip install fastapi uvicorn transformers torch
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload

The frontend proxies /api → http://localhost:8000 in development.
"""

import time
import torch
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from transformers import GPT2Tokenizer, GPT2LMHeadModel


# ──────────────────────────────────────────────────────────────────────────────
# Config
# ──────────────────────────────────────────────────────────────────────────────

MODEL_PATH = "./gpt2-finetuned-final"   # Path to your saved model directory
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Global model/tokenizer — loaded once at startup, reused for all requests
_model: Optional[GPT2LMHeadModel] = None
_tokenizer: Optional[GPT2Tokenizer] = None


# ──────────────────────────────────────────────────────────────────────────────
# Lifespan: load model on startup, release on shutdown
# ──────────────────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    global _model, _tokenizer
    print(f"Loading model from '{MODEL_PATH}' on {DEVICE}...")
    _tokenizer = GPT2Tokenizer.from_pretrained(MODEL_PATH)
    _tokenizer.pad_token = _tokenizer.eos_token
    _model = GPT2LMHeadModel.from_pretrained(MODEL_PATH)
    _model = _model.to(DEVICE)
    _model.eval()
    print("Model ready.")
    yield
    # Cleanup
    del _model, _tokenizer
    if DEVICE == "cuda":
        torch.cuda.empty_cache()


# ──────────────────────────────────────────────────────────────────────────────
# App
# ──────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="WikiLM API",
    description="GPT-2 fine-tuned on WikiText-103",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow the frontend dev server and your deployed domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://localhost:3000",
        # Add your deployed frontend URL here:
        # "https://yourdomain.com",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────────────────────────────────────
# Schemas
# ──────────────────────────────────────────────────────────────────────────────

class GenerationRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=500)
    max_new_tokens: int = Field(150, ge=10, le=300)
    temperature: float = Field(0.8, ge=0.1, le=2.0)
    top_p: float = Field(0.92, ge=0.1, le=1.0)
    repetition_penalty: float = Field(1.2, ge=1.0, le=2.0)


class GenerationResponse(BaseModel):
    generated_text: str
    prompt: str
    tokens_generated: int
    inference_time_ms: int


# ──────────────────────────────────────────────────────────────────────────────
# Endpoints
# ──────────────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": _model is not None,
        "device": DEVICE,
    }


@app.post("/generate", response_model=GenerationResponse)
def generate(req: GenerationRequest):
    if _model is None or _tokenizer is None:
        raise HTTPException(503, detail="Model not loaded yet. Try again in a moment.")

    # Tokenize the prompt
    inputs = _tokenizer(
        req.prompt,
        return_tensors="pt",
        truncation=True,
        max_length=128,   # leave room for generation within the 1024-token context
    ).to(DEVICE)

    prompt_length = inputs["input_ids"].shape[1]

    t0 = time.perf_counter()

    with torch.no_grad():
        output_ids = _model.generate(
            **inputs,
            max_new_tokens=req.max_new_tokens,
            temperature=req.temperature,
            top_p=req.top_p,
            repetition_penalty=req.repetition_penalty,
            do_sample=True,
            pad_token_id=_tokenizer.eos_token_id,
        )

    inference_ms = int((time.perf_counter() - t0) * 1000)

    # Decode only the generated portion (not the prompt)
    generated_ids = output_ids[0][prompt_length:]
    generated_text = _tokenizer.decode(generated_ids, skip_special_tokens=True)
    full_text = req.prompt + " " + generated_text

    return GenerationResponse(
        generated_text=full_text,
        prompt=req.prompt,
        tokens_generated=len(generated_ids),
        inference_time_ms=inference_ms,
    )
