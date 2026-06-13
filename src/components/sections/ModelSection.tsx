import { FadeIn } from '../ui/FadeIn'

// Each card is a deliberate information unit — not decorative.
// The structure: stat / label / one-line context.
const modelCards = [
  {
    stat: '117M',
    label: 'Parameters',
    context: 'GPT-2 base — 12 transformer layers, 768 hidden dims',
  },
  {
    stat: '103M',
    label: 'Training tokens',
    context: 'WikiText-103 raw, verified Wikipedia prose',
  },
  {
    stat: '128',
    label: 'Sequence length',
    context: 'Block size during chunked pre-processing',
  },
  {
    stat: '50,257',
    label: 'Vocabulary size',
    context: 'Byte-pair encoding, same as original GPT-2',
  },
]

const architecture = [
  { key: 'Base model', value: 'OpenAI GPT-2 (gpt2)' },
  { key: 'Architecture', value: 'Decoder-only Transformer' },
  { key: 'Attention heads', value: '12 per layer' },
  { key: 'Layers', value: '12 transformer blocks' },
  { key: 'Context window', value: '1,024 tokens' },
  { key: 'Tokenizer', value: 'BPE — 50,257 vocab' },
  { key: 'Dataset', value: 'WikiText-103-raw-v1' },
  { key: 'Objective', value: 'Causal language modeling' },
]

export function ModelSection() {
  return (
    <section id="model" className="py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <FadeIn className="mb-16">
          <span className="text-xs text-sage font-medium uppercase tracking-widest block mb-3">
            Architecture
          </span>
          <h2 className="font-serif text-display-sm text-ink mb-4">
            What's inside the model
          </h2>
          <p className="text-ink-muted max-w-lg leading-relaxed">
            The model was trained using the standard causal language modeling objective —
            predicting the next token given all preceding tokens. Fine-tuning adapts
            the pre-trained weights to Wikipedia's register and structure.
          </p>
        </FadeIn>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {modelCards.map((card, i) => (
            <FadeIn key={card.label} delay={i * 0.07} className="h-full">
              <div className="h-full bg-surface border border-border rounded-xl p-5 hover:border-sage/30 transition-colors duration-300">
                <div className="font-serif text-3xl text-ink mb-1">{card.stat}</div>
                <div className="text-xs font-medium text-sage uppercase tracking-wider mb-2">
                  {card.label}
                </div>
                <div className="text-xs text-ink-faint leading-relaxed">
                  {card.context}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Architecture table */}
        <FadeIn>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium text-ink mb-4">
                Model configuration
              </h3>
              <div className="space-y-0 border border-border rounded-xl overflow-hidden">
                {architecture.map((row, i) => (
                  <div
                    key={row.key}
                    className={`flex justify-between px-4 py-3 text-sm ${
                      i % 2 === 0 ? 'bg-surface' : 'bg-canvas'
                    }`}
                  >
                    <span className="text-ink-faint">{row.key}</span>
                    <span className="text-ink font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Training pipeline explanation */}
            <div>
              <h3 className="text-sm font-medium text-ink mb-4">
                Training pipeline
              </h3>
              <div className="space-y-4">
                {[
                  {
                    step: '01',
                    title: 'Load & clean',
                    desc: 'WikiText-103 raw loaded via Hugging Face datasets. Empty rows filtered before tokenization.',
                  },
                  {
                    step: '02',
                    title: 'Chunk',
                    desc: 'All text concatenated into one stream, then sliced into fixed 128-token blocks. No padding waste.',
                  },
                  {
                    step: '03',
                    title: 'Fine-tune',
                    desc: 'Trained with AdamW, fp16 mixed precision, gradient accumulation (effective batch 32). RTX 4050.',
                  },
                  {
                    step: '04',
                    title: 'Evaluate',
                    desc: 'Perplexity computed on held-out validation and test splits after each checkpoint.',
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <span className="text-xs font-mono text-ink-faint mt-0.5 shrink-0 w-5">
                      {item.step}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-ink mb-0.5">
                        {item.title}
                      </div>
                      <div className="text-xs text-ink-faint leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
