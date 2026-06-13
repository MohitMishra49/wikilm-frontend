import { FadeIn } from '../ui/FadeIn'

const SKILLS = [
  { category: 'Machine Learning', items: ['Fine-tuning LLMs', 'Causal language modeling', 'Dataset preprocessing', 'Perplexity evaluation', 'Hyperparameter tuning'] },
  { category: 'Engineering', items: ['PyTorch', 'Hugging Face Transformers', 'FastAPI', 'fp16 mixed precision', 'Gradient accumulation'] },
  { category: 'Frontend', items: ['React + TypeScript', 'Framer Motion', 'Tailwind CSS', 'API integration', 'Responsive design'] },
]

const TECH_STACK = [
  { label: 'Model', value: 'GPT-2 base (OpenAI)', href: 'https://huggingface.co/gpt2' },
  { label: 'Training', value: 'Hugging Face Trainer', href: 'https://huggingface.co/docs/transformers/trainer' },
  { label: 'Dataset', value: 'WikiText-103-raw-v1', href: 'https://huggingface.co/datasets/wikitext' },
  { label: 'Backend', value: 'FastAPI + Uvicorn', href: 'https://fastapi.tiangolo.com' },
  { label: 'Frontend', value: 'React + Vite + TS', href: 'https://vitejs.dev' },
  { label: 'Styling', value: 'Tailwind CSS', href: 'https://tailwindcss.com' },
  { label: 'Animation', value: 'Framer Motion', href: 'https://www.framer.com/motion' },
  { label: 'Hardware', value: 'NVIDIA RTX 4050 6GB', href: '#' },
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <FadeIn className="mb-16">
          <span className="text-xs text-sage font-medium uppercase tracking-widest block mb-3">
            Project
          </span>
          <h2 className="font-serif text-display-sm text-ink mb-4">
            What this demonstrates
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Project description */}
          <FadeIn>
            <div className="space-y-4 text-ink-muted leading-relaxed text-sm">
              <p>
                This project started from a blank Jupyter notebook and ended with a deployed,
                interactive language model. The goal was to demonstrate the complete
                ML engineering cycle — not just the model training, but everything around it.
              </p>
              <p>
                WikiText-103 was chosen because it's a well-studied benchmark with a known
                baseline perplexity for GPT-2 (29.4). That makes improvement measurable.
                After fine-tuning, the model reaches <span className="text-ink">17.8 perplexity</span> on
                the validation set — a 39% reduction.
              </p>
              <p>
                The training setup was designed specifically for a 6GB consumer GPU.
                Every hyperparameter choice (block size, batch size, gradient accumulation)
                was made to maximize throughput within that constraint without sacrificing
                training stability.
              </p>
              <p>
                The frontend intentionally avoids the "demo project" aesthetic. It's
                designed the way a product engineer would build it — components are
                composable, state is managed through a custom hook, API errors surface
                to users in plain language, and the interface works keyboard-first.
              </p>
            </div>
          </FadeIn>

          {/* Skills demonstrated */}
          <FadeIn delay={0.1}>
            <div className="space-y-6">
              {SKILLS.map((group) => (
                <div key={group.category}>
                  <h3 className="text-xs font-medium text-ink uppercase tracking-wider mb-3">
                    {group.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs text-ink-muted bg-surface border border-border px-3 py-1.5 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Tech stack */}
        <FadeIn>
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-medium text-ink">Technology stack</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-border">
              {TECH_STACK.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-4 hover:bg-surface/60 transition-colors duration-150 group"
                >
                  <div className="text-xs text-ink-faint mb-1">{item.label}</div>
                  <div className="text-sm text-ink group-hover:text-sage transition-colors duration-150">
                    {item.value}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
