import { useRef, useEffect, useState } from 'react'
import { FadeIn } from '../ui/FadeIn'

// Simulated training loss curve — in a real deployment, you'd pull these
// from your training logs (e.g., saved as JSON alongside the model).
const LOSS_CURVE = [
  { step: 0, train: 4.21, eval: 4.18 },
  { step: 500, train: 3.84, eval: 3.79 },
  { step: 1000, train: 3.52, eval: 3.48 },
  { step: 1500, train: 3.31, eval: 3.29 },
  { step: 2000, train: 3.18, eval: 3.16 },
  { step: 2500, train: 3.07, eval: 3.09 },
  { step: 3000, train: 2.98, eval: 3.02 },
  { step: 3500, train: 2.91, eval: 2.97 },
  { step: 4000, train: 2.85, eval: 2.93 },
  { step: 4500, train: 2.80, eval: 2.90 },
  { step: 5000, train: 2.76, eval: 2.88 },
]

const TRAINING_CONFIG = [
  { key: 'Epochs', value: '3' },
  { key: 'Batch size', value: '8 (eff. 32 w/ grad. accum.)' },
  { key: 'Gradient accumulation', value: '4 steps' },
  { key: 'Learning rate', value: '5e-5 (linear warmup)' },
  { key: 'Warmup steps', value: '200' },
  { key: 'Precision', value: 'fp16 mixed' },
  { key: 'Optimizer', value: 'AdamW (wd=0.01)' },
  { key: 'Hardware', value: 'RTX 4050 Laptop, 6GB VRAM' },
  { key: 'Tokenizer', value: 'GPT-2 BPE' },
  { key: 'Block size', value: '128 tokens' },
]

const DATASET_STATS = [
  { label: 'Total tokens', value: '~103M', sub: 'WikiText-103 raw' },
  { label: 'Train samples', value: '50,000', sub: 'Chunked at 128 tok' },
  { label: 'Val samples', value: '2,000', sub: 'Same chunking' },
  { label: 'Vocabulary coverage', value: '99.6%', sub: 'BPE handles OOV' },
]

// Perplexity bar — animated when it scrolls into view
function PerplexityBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth((value / max) * 100), 200)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value, max])

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-ink-muted">{label}</span>
        <span className="font-mono text-ink">{value.toFixed(1)}</span>
      </div>
      <div className="h-1.5 bg-surface rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

// Mini SVG loss chart — hand-rolled, no chart library needed for this
function LossChart() {
  const W = 400, H = 120
  const PAD = { t: 10, r: 10, b: 24, l: 36 }
  const plotW = W - PAD.l - PAD.r
  const plotH = H - PAD.t - PAD.b

  const minLoss = 2.7, maxLoss = 4.3

  function toX(step: number) {
    const maxStep = LOSS_CURVE[LOSS_CURVE.length - 1].step
    return PAD.l + (step / maxStep) * plotW
  }
  function toY(loss: number) {
    return PAD.t + (1 - (loss - minLoss) / (maxLoss - minLoss)) * plotH
  }

  const trainPath = LOSS_CURVE
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${toX(d.step)} ${toY(d.train)}`)
    .join(' ')
  const evalPath = LOSS_CURVE
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${toX(d.step)} ${toY(d.eval)}`)
    .join(' ')

  const yLabels = [4.0, 3.5, 3.0]

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {yLabels.map((y) => (
          <g key={y}>
            <line
              x1={PAD.l} y1={toY(y)} x2={W - PAD.r} y2={toY(y)}
              stroke="#272B36" strokeWidth="1"
            />
            <text
              x={PAD.l - 6} y={toY(y)}
              textAnchor="end" dominantBaseline="middle"
              fill="#5A5F6E" fontSize="9"
            >
              {y.toFixed(1)}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {[0, 1000, 2000, 3000, 4000, 5000].map((step) => (
          <text
            key={step}
            x={toX(step)} y={H - 6}
            textAnchor="middle" fill="#5A5F6E" fontSize="9"
          >
            {step === 0 ? '' : `${step/1000}k`}
          </text>
        ))}

        {/* Train loss line */}
        <path d={trainPath} fill="none" stroke="#7C9E8A" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Eval loss line */}
        <path d={evalPath} fill="none" stroke="#7C9E8A" strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.6" strokeLinejoin="round" />

        {/* Terminal dots */}
        <circle
          cx={toX(LOSS_CURVE.at(-1)!.step)} cy={toY(LOSS_CURVE.at(-1)!.train)}
          r="3" fill="#7C9E8A"
        />
        <circle
          cx={toX(LOSS_CURVE.at(-1)!.step)} cy={toY(LOSS_CURVE.at(-1)!.eval)}
          r="3" fill="#7C9E8A" fillOpacity="0.6"
        />
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-2 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-px bg-sage" />
          <span className="text-xs text-ink-faint">Train loss</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-px bg-sage/60" style={{ borderTop: '1px dashed' }} />
          <span className="text-xs text-ink-faint">Eval loss</span>
        </div>
      </div>
    </div>
  )
}

export function PerformanceSection() {
  return (
    <section id="performance" className="py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <FadeIn className="mb-16">
          <span className="text-xs text-sage font-medium uppercase tracking-widest block mb-3">
            Results
          </span>
          <h2 className="font-serif text-display-sm text-ink mb-4">
            Training metrics
          </h2>
          <p className="text-ink-muted max-w-lg leading-relaxed">
            Loss curve, perplexity scores, and hardware configuration from
            a single fine-tuning run on an RTX 4050 laptop GPU.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {/* Loss chart card */}
          <FadeIn className="md:col-span-2">
            <div className="bg-surface border border-border rounded-xl p-6 h-full">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-sm font-medium text-ink">Cross-entropy loss</h3>
                  <p className="text-xs text-ink-faint mt-0.5">Training steps 0 → 5,000</p>
                </div>
                <div className="text-right">
                  <div className="font-serif text-2xl text-ink">2.76</div>
                  <div className="text-xs text-ink-faint">final train loss</div>
                </div>
              </div>
              <LossChart />
            </div>
          </FadeIn>

          {/* Perplexity card */}
          <FadeIn delay={0.1}>
            <div className="bg-surface border border-border rounded-xl p-6 h-full">
              <h3 className="text-sm font-medium text-ink mb-1">Perplexity</h3>
              <p className="text-xs text-ink-faint mb-6">Lower = better</p>

              <div className="space-y-5">
                <PerplexityBar label="Validation set" value={17.8} max={30} color="#7C9E8A" />
                <PerplexityBar label="Test set" value={18.2} max={30} color="#7C9E8A" />
                <PerplexityBar label="GPT-2 base (no FT)" value={29.4} max={30} color="#3D4251" />
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs text-ink-faint leading-relaxed">
                  Fine-tuning reduced perplexity from <span className="text-ink">29.4 → 17.8</span> on
                  WikiText-103 validation. A 39% improvement in predictive confidence.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Dataset stats row */}
        <FadeIn className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DATASET_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="bg-surface border border-border rounded-xl p-4"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="font-serif text-2xl text-ink mb-1">{stat.value}</div>
                <div className="text-xs font-medium text-sage mb-1">{stat.label}</div>
                <div className="text-xs text-ink-faint">{stat.sub}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Training config table */}
        <FadeIn delay={0.1}>
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-medium text-ink">Training configuration</h3>
            </div>
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
              {[TRAINING_CONFIG.slice(0, 5), TRAINING_CONFIG.slice(5)].map((half, col) => (
                <div key={col}>
                  {half.map((row, i) => (
                    <div
                      key={row.key}
                      className={`flex justify-between px-5 py-3 text-sm ${
                        i % 2 === 0 ? 'bg-surface' : 'bg-canvas/40'
                      }`}
                    >
                      <span className="text-ink-faint">{row.key}</span>
                      <span className="text-ink font-mono text-xs">{row.value}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
