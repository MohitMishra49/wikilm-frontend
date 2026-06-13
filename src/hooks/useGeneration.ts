import { useState, useCallback, useRef } from 'react'
import { generateText} from '../lib/api'
import type { PlaygroundState, GenerationRequest } from '../types'

const initialState: PlaygroundState = {
  prompt: '',
  output: '',
  status: 'idle',
  error: null,
  inferenceTime: null,
  tokensGenerated: null,
}

export function useGeneration() {
  const [state, setState] = useState<PlaygroundState>(initialState)
  const abortRef = useRef<AbortController | null>(null)

  const generate = useCallback(async (params: GenerationRequest) => {
    // Cancel any in-flight request
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setState((prev) => ({
      ...prev,
      status: 'loading',
      error: null,
      output: '',
    }))

    try {
      // Swap generateTextMock → generateText once your FastAPI is running
      const data = await generateText(params,abortRef.current?.signal)

      setState((prev) => ({
        ...prev,
        status: 'success',
        output: data.generated_text,
        inferenceTime: data.inference_time_ms,
        tokensGenerated: data.tokens_generated,
      }))
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return

      setState((prev) => ({
        ...prev,
        status: 'error',
        error:
          err instanceof Error
            ? err.message
            : 'Something went wrong. Please try again.',
      }))
    }
  }, [])

  const clear = useCallback(() => {
    abortRef.current?.abort()
    setState(initialState)
  }, [])

  const setPrompt = useCallback((prompt: string) => {
    setState((prev) => ({ ...prev, prompt }))
  }, [])

  return { state, generate, clear, setPrompt }
}
