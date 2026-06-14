import type { GenerationRequest, GenerationResponse } from '../types'

// Point this at your FastAPI server. In dev, Vite proxies /api → localhost:8000
const API_BASE = "https://mohitmishra4905-wikilm-api.hf.space";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function generateText(
  request: GenerationRequest,
  signal?: AbortSignal,
): Promise<GenerationResponse> {
  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    signal,
  })

  if (!res.ok) {
    // Try to get a useful error message from the backend
    let message = `Server error (${res.status})`
    try {
      const data = await res.json()
      message = data.detail ?? data.message ?? message
    } catch {
      // ignore JSON parse errors
    }
    throw new ApiError(res.status, message)
  }

  return res.json()
}

// Mock response for development when no backend is running
// Remove this (or gate behind an env flag) before deploying
export async function generateTextMock(
  request: GenerationRequest,
): Promise<GenerationResponse> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 1800 + Math.random() * 1200))

  const continuations: Record<string, string> = {
    default: `${request.prompt} — a topic that has received considerable scholarly attention in recent years. Researchers have documented numerous instances in which systematic analysis revealed patterns that were not immediately apparent from surface-level observation. The implications of these findings extend beyond the immediate field, touching on broader questions of methodology and interpretation that scholars continue to debate.`,
  }

  const key = Object.keys(continuations).find((k) =>
    request.prompt.toLowerCase().includes(k),
  ) ?? 'default'

  const generated = continuations[key]
  return {
    generated_text: generated,
    prompt: request.prompt,
    tokens_generated: Math.floor(generated.split(' ').length * 1.3),
    inference_time_ms: 1800 + Math.floor(Math.random() * 1200),
  }
}
