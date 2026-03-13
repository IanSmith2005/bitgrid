import { Link } from 'react-router-dom'
import { Shield, Users, BarChart3, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react'

const models = [
  {
    icon: Users,
    title: 'Dual-Run Verification',
    tag: 'High trust',
    color: 'text-bitcoin',
    bg: 'bg-bitcoin/10 border-bitcoin/20',
    desc: 'Two independent workers execute the same job. Their output hashes are compared. If they match, the result is accepted. If they differ, the contract enters dispute state.',
    when: 'Best for: AI inference, deterministic data transforms, high-value jobs',
    cost: 'Cost: ~2× the worker fee, but strong correctness guarantee',
  },
  {
    icon: Shield,
    title: 'Challenger System',
    tag: 'Open challenge',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    desc: 'A single worker executes the job. A challenge window opens (e.g., 10 blocks). Any registered verifier can re-execute the task and submit a conflicting result hash. If no challenge arrives, the result is accepted.',
    when: 'Best for: rendering, video transcoding, medium-value jobs',
    cost: 'Cost: Lower overhead. Challenger earns a reward from the slashed worker.',
  },
  {
    icon: BarChart3,
    title: 'Sample Verification',
    tag: 'Statistical',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
    desc: 'For large batch jobs, a randomly selected subset of outputs is verified. Statistical sampling provides a correctness guarantee proportional to sample size.',
    when: 'Best for: large batch data jobs, backtesting, embeddings over many items',
    cost: 'Cost: Much cheaper than full dual-run for large jobs',
  },
  {
    icon: TrendingUp,
    title: 'Reputation-Weighted',
    tag: 'Trusted nodes',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    desc: 'High-reputation nodes with sustained completion records are trusted to execute with minimal verification overhead. Score is built over time through successful completions.',
    when: 'Best for: low-value jobs, repeat buyers using known nodes, fast turnaround',
    cost: 'Cost: Lowest overhead. High reputation workers get priority routing.',
  },
]

const disputeSteps = [
  { step: '1', label: 'Worker submits result hash', desc: 'On-chain, referencing job ID and output CID.' },
  { step: '2', label: 'Challenge window opens', desc: 'Duration defined per job class in the contract.' },
  { step: '3', label: 'Verifier submits contest', desc: 'Includes their own result hash and execution proof.' },
  { step: '4', label: 'Contract arbitration', desc: 'Deterministic rules or trusted arbiter resolves based on proof.' },
  { step: '5', label: 'Outcome applied', desc: 'Winner receives escrowed BTC. Loser\'s reputation is penalized.' },
]

export default function Verification() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <div className="section-label mx-auto w-fit">Verification &amp; Trust</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          How do you know results are correct?
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">
          BitGrid uses multiple verification models depending on job class and risk level.
          Challenge windows, proof records, and reputation enforcement are all on-chain.
        </p>
      </div>

      {/* MVP position */}
      <div className="card border-bitcoin/20 mb-12 flex gap-4">
        <div className="w-1 rounded-full bg-bitcoin flex-shrink-0" />
        <div>
          <h3 className="text-white font-semibold mb-1">MVP Approach</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            The first version of BitGrid is designed around <strong className="text-white">deterministic tasks</strong> —
            jobs whose outputs can be reproduced given the same inputs and environment.
            Dual-run verification and challenger-mode are the primary trust mechanisms at launch.
            Non-deterministic tasks (e.g., generative AI) require custom verification schemes and are on the roadmap.
          </p>
        </div>
      </div>

      {/* Verification models */}
      <h2 className="text-2xl font-bold tracking-tight mb-6">Verification Models</h2>
      <div className="grid md:grid-cols-2 gap-5 mb-16">
        {models.map(({ icon: Icon, title, tag, color, bg, desc, when, cost }) => (
          <div key={title} className="card flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${bg}`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">{title}</h3>
                <span className={`text-xs ${color}`}>{tag}</span>
              </div>
            </div>
            <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
            <div className="flex flex-col gap-1.5 bg-bg-surface rounded-lg p-3">
              <p className="text-xs text-text-dim">{when}</p>
              <p className="text-xs text-text-dim">{cost}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Dispute Logic */}
      <h2 className="text-2xl font-bold tracking-tight mb-6">Dispute Logic</h2>
      <div className="flex flex-col gap-3 mb-12">
        {disputeSteps.map(({ step, label, desc }) => (
          <div key={step} className="flex items-start gap-4 card">
            <div className="w-8 h-8 rounded-full bg-bitcoin/10 border border-bitcoin/20 flex items-center justify-center flex-shrink-0">
              <span className="text-bitcoin text-xs font-bold">{step}</span>
            </div>
            <div>
              <h4 className="text-white text-sm font-medium">{label}</h4>
              <p className="text-text-muted text-xs mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Why it matters */}
      <div className="card border-success/20 mb-12">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 size={16} className="text-success" />
          <h3 className="text-white font-semibold">Why This Model Is Credible</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            'Proof records are stored on Bitcoin L1 — immutable and auditable',
            'Challenge windows incentivize honest verification economically',
            'Reputation scores accumulate over real job history on-chain',
            'Deterministic job classes are inherently verifiable and reproducible',
            'Slashing penalizes dishonest workers without central arbitration',
            'No special trust in any node required at the protocol level',
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm text-text-muted">
              <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* What isn't claimed */}
      <div className="card border-warning/20 mb-12">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={15} className="text-warning" />
          <h3 className="text-white font-semibold text-sm">What BitGrid Does Not Claim</h3>
        </div>
        <ul className="flex flex-col gap-2">
          {[
            '"Trustless AI" — non-deterministic generative models require special handling',
            '"Guaranteed correctness for every workload" — probabilistic sampling has statistical bounds',
            '"All computation happens on-chain" — only proof hashes and state live on Bitcoin',
          ].map((item) => (
            <li key={item} className="text-text-muted text-sm flex items-start gap-2">
              <AlertTriangle size={11} className="text-warning mt-0.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link to="/how-it-works" className="btn-primary text-sm">
          How It Works <ArrowRight size={14} />
        </Link>
        <Link to="/architecture" className="btn-secondary text-sm">
          Architecture
        </Link>
      </div>
    </div>
  )
}
