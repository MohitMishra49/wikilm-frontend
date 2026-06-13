import { useRef, useEffect, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGeneration } from '../../hooks/useGeneration'
import { FadeIn } from '../ui/FadeIn'

const CHAR_LIMIT = 500

const EXAMPLE_PROMPTS = [
  "The history of the Roman Empire began with",
  "Photosynthesis is the process by which plants",
  "The French Revolution was a period of radical",
  "Einstein's theory of general relativity states",
  "The Amazon rainforest, often described as",
]

// Generation parameters — exposed as simple presets instead of raw sliders.
// This keeps the UI clean while still being informative to technical reviewers.
const PRESETS = [
  { label: 'Focused', temperature: 0.6, top_p: 0.85, description: 'Conservative, factual' },
  { label: 'Balanced', temperature: 0.8, top_p: 0.92, description: 'Default setting' },
  { label: 'Creative', temperature: 0.95, top_p: 0.98, description: 'More varied output' },
]

export function Playground() {
  const { state, generate, clear, setPrompt } = useGeneration()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const selectedPreset = useRef(1) // default: Balanced

  // Auto-resize textarea as user types
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`
  }, [state.prompt])

  // Scroll to output when generation completes
  useEffect(() => {
    if (state.status === 'success' && outputRef.current) {
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 100)
    }
  }, [state.status])

  function handleGenerate() {
    if (!state.prompt.trim() || state.status === 'loading') return
    const preset = PRESETS[selectedPreset.current]
    generate({
      prompt: state.prompt.trim(),
      max_new_tokens: 150,
      temperature: preset.temperature,
      top_p: preset.top_p,
      repetition_penalty: 1.2,
    })
  }

  // Cmd/Ctrl + Enter to generate
  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleGenerate()
    }
  }

  function handleCopy() {
    if (state.output) {
      navigator.clipboard.writeText(state.output)
    }
  }

  function handleExampleClick(example: string) {
    setPrompt(example)
    textareaRef.current?.focus()
  }

  const charCount = state.prompt.length
  const isOverLimit = charCount > CHAR_LIMIT
  const canGenerate = state.prompt.trim().length > 0 && !isOverLimit && state.status !== 'loading'

  return (
    <section id="playground" className="py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <FadeIn className="mb-12">
          <span className="text-xs text-sage font-medium uppercase tracking-widest block mb-3">
            Interactive
          </span>
          <h2 className="font-serif text-display-sm text-ink mb-4">
            Write your prompt
          </h2>
          <p className="text-ink-muted max-w-lg leading-relaxed">
            Start a sentence. The model continues it as an encyclopedia entry would —
            structured, factual, and in formal prose.
          </p>
        </FadeIn>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
          {/* Left: the writing surface */}
          <FadeIn>
            <div className="writing-surface rounded-xl border border-border overflow-hidden">
              {/* Top bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface/40">
                <span className="text-xs text-ink-faint font-mono">prompt.txt</span>
                <div className="flex items-center gap-3">
                  {/* Preset selector */}
                  <div className="flex items-center gap-1 bg-canvas/60 rounded-md p-1">
                    {PRESETS.map((preset, i) => (
                      <button
                        key={preset.label}
                        onClick={() => { selectedPreset.current = i }}
                        title={preset.description}
                        className={`text-xs px-2.5 py-1 rounded transition-all duration-150 ${
                          selectedPreset.current === i
                            ? 'bg-surface text-ink shadow-sm'
                            : 'text-ink-faint hover:text-ink-muted'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Textarea */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={state.prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="The history of machine learning began with..."
                  disabled={state.status === 'loading'}
                  maxLength={CHAR_LIMIT + 50}
                  rows={4}
                  className={`
                    w-full bg-transparent text-ink placeholder:text-ink-faint
                    text-sm leading-7 px-6 pt-5 pb-4 resize-none
                    focus:outline-none transition-opacity duration-200
                    ${state.status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  style={{ minHeight: '120px', maxHeight: '240px' }}
                />
              </div>

              {/* Bottom toolbar */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-surface/20">
                <div className="flex items-center gap-4">
                  {/* Character count */}
                  <span className={`text-xs font-mono transition-colors ${
                    isOverLimit ? 'text-red-400' : charCount > CHAR_LIMIT * 0.8 ? 'text-amber-400' : 'text-ink-faint'
                  }`}>
                    {charCount} / {CHAR_LIMIT}
                  </span>

                  {/* Clear button — only shows when there's content */}
                  <AnimatePresence>
                    {(state.prompt || state.output) && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={clear}
                        className="text-xs text-ink-faint hover:text-ink-muted transition-colors"
                      >
                        Clear
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-faint hidden sm:block">
                    ⌘ + Enter
                  </span>
                  <motion.button
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    whileHover={canGenerate ? { scale: 1.02 } : {}}
                    whileTap={canGenerate ? { scale: 0.98 } : {}}
                    className={`
                      flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md
                      transition-all duration-200
                      ${canGenerate
                        ? 'bg-sage text-canvas hover:bg-sage-light cursor-pointer'
                        : 'bg-muted/30 text-ink-faint cursor-not-allowed'
                      }
                    `}
                  >
                    {state.status === 'loading' ? (
                      <>
                        <LoadingDots />
                        Generating
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 7h10M8.5 3.5L12 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Generate
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Output area */}
            <AnimatePresence mode="wait">
              {state.status === 'loading' && (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 bg-surface border border-border rounded-xl p-6"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <LoadingDots />
                    <span className="text-xs text-ink-faint">
                      Model is generating — this takes 2–4 seconds
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="skeleton h-4 rounded w-full" />
                    <div className="skeleton h-4 rounded w-11/12" />
                    <div className="skeleton h-4 rounded w-4/5" />
                    <div className="skeleton h-4 rounded w-full" />
                    <div className="skeleton h-4 rounded w-3/4" />
                  </div>
                </motion.div>
              )}

              {state.status === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 bg-red-950/20 border border-red-900/40 rounded-xl p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-900/50 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-red-400 text-xs font-bold">!</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-300 mb-1">Generation failed</p>
                      <p className="text-xs text-red-400/80">{state.error}</p>
                      <p className="text-xs text-ink-faint mt-2">
                        Make sure the FastAPI backend is running on port 8000.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {state.status === 'success' && state.output && (
                <motion.div
                  key="output"
                  ref={outputRef}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="mt-4 writing-surface border border-sage/20 rounded-xl overflow-hidden"
                >
                  {/* Output top bar */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface/40">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                      <span className="text-xs text-sage">Generation complete</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {state.tokensGenerated && (
                        <span className="text-xs text-ink-faint">
                          {state.tokensGenerated} tokens
                        </span>
                      )}
                      {state.inferenceTime && (
                        <span className="text-xs text-ink-faint">
                          {(state.inferenceTime / 1000).toFixed(1)}s
                        </span>
                      )}
                      <button
                        onClick={handleCopy}
                        className="text-xs text-ink-faint hover:text-ink transition-colors flex items-center gap-1.5"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M8 4V2a1 1 0 00-1-1H2a1 1 0 00-1 1v5a1 1 0 001 1h2" stroke="currentColor" strokeWidth="1.2"/>
                        </svg>
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-5">
                    <p className="text-sm leading-7 text-ink">
                      <span className="text-ink-muted">{state.prompt} </span>
                      {state.output.replace(state.prompt, '')}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </FadeIn>

          {/* Right sidebar: example prompts + tips */}
          <FadeIn delay={0.1}>
            <div className="space-y-4">
              <div className="bg-surface border border-border rounded-xl p-5">
                <h3 className="text-xs font-medium text-ink uppercase tracking-wider mb-4">
                  Example prompts
                </h3>
                <div className="space-y-2">
                  {EXAMPLE_PROMPTS.map((example) => (
                    <button
                      key={example}
                      onClick={() => handleExampleClick(example)}
                      className="w-full text-left text-xs text-ink-muted hover:text-ink p-2.5 rounded-md hover:bg-canvas/60 transition-all duration-150 leading-relaxed"
                    >
                      "{example}"
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-surface border border-border rounded-xl p-5">
                <h3 className="text-xs font-medium text-ink uppercase tracking-wider mb-4">
                  Generation settings
                </h3>
                <div className="space-y-3">
                  {[
                    { key: 'Max new tokens', value: '150' },
                    { key: 'Repetition penalty', value: '1.2' },
                    { key: 'Sampling', value: 'Nucleus (top-p)' },
                    { key: 'Beam search', value: 'Disabled' },
                  ].map((item) => (
                    <div key={item.key} className="flex justify-between text-xs">
                      <span className="text-ink-faint">{item.key}</span>
                      <span className="text-ink font-mono">{item.value}</span>
                    </div>
                  ))}
                </div>
                <hr className="border-border my-3" />
                <p className="text-xs text-ink-faint leading-relaxed">
                  The preset controls temperature and top-p sampling.
                  Focused keeps the model close to training distribution;
                  Creative allows more diverse continuations.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// Three-dot loading indicator — small, tasteful
function LoadingDots() {
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1 h-1 rounded-full bg-current"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
