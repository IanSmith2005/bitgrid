import { Link } from 'react-router-dom'
import {
  ArrowRight, Zap, Shield, Cpu, Globe, CheckCircle2,
  BarChart3, Users, TrendingUp, ChevronRight,
  Brain, Video, Database, FlaskConical, Bitcoin, Lock
} from 'lucide-react'
import { networkStats, mockJobs } from '../data/mockData'
import GridBackground from '../components/GridBackground'

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card flex flex-col gap-1">
      <span className="text-2xl font-bold text-white">{value}</span>
      <span className="text-sm font-medium text-text-muted">{label}</span>
      {sub && <span className="text-xs text-text-dim">{sub}</span>}
    </div>
  )
}

const problems = [
  { icon: Globe, text: 'Compute supply is fragmented across dozens of siloed providers' },
  { icon: Users, text: 'Small operators cannot monetize idle CPU/GPU capacity easily' },
  { icon: Lock, text: 'Buyers must trust centralized providers with no on-chain guarantees' },
  { icon: Bitcoin, text: 'Crypto compute markets settle off-chain or on non-Bitcoin infrastructure' },
]

const solutions = [
  { icon: Database, label: 'Job Marketplace', text: 'Open, permissionless job board with BTC-denominated pricing' },
  { icon: Globe, label: 'Worker Network', text: 'Distributed nodes earn BTC for verifiable compute results' },
  { icon: Shield, label: 'Verifiable Execution', text: 'Challenge windows and proof records enforce result integrity' },
  { icon: Bitcoin, label: 'BTC Settlement', text: 'OP_NET smart contracts escrow and release payments on Bitcoin L1' },
]

const steps = [
  {
    num: '01',
    title: 'Post a job',
    desc: 'Buyer selects compute type, uploads job spec, and escrows a BTC budget into the OP_NET smart contract.',
    color: 'from-bitcoin/20 to-transparent',
  },
  {
    num: '02',
    title: 'Worker claims',
    desc: 'A node stakes availability, accepts the task, and begins execution in a sandboxed environment.',
    color: 'from-orange-500/20 to-transparent',
  },
  {
    num: '03',
    title: 'Result submitted',
    desc: 'Worker submits a result hash on-chain. The output reference is optionally delivered off-chain via IPFS.',
    color: 'from-yellow-500/20 to-transparent',
  },
  {
    num: '04',
    title: 'Verification',
    desc: 'A challenge window opens. Verifiers can contest the result. Honest outputs pass; invalid ones are slashed.',
    color: 'from-green-500/20 to-transparent',
  },
  {
    num: '05',
    title: 'BTC released',
    desc: 'The smart contract releases the escrowed BTC to the worker. Failed jobs trigger refund or dispute resolution.',
    color: 'from-blue-500/20 to-transparent',
  },
]

const useCases = [
  { icon: Brain, label: 'AI Inference', desc: 'Pay-per-request model inference, image classification, LLM scoring', color: 'text-purple-400' },
  { icon: Video, label: 'Rendering', desc: '3D scenes, animation frames, video transcoding, asset previews', color: 'text-blue-400' },
  { icon: Database, label: 'Data Processing', desc: 'CSV/ETL tasks, analytics jobs, indexing, backtesting pipelines', color: 'text-green-400' },
  { icon: FlaskConical, label: 'Research', desc: 'Scheduled simulations, repeatable workflows, automation jobs', color: 'text-yellow-400' },
]

const whyOpnet = [
  { label: 'Bitcoin L1 smart contracts', desc: 'Contract logic executes with Bitcoin finality — no separate chain required.' },
  { label: 'Native BTC payments', desc: 'Escrow and settlement denominated in satoshis. No wrapped tokens, no bridges.' },
  { label: 'Deterministic execution', desc: 'WebAssembly-based contract environment ensures reproducible state.' },
  { label: 'No bridge dependency', desc: 'BitGrid inherits Bitcoin security without cross-chain trust assumptions.' },
  { label: 'Programmable logic', desc: 'Job registry, escrow, challenge windows, and payout all live in OP_NET contracts.' },
  { label: 'Open participation', desc: 'Any worker can register. Any buyer can post. Permissionless from day one.' },
]

export default function Landing() {
  const openJobs = mockJobs.filter((j) => j.status === 'open').slice(0, 3)

  return (
    <div className="relative">

      {/* ── HERO ── */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated grid background */}
        <GridBackground />
        {/* Glow */}
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-bitcoin/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="section-label mx-auto w-fit">
            <Zap size={10} className="fill-bitcoin" />
            OP_NET Vibecode Contest 2026
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
            A decentralized{' '}
            <span className="text-gradient">compute marketplace</span>
            <br />on Bitcoin
          </h1>

          <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Submit jobs, rent CPU/GPU power, verify results, and settle in BTC — all coordinated
            by OP_NET smart contracts on Bitcoin L1.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/demo" className="btn-primary text-sm px-6 py-3">
              Launch Demo <ArrowRight size={15} />
            </Link>
            <Link to="/marketplace" className="btn-secondary text-sm px-6 py-3">
              Submit Job
            </Link>
            <Link to="/workers" className="btn-secondary text-sm px-6 py-3">
              Become a Node
            </Link>
            <Link to="/architecture" className="btn-ghost text-sm">
              View Architecture <ChevronRight size={14} />
            </Link>
          </div>

          {/* Live pill */}
          <div className="flex items-center justify-center gap-2 mt-10 text-sm text-text-muted">
            <span className="glow-dot" />
            <span>
              <span className="text-white font-medium">{networkStats.activeNodes}</span> active nodes ·{' '}
              <span className="text-white font-medium">{networkStats.openJobs}</span> open jobs ·{' '}
              <span className="text-bitcoin font-medium">{networkStats.btcPaidToWorkers} BTC</span> paid to workers
            </span>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard label="Jobs Submitted" value={networkStats.totalJobsSubmitted.toLocaleString()} sub="all time" />
          <StatCard label="BTC Paid Out" value={`₿${networkStats.btcPaidToWorkers}`} sub="to workers" />
          <StatCard label="Active Nodes" value={networkStats.activeNodes.toString()} sub="online now" />
          <StatCard label="Success Rate" value={`${networkStats.successRate}%`} sub="last 30 days" />
          <StatCard label="Median Time" value={networkStats.medianCompletionTime} sub="per job" />
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="section-label">The Problem</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Compute markets are broken for Bitcoin
              </h2>
              <p className="text-text-muted leading-relaxed">
                The global demand for burst compute — AI inference, rendering, analytics — is enormous.
                Yet no marketplace settles natively in BTC, enforces results on-chain, or lets small
                operators participate without a custodian in the middle.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {problems.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3 card">
                  <div className="mt-0.5 w-7 h-7 rounded-lg bg-error/10 border border-error/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={13} className="text-error" />
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-label mx-auto w-fit">The Solution</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Bitcoin-native compute infrastructure</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {solutions.map(({ icon: Icon, label, text }) => (
              <div key={label} className="card-hover flex flex-col gap-3">
                <div className="w-9 h-9 rounded-xl bg-bitcoin/10 border border-bitcoin/20 flex items-center justify-center">
                  <Icon size={16} className="text-bitcoin" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{label}</h3>
                  <p className="text-text-muted text-xs leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-label mx-auto w-fit">How It Works</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">From job post to BTC payout</h2>
            <p className="text-text-muted mt-3 text-sm max-w-lg mx-auto">
              Five deterministic steps, coordinated entirely by OP_NET smart contract logic on Bitcoin L1.
            </p>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute left-[28px] top-8 bottom-8 w-px bg-gradient-to-b from-bitcoin/40 via-bitcoin/20 to-transparent" />

            <div className="flex flex-col gap-4">
              {steps.map((s) => (
                <div key={s.num} className="flex gap-5 items-start group">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-bg-card border border-border-subtle flex items-center justify-center group-hover:border-bitcoin/40 transition-colors">
                    <span className="font-mono text-xs font-bold text-bitcoin">{s.num}</span>
                  </div>
                  <div className="card flex-1 group-hover:border-bitcoin/20 transition-colors">
                    <h3 className="text-white font-semibold text-sm mb-1">{s.title}</h3>
                    <p className="text-text-muted text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <Link to="/how-it-works" className="btn-ghost text-sm">
              Full mechanism walkthrough <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-label mx-auto w-fit">Use Cases</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Middleware for the compute economy</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {useCases.map(({ icon: Icon, label, desc, color }) => (
              <div key={label} className="card-hover flex flex-col gap-3">
                <Icon size={22} className={color} />
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{label}</h3>
                  <p className="text-text-muted text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/use-cases" className="btn-ghost text-sm">
              Explore all use cases <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY OPNET ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="lg:grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 mb-8 lg:mb-0">
              <div className="section-label">Why OP_NET</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Bitcoin L1 as the settlement layer
              </h2>
              <p className="text-text-muted leading-relaxed text-sm mb-6">
                OP_NET enables programmable logic — escrow, challenges, payouts — using
                Bitcoin's own security model. No separate gas token. No bridge. Native BTC only.
              </p>
              <a
                href="https://opnet.org"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary text-sm"
              >
                Learn OP_NET <ExternalLinkIcon />
              </a>
            </div>
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {whyOpnet.map(({ label, desc }) => (
                <div key={label} className="card flex gap-3 items-start">
                  <CheckCircle2 size={14} className="text-bitcoin mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white text-sm font-medium mb-0.5">{label}</h4>
                    <p className="text-text-muted text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE JOB PREVIEW ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="section-label">Live Marketplace</div>
              <h2 className="text-2xl font-bold tracking-tight">Open jobs right now</h2>
            </div>
            <Link to="/marketplace" className="btn-secondary text-xs">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {openJobs.map((job) => (
              <Link key={job.id} to="/marketplace" className="card-hover flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-bg-surface border border-border-subtle flex items-center justify-center flex-shrink-0">
                    <Cpu size={13} className="text-text-muted" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{job.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`badge ${job.computeClass === 'gpu' ? 'badge-purple' : 'badge-blue'} text-[10px]`}>
                        {job.computeClass.toUpperCase()}
                      </span>
                      <span className="text-text-dim text-xs">{job.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 text-right">
                  <div>
                    <p className="text-bitcoin font-semibold text-sm">{(job.budget / 100_000_000).toFixed(5)} BTC</p>
                    <p className="text-text-dim text-xs">{job.runtime}</p>
                  </div>
                  <span className="badge-success text-[10px]">Open</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKER NETWORK ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="card bg-gradient-to-br from-bg-surface to-bg-card border-bitcoin/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-bitcoin/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative lg:grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="section-label">Worker Network</div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                  Monetize idle CPU/GPU. Earn in BTC.
                </h2>
                <p className="text-text-muted text-sm leading-relaxed mb-6">
                  Install the worker client, register your hardware, and start earning satoshis for
                  every verified compute task. Permissionless access. Onchain reputation.
                </p>
                <div className="flex gap-3">
                  <Link to="/workers" className="btn-primary text-sm">
                    Run a Worker <ArrowRight size={14} />
                  </Link>
                  <Link to="/workers" className="btn-ghost text-sm">
                    See leaderboard
                  </Link>
                </div>
              </div>
              <div className="mt-8 lg:mt-0 grid grid-cols-2 gap-3">
                {[
                  { label: 'Active Workers', value: `${networkStats.activeNodes}` },
                  { label: 'Avg Completion', value: '97.3%' },
                  { label: 'Total Compute', value: `${networkStats.totalComputeHours.toLocaleString()}h` },
                  { label: 'Dispute Rate', value: `${networkStats.disputeRate}%` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-bg-card rounded-xl p-4 border border-border-subtle">
                    <p className="text-xl font-bold text-white">{value}</p>
                    <p className="text-text-muted text-xs mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VERIFICATION STRIP ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="section-label mx-auto w-fit">Verification</div>
            <h2 className="text-3xl font-bold tracking-tight">How do you know results are correct?</h2>
            <p className="text-text-muted text-sm mt-3 max-w-xl mx-auto">
              BitGrid uses multiple verification models depending on job type and risk.
              Challenge windows and proof records are recorded on-chain.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Users, label: 'Dual-Run', desc: 'Two independent workers execute the same job. Outputs are compared.' },
              { icon: Shield, label: 'Challenger System', desc: 'Any verifier can contest a result during the challenge window.' },
              { icon: BarChart3, label: 'Sample Verification', desc: 'A subset of outputs is spot-checked for large deterministic jobs.' },
              { icon: TrendingUp, label: 'Reputation Weighted', desc: 'High-reputation nodes earn trusted status with reduced overhead.' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="card flex flex-col gap-3">
                <div className="w-8 h-8 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center">
                  <Icon size={14} className="text-success" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">{label}</h4>
                  <p className="text-text-muted text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/verification" className="btn-ghost text-sm">
              Full trust model <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE STRIP ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="card border-bitcoin/15 bg-gradient-to-r from-bg-surface to-bg-card">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap gap-6">
                {[
                  { label: 'Frontend', tech: 'React / Vite' },
                  { label: 'Contracts', tech: 'OP_NET / WASM' },
                  { label: 'Settlement', tech: 'Bitcoin L1' },
                  { label: 'Worker', tech: 'Sandboxed CLI' },
                  { label: 'Indexer', tech: 'Queryable API' },
                ].map(({ label, tech }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-text-dim text-xs uppercase tracking-widest">{label}</span>
                    <span className="text-white font-semibold text-sm">{tech}</span>
                  </div>
                ))}
              </div>
              <Link to="/architecture" className="btn-secondary text-sm flex-shrink-0">
                Architecture <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEMO CTA ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="absolute inset-0 bg-hero-glow pointer-events-none opacity-60" />
          <div className="relative">
            <div className="section-label mx-auto w-fit">
              <Zap size={10} className="fill-bitcoin" />
              Live Demo
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              From job submission to{' '}
              <span className="text-gradient">BTC payout</span>
              <br />on Bitcoin.
            </h2>
            <p className="text-text-muted mb-8 leading-relaxed">
              Watch the full flow: buyer posts an AI inference task, BTC is escrowed,
              a worker completes it, verification passes, and payment settles on Bitcoin L1.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/demo" className="btn-primary text-sm px-8 py-3">
                Watch Demo <ArrowRight size={15} />
              </Link>
              <Link to="/marketplace" className="btn-secondary text-sm px-8 py-3">
                Launch Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}
