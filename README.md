# WikiLM — Fine-tuned GPT-2 Frontend

A premium portfolio frontend for a GPT-2 model fine-tuned on WikiText-103.
Built to look like a real SaaS product, not a hackathon demo.

---

## Project structure

```
gpt2-frontend/
├── backend/
│   └── main.py              # FastAPI inference server
├── src/
│   ├── components/
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── ModelSection.tsx
│   │   │   ├── Playground.tsx
│   │   │   ├── PerformanceSection.tsx
│   │   │   └── AboutSection.tsx
│   │   └── ui/
│   │       ├── Nav.tsx
│   │       ├── Footer.tsx
│   │       └── FadeIn.tsx
│   ├── hooks/
│   │   └── useGeneration.ts  # All generation state + API calls
│   ├── lib/
│   │   └── api.ts            # Fetch wrapper + mock
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## Quick start

### 1. Install and run the frontend

```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

The playground uses a **mock API by default** — no backend required to see the UI.

### 2. Run the FastAPI backend (for real inference)

Make sure your fine-tuned model is saved at `./gpt2-finetuned-final/`
(the path from the Jupyter notebook).

```bash
cd backend
pip install fastapi uvicorn transformers torch
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Switch from mock to real API

In `src/lib/api.ts`, replace `generateTextMock` with `generateText`
in the `useGeneration` hook:

```ts
// src/hooks/useGeneration.ts — line ~28
// Change:
const data = await generateTextMock(params)
// To:
const data = await generateText(params, abortRef.current.signal)
```

---

## Design decisions

**Color palette** — Deep slate (#0F1117) background with a dusty sage (#7C9E8A) accent.
Avoids the typical AI-product cyan/purple palette. Warm, editorial, trustworthy.

**Typography** — `Instrument Serif` for display headings (unexpected warmth against the dark
ground), `Inter` for all body copy (neutral, legible).

**The writing surface** — The playground input is styled as a lined document editor,
not a chat bubble. This is the signature element: it frames the model as a writing
instrument, not a chatbot.

**No chart library** — The loss curve is hand-rolled SVG. It's 40 lines and has no
dependency. A Chart.js import for one small graph would be overkill.

---

## Deployment

### Frontend → Vercel (recommended)

```bash
npm run build
# Then deploy the dist/ folder to Vercel, Netlify, or GitHub Pages
```

Set the environment variable in Vercel:
```
VITE_API_URL = https://your-api.railway.app
```

### Backend → Railway

1. Push `backend/main.py` to a GitHub repo
2. Create a new Railway project, connect the repo
3. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add your model files (or load from Hugging Face Hub)

### Backend → Render

Same as Railway. Use `uvicorn main:app --host 0.0.0.0 --port 10000`.

---

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Cmd/Ctrl + Enter` | Generate text |
| `Tab` | Navigate between presets |

---

## Customization

**Update your social links** in `src/components/ui/Footer.tsx`

**Update your actual metrics** in `src/components/sections/PerformanceSection.tsx`
Replace the `LOSS_CURVE` array with your real training logs.

**Update perplexity scores** — edit the `PerplexityBar` values to match your run.

**Change the model path** in `backend/main.py`:
```python
MODEL_PATH = "./gpt2-finetuned-final"
```
