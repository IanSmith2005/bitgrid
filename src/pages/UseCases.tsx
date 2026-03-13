import { Link } from 'react-router-dom'
import { Brain, Video, Database, FlaskConical, Building2, ArrowRight } from 'lucide-react'

const cases = [
  {
    icon: Brain,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    title: 'AI Inference',
    tagline: 'Pay-per-request model inference on Bitcoin',
    desc: 'Run ML models on demand without spinning up persistent cloud infrastructure. Pay in BTC, settle on Bitcoin L1.',
    examples: [
      'Image classification (ResNet, CLIP, BLIP)',
      'Text embeddings (BERT, sentence-transformers)',
      'Lightweight LLM scoring and token probability',
      'Batch prompt evaluation pipelines',
      'Recommendation scoring over large item sets',
    ],
    cta: 'Submit AI job',
  },
  {
    icon: Video,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    title: 'Rendering',
    tagline: 'Outsource 3D and video workloads globally',
    desc: 'Burst rendering demand without long-term GPU contracts. Workers are matched to rendering jobs by hardware class.',
    examples: [
      '3D scene rendering (Blender, Cinema4D)',
      'Animation frame sequences',
      'Video transcoding (H.264 → H.265, AVIF)',
      'Asset preview generation at scale',
      'Batch thumbnail and thumbnail-strip export',
    ],
    cta: 'Post render job',
  },
  {
    icon: Database,
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
    title: 'Data Processing',
    tagline: 'Verifiable ETL and analytics at scale',
    desc: 'Submit batch data jobs with reproducible outputs. Deterministic tasks are ideal for dual-run verification.',
    examples: [
      'CSV normalization and deduplication',
      'ETL pipeline execution',
      'Analytics aggregation (group-by, window functions)',
      'Time-series indexing jobs',
      'Strategy backtesting on OHLCV datasets',
    ],
    cta: 'Submit data job',
  },
  {
    icon: FlaskConical,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    title: 'Research & Automation',
    tagline: 'Scheduled and repeatable compute workflows',
    desc: 'Run scientific simulations, repeatable pipelines, or scheduled batch tasks with BTC-denominated pricing.',
    examples: [
      'Monte Carlo simulations',
      'Scheduled nightly compute jobs',
      'Parameter sweep experiments',
      'Genomics and bioinformatics pipelines',
      'Reproducible academic compute jobs',
    ],
    cta: 'Submit research job',
  },
  {
    icon: Building2,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    title: 'Enterprise Workloads',
    tagline: 'Cost-transparent burst compute for teams',
    desc: 'Enterprise buyers get cost-transparent, verifiable execution — without trusting a centralized cloud provider.',
    examples: [
      'Burst compute demand during peak traffic',
      'Verifiable external execution for audit trails',
      'Cost-transparent pay-per-job model',
      'Supplier diversity without vendor lock-in',
      'AI pipeline integration via BitGrid API',
    ],
    cta: 'Talk to us',
  },
]

export default function UseCases() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <div className="section-label mx-auto w-fit">Use Cases</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Middleware for the compute economy
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">
          BitGrid handles any reproducible compute workload that can be expressed as
          input → output. Bitcoin-native pricing, settlement, and verification built in.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {cases.map(({ icon: Icon, color, bg, title, tagline, desc, examples, cta }) => (
          <div key={title} className="card-hover grid lg:grid-cols-[200px_1fr] gap-6">
            <div className="flex flex-col items-start gap-3">
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${bg}`}>
                <Icon size={22} className={color} />
              </div>
              <div>
                <h2 className="text-white font-bold text-xl">{title}</h2>
                <p className={`text-xs font-medium mt-0.5 ${color}`}>{tagline}</p>
              </div>
              <Link to="/marketplace" className="btn-secondary text-xs mt-auto">
                {cta} <ArrowRight size={11} />
              </Link>
            </div>
            <div>
              <p className="text-text-muted text-sm leading-relaxed mb-4">{desc}</p>
              <ul className="grid sm:grid-cols-2 gap-2">
                {examples.map((ex) => (
                  <li key={ex} className="flex items-start gap-2 text-sm text-text-muted bg-bg-surface rounded-lg px-3 py-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-bitcoin mt-1.5 flex-shrink-0" />
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 card bg-gradient-to-r from-bg-surface to-bg-card border-bitcoin/15 text-center py-10">
        <h2 className="text-2xl font-bold tracking-tight mb-2">BitGrid is not just a dApp.</h2>
        <p className="text-text-muted text-sm max-w-xl mx-auto mb-6">
          It is middleware for a Bitcoin-native compute economy — extensible into AI, rendering,
          data infrastructure, and beyond.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/marketplace" className="btn-primary text-sm">
            Launch Marketplace <ArrowRight size={14} />
          </Link>
          <Link to="/developers" className="btn-secondary text-sm">
            Integrate as Buyer
          </Link>
        </div>
      </div>
    </div>
  )
}
