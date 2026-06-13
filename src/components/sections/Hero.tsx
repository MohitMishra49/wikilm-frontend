import { motion } from 'framer-motion'

// The hero opens with the most characteristic artifact of language models:
// a piece of generated text. Not a diagram, not a chatbot UI — the output itself.
// This frames the whole product before the user reads a single word of copy.

const SAMPLE_GENERATION = {
  prompt: "The development of neural networks began with",
  output: "early theoretical work by McCulloch and Pitts in 1943, who proposed a computational model of biological neurons. Their model, while simplified, established the mathematical foundations that would guide subsequent research for decades. It was not until the availability of large-scale datasets and sufficient computational resources that these architectures demonstrated the capabilities now associated with modern AI systems."
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 px-6">
      {/* Background: very subtle radial gradient centered on the hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(124,158,138,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto w-full">
        {/* Eyebrow label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-2.5 mb-8"
        >
          <span className="inline-block w-4 h-px bg-sage" />
          <span className="text-xs font-medium text-sage tracking-widest uppercase">
            Language Model Research
          </span>
        </motion.div>

        {/* Main headline — the typographic risk: Instrument Serif italic in the hero */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-serif text-display-sm md:text-display text-ink leading-[1.05] tracking-[-0.02em] max-w-4xl mb-6"
        >
          A language model that{' '}
          <em className="not-italic text-gradient">learned Wikipedia.</em>
        </motion.h1>

        {/* Value proposition */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-ink-muted text-lg max-w-xl mb-10 leading-relaxed"
        >
          GPT-2 base, fine-tuned on 103 million tokens of Wikipedia prose.
          Type a prompt. Watch it continue in the style of an encyclopedia article.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-wrap gap-3 mb-20"
        >
          <a
            href="#playground"
            className="inline-flex items-center gap-2 bg-sage text-canvas font-medium text-sm px-5 py-2.5 rounded-md hover:bg-sage-light transition-colors duration-200"
          >
            Open playground
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a
            href="#model"
            className="inline-flex items-center gap-2 text-ink-muted border border-border text-sm px-5 py-2.5 rounded-md hover:border-muted hover:text-ink transition-colors duration-200"
          >
            How it was trained
          </a>
        </motion.div>

        {/* The signature element: a "live" sample generation card
            This is NOT a screenshot or a mockup — it's styled to look like actual output.
            Recruiters see the product before they read the description. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="writing-surface rounded-xl border border-border overflow-hidden"
        >
          {/* Editor-style top bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface/50">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-muted/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-muted/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-muted/50" />
            </div>
            <span className="text-xs text-ink-faint font-mono">sample output</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse-slow" />
              <span className="text-xs text-sage">Generated</span>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Prompt */}
            <div className="mb-4">
              <span className="text-xs font-medium text-ink-faint uppercase tracking-wider block mb-2">Prompt</span>
              <p className="text-ink-muted font-sans text-sm italic">
                "{SAMPLE_GENERATION.prompt}"
              </p>
            </div>

            <div className="h-px bg-border my-4" />

            {/* Output */}
            <div>
              <span className="text-xs font-medium text-ink-faint uppercase tracking-wider block mb-3">Continuation</span>
              <p className="text-ink leading-relaxed font-sans text-sm md:text-base">
                <span className="text-ink-muted italic">"{SAMPLE_GENERATION.prompt}</span>
                {' '}
                {SAMPLE_GENERATION.output}"
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
