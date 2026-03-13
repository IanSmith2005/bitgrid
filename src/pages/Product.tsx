import { Link } from 'react-router-dom'
import { CheckCircle2, XCircle, Cpu, Zap, Shield, Users, BarChart3, ArrowRight } from 'lucide-react'

const primitives = [
  { icon: Zap, label: 'Job Request', desc: 'A structured spec posted on-chain with compute type, input hash, budget, and deadline.' },
  { icon: Shield, label: 'Escrowed Payment', desc: 'BTC is locked in the OP_NET smart contract at job posting. Released only on verified completion.' },
  { icon: Cpu, label: 'Worker Assignment', desc: 'A node claims the job and is bound to it. Double-claiming is prevented by contract state.' },
  { icon: BarChart3, label: 'Proof / Verification', desc: 'Result hash submitted on-chain. Challenge window enforces correctness.' },
  { icon: Zap, label: 'Settlement', desc: 'Deterministic payout or refund based on verification outcome.' },
  { icon: Users, label: 'Reputation Layer', desc: 'Completed jobs improve node score. Failures and disputes lower it. Score affects job access.' },
]

const jobClasses = [
  { type: 'CPU Jobs', desc: 'Data processing, backtesting, indexing, automation workflows', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { type: 'GPU Jobs', desc: 'Rendering, transcoding, general tensor workloads', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { type: 'AI Inference', desc: 'Small model inference, embeddings, classification, scoring pipelines', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
  { type: 'Data Transform', desc: 'CSV normalization, ETL pipelines, deduplication, schema mapping', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  { type: 'Rendering', desc: 'Blender scenes, animation frames, video encoding, asset previews', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
]

const roles = [
  { role: 'Buyer', desc: 'Posts jobs, escrows BTC, receives verified outputs.', icon: Users },
  { role: 'Worker Node', desc: 'Claims jobs, executes tasks, submits result proofs, earns BTC.', icon: Cpu },
  { role: 'Verifier / Challenger', desc: 'Contests invalid results during the challenge window. Earns a slash reward.', icon: Shield },
  { role: 'Protocol Layer', desc: 'OP_NET contracts coordinate job state, escrow, and dispute resolution.', icon: Zap },
]

const isNots = [
  'A Bitcoin miner marketplace',
  'A cloud hosting provider',
  'A general-purpose Layer 2',
  'A token economy (no native governance token)',
  'A system that runs jobs on Bitcoin itself',
]

export default function Product() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <div className="section-label mx-auto w-fit">Product</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          What BitGrid Is
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">
          A decentralized marketplace for compute tasks. Buyers pay in BTC.
          Workers earn BTC. OP_NET smart contracts coordinate job state and release conditions.
        </p>
      </div>

      {/* What it is / is not */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <div className="card border-success/20">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={16} className="text-success" />
            <h2 className="text-white font-semibold">What BitGrid Is</h2>
          </div>
          <ul className="flex flex-col gap-2.5">
            {[
              'A decentralized marketplace for verifiable compute tasks',
              'BTC-denominated pricing and settlement',
              'OP_NET smart contracts enforce escrow, assignment, and payout',
              'Two-sided: buyers post jobs, workers supply compute',
              'Open, permissionless participation from day one',
              'Reputation system for node trust accumulation',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-text-muted">
                <CheckCircle2 size={12} className="text-success mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="card border-error/20">
          <div className="flex items-center gap-2 mb-4">
            <XCircle size={16} className="text-error" />
            <h2 className="text-white font-semibold">What BitGrid Is Not</h2>
          </div>
          <ul className="flex flex-col gap-2.5">
            {isNots.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-text-muted">
                <XCircle size={12} className="text-error mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Core Primitives */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Core Primitives</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {primitives.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="card-hover flex flex-col gap-3">
              <div className="w-9 h-9 rounded-xl bg-bitcoin/10 border border-bitcoin/20 flex items-center justify-center">
                <Icon size={16} className="text-bitcoin" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm mb-1">{label}</h3>
                <p className="text-text-muted text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Job Classes */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Supported Job Classes</h2>
        <div className="flex flex-col gap-3">
          {jobClasses.map(({ type, desc, color, bg }) => (
            <div key={type} className="card flex items-center gap-4">
              <div className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${color} ${bg} flex-shrink-0`}>
                {type}
              </div>
              <p className="text-text-muted text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Roles */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Marketplace Roles</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {roles.map(({ role, desc, icon: Icon }) => (
            <div key={role} className="card flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-bg-surface border border-border-subtle flex items-center justify-center flex-shrink-0">
                <Icon size={15} className="text-text-muted" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm mb-1">{role}</h3>
                <p className="text-text-muted text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Link to="/how-it-works" className="btn-primary text-sm">
          How It Works <ArrowRight size={14} />
        </Link>
        <Link to="/marketplace" className="btn-secondary text-sm">
          Open Marketplace
        </Link>
      </div>
    </div>
  )
}
