// API response shape from the FastAPI backend
export interface GenerationResponse {
  generated_text: string
  prompt: string
  tokens_generated: number
  inference_time_ms: number
}

// Request payload
export interface GenerationRequest {
  prompt: string
  max_new_tokens?: number
  temperature?: number
  top_p?: number
  repetition_penalty?: number
}

// UI state for the playground
export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error'

export interface PlaygroundState {
  prompt: string
  output: string
  status: GenerationStatus
  error: string | null
  inferenceTime: number | null
  tokensGenerated: number | null
}

// Model stats for the performance section
export interface ModelStats {
  label: string
  value: string
  description: string
}
