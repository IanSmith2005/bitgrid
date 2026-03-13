import { Link } from 'react-router-dom'
import { Monitor, Code2, Cpu, BarChart3, Bitcoin, ArrowRight, ChevronRight } from 'lucide-react'

const layers = [
  {
    icon: Monitor,
    title: 'Frontend',
    tech: 'React + Vite + TypeScript',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    items: [
      'Wallet connection (OP_NET wallet integration)',
      'Buyer flow: job submission, status tracking, payment',
      'Worker flow: dashboard, job acceptance, earnings',
      'Network explorer: global job feed, stats, leaderboard',
      'Responsive single-page application',
    ],
  },
  {
    icon: Code2,
    title: 'OP_NET Contract Layer',
    tech: 'AssemblyScript / WASM on Bitcoin L1',
    color: 'text-bitcoin',
    bg: 'bg-bitcoin/10 border-bitcoin/20',
    items: [
      'Job Registry: post, assign, status transitions',
      'Escrow Logic: lock and conditional release of BTC',
      'Challenge State: challenge window, verifier contest',
      'Settlement: deterministic payout or refund',
      'Reputation: score increments and slash events',
    ],
  },
  {
    icon: Cpu,
    title: 'Worker Client',
    tech: 'CLI daemon (Node.js / Rust)',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
    items: [
      'Task fetcher: polls job contract for available work',
      'Hardware profile registration on-chain',
      'Sandboxed execution environment (Docker / WASM)',
      'Proof submission: output hash broadcast to contract',
      'Earnings tracker and local job history',
    ],
  },
  {
    icon: BarChart3,
    title: 'Indexing Layer',
    tech: 'Event indexer + queryable API',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    items: [
      'Indexes all job events from the OP_NET contract',
      'Worker stats, reputation scores, completion history',
      'Queryable marketplace data (open jobs, earnings)',
      'WebSocket feed for live job board updates',
      'Proof record archive with IPFS CID lookups',
    ],
  },
  {
    icon: Bitcoin,
    title: 'Bitcoin Settlement',
    tech: 'Bitcoin L1 via OP_NET',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    items: [
      'All escrow and payout in native BTC (satoshis)',
      'No bridge, no wrapped token, no external chain',
      'Tapscript-encoded calldata via OP_NET protocol',
      'Finality: Bitcoin block confirmations',
      'Contract state secured by Bitcoin\'s PoW',
    ],
  },
]

const contractModules = [
  { name: 'JobRegistry', desc: 'Stores job state: post → assigned → verifying → settled' },
  { name: 'EscrowVault', desc: 'Locks BTC at posting, releases on verified completion or refunds on failure' },
  { name: 'WorkerRegistry', desc: 'Node hardware profiles, reputation scores, availability' },
  { name: 'ChallengeManager', desc: 'Opens/closes challenge windows, accepts verifier contests' },
  { name: 'DisputeArbiter', desc: 'Resolves conflicting proofs using deterministic rules' },
  { name: 'SettlementEngine', desc: 'Final payout or refund after arbitration outcome' },
]

export default function Architecture() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <div className="section-label mx-auto w-fit">Architecture</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Technical Architecture
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">
          BitGrid is a layered system. Compute runs off-chain. Proof records,
          escrow, and settlement live on Bitcoin L1 via OP_NET.
        </p>
      </div>

      {/* System diagram */}
      <div className="card mb-12 overflow-x-auto">
        <h3 className="text-white font-semibold text-sm mb-5">System Overview</h3>
        <div className="flex items-center gap-1 flex-nowrap min-w-max pb-1">
          {[
            { label: 'Buyer UI', sub: 'React' },
            null,
            { label: 'Job Contract', sub: 'OP_NET' },
            null,
            { label: 'Worker Client', sub: 'CLI' },
            null,
            { label: 'Indexer', sub: 'API' },
            null,
            { label: 'Bitcoin L1', sub: 'Settlement' },
          ].map((item, i) =>
            item === null ? (
              <ChevronRight key={i} size={14} className="text-bitcoin flex-shrink-0" />
            ) : (
              <div key={i} className="flex flex-col items-center gap-0.5 px-4 py-2.5 bg-bg-surface rounded-xl border border-border-subtle flex-shrink-0">
                <span className="text-white text-xs font-semibold">{item.label}</span>
                <span className="text-text-dim text-[10px]">{item.sub}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Layers */}
      <div className="flex flex-col gap-6 mb-16">
        {layers.map(({ icon: Icon, title, tech, color, bg, items }) => (
          <div key={title} className="card grid lg:grid-cols-[220px_1fr] gap-5">
            <div className="flex flex-col gap-3">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${bg}`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <h2 className="text-white font-bold">{title}</h2>
                <p className={`text-xs mt-0.5 font-mono ${color}`}>{tech}</p>
              </div>
            </div>
            <ul className="flex flex-col gap-2">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-text-muted">
                  <div className="w-1.5 h-1.5 rounded-full bg-bitcoin mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Contract modules */}
      <h2 className="text-2xl font-bold tracking-tight mb-6">OP_NET Contract Modules</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {contractModules.map(({ name, desc }) => (
          <div key={name} className="card">
            <h4 className="text-bitcoin font-mono font-semibold text-sm mb-1">{name}</h4>
            <p className="text-text-muted text-xs leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Why OP_NET */}
      <div className="card border-bitcoin/20 mb-12">
        <h3 className="text-white font-semibold mb-4">Why OP_NET for This</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            ['Bitcoin L1 finality', 'Contract state is secured by Bitcoin PoW — no separate validator set.'],
            ['Native BTC economics', 'Escrow and settlement in satoshis. No wrapping, no bridges.'],
            ['WebAssembly contracts', 'AssemblyScript-compiled contracts run in a deterministic WASM VM.'],
            ['Tapscript calldata', 'Contract calls encoded in Bitcoin transactions — not OP_RETURN, not inscriptions.'],
          ].map(([title, desc]) => (
            <div key={title} className="flex gap-2 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-bitcoin mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-white text-sm font-medium">{title}</p>
                <p className="text-text-muted text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link to="/verification" className="btn-primary text-sm">
          Verification Model <ArrowRight size={14} />
        </Link>
        <Link to="/demo" className="btn-secondary text-sm">
          See It In Action
        </Link>
      </div>
    </div>
  )
}
