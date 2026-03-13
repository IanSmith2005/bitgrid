import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, CheckCircle2, Loader, Clock, Zap,
  Upload, Cpu, FileCheck, Shield, Bitcoin
} from 'lucide-react'
import { recentPayouts, mockWorkers, networkStats } from '../data/mockData'

type DemoStep = 0 | 1 | 2 | 3 | 4 | 5

const demoSteps = [
  {
    icon: Upload,
    title: 'Buyer posts AI inference task',
    desc: 'A buyer submits a job: "Run BERT-base embeddings over 5k text samples." Budget: 0.0042 BTC. Verification mode: dual-run.',
    detail: 'The OP_NET job registry contract records the job state on Bitcoin L1. BTC is locked in the escrow vault.',
    txLabel: 'Escrow TX',
    tx: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
  },
  {
    icon: Zap,
    title: 'BTC budget is escrowed',
    desc: '420,000 sats locked in the OP_NET smart contract. No centralized custodian. The contract enforces all conditions.',
    detail: 'The escrow vault holds funds until: (a) verification passes → release to worker, or (b) dispute → refund/arbitration.',
    txLabel: 'Escrow confirmed',
    tx: 'block #890,442 · 2 confirmations',
  },
  {
    icon: Cpu,
    title: 'Worker node accepts task',
    desc: '"node-alpha" (RTX 4090 ×2, reputation: 972) claims the job. Execution begins in a sandboxed Docker container.',
    detail: 'The contract records the assignment. No other node can claim this job. Worker is now bound to deliver.',
    txLabel: 'Claim TX',
    tx: 'b2c3d4e5f6a7b2c3d4e5f6a7b2c3d4e5',
  },
  {
    icon: FileCheck,
    title: 'Output submitted',
    desc: 'Worker hashes the output .npy file and submits the proof on-chain. Output CID pinned to IPFS.',
    detail: 'On-chain: only the result hash and IPFS CID. Off-chain: the actual 230MB embeddings file.',
    txLabel: 'Proof TX',
    tx: '0x9d1e2f3a4b5c6d7e…',
  },
  {
    icon: Shield,
    title: 'Verifier approves result',
    desc: 'Challenge window (10 blocks) opens. A second worker re-runs the same job and submits a matching hash.',
    detail: 'Hashes match → contract transitions to "settled" state. No dispute required.',
    txLabel: 'Verification',
    tx: 'Challenge window closed · hashes matched',
  },
  {
    icon: Bitcoin,
    title: 'Worker gets paid in BTC',
    desc: 'Smart contract releases 420,000 sats to node-alpha. Settlement is final on Bitcoin L1.',
    detail: 'Reputation score for node-alpha incremented by 1. Job marked complete in the job registry.',
    txLabel: 'Payout TX',
    tx: 'c3d4e5f6a7b8c3d4e5f6a7b8c3d4e5f6',
  },
]

function StepIndicator({ current }: { current: DemoStep }) {
  return (
    <div className="flex items-center gap-1 mb-8 flex-wrap">
      {demoSteps.map((_s, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-all ${
            i < current ? 'bg-success text-black' :
            i === current ? 'bg-bitcoin text-black' :
            'bg-bg-surface border border-border-subtle text-text-dim'
          }`}>
            {i < current ? <CheckCircle2 size={12} /> : i + 1}
          </div>
          {i < demoSteps.length - 1 && (
            <div className={`w-8 h-px ${i < current ? 'bg-success' : 'bg-border-subtle'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function Demo() {
  const [step, setStep] = useState<DemoStep>(0)
  const [running, setRunning] = useState(false)

  const advance = () => {
    if (step < 5) {
      setRunning(true)
      setTimeout(() => {
        setStep((s) => (s + 1) as DemoStep)
        setRunning(false)
      }, 800)
    }
  }

  const reset = () => setStep(0)

  const current = demoSteps[step]
  const Icon = current.icon
  const done = step === 5

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="section-label mx-auto w-fit">
          <Zap size={10} className="fill-bitcoin" />
          Live Demo
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          From job submission to{' '}
          <span className="text-gradient">BTC payout</span>{' '}
          on Bitcoin.
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">
          A step-by-step walkthrough of a full BitGrid job lifecycle — from buyer escrow to worker payout via OP_NET.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        {/* Demo panel */}
        <div>
          <StepIndicator current={step} />

          <div className="card border-bitcoin/20 min-h-[280px] flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-bitcoin/10 border border-bitcoin/20 flex items-center justify-center">
                {running ? <Loader size={18} className="text-bitcoin animate-spin" /> : <Icon size={18} className="text-bitcoin" />}
              </div>
              <div>
                <p className="text-text-dim text-xs">Step {step + 1} of 6</p>
                <h3 className="text-white font-bold">{current.title}</h3>
              </div>
            </div>

            <p className="text-text-muted text-sm leading-relaxed mb-4">{current.desc}</p>

            <div className="bg-bg-surface rounded-lg p-3 border border-border-subtle mb-4">
              <p className="text-text-dim text-xs leading-relaxed">{current.detail}</p>
            </div>

            <div className="flex items-center gap-2 mt-auto pt-2">
              <span className="text-text-dim text-xs">{current.txLabel}:</span>
              <span className="font-mono text-xs text-bitcoin">{current.tx}</span>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            {!done ? (
              <button onClick={advance} disabled={running} className="btn-primary text-sm">
                {running ? <><Loader size={13} className="animate-spin" /> Processing…</> : <>Next Step <ArrowRight size={14} /></>}
              </button>
            ) : (
              <button onClick={reset} className="btn-primary text-sm">
                <Zap size={13} /> Replay Demo
              </button>
            )}
            {step > 0 && (
              <button onClick={() => setStep((s) => (s - 1) as DemoStep)} disabled={running} className="btn-secondary text-sm">
                Back
              </button>
            )}
          </div>

          {done && (
            <div className="card border-success/20 mt-4 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-success flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">Job completed. BTC settled on Bitcoin L1.</h4>
                <p className="text-text-muted text-xs leading-relaxed">
                  The entire flow — escrow, assignment, proof, verification, and payout — was coordinated by
                  OP_NET smart contracts with no central intermediary.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Live widgets */}
        <div className="flex flex-col gap-4">
          {/* Recent payouts */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <span className="glow-dot" />
              <h4 className="text-white font-semibold text-sm">Recent Payouts</h4>
            </div>
            <div className="flex flex-col gap-2">
              {recentPayouts.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <CheckCircle2 size={10} className="text-success flex-shrink-0" />
                    <span className="text-text-muted truncate">{p.worker} → {p.job}</span>
                  </div>
                  <span className="text-bitcoin font-medium ml-2 flex-shrink-0">
                    {(p.amount / 100_000_000).toFixed(5)} BTC
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top workers */}
          <div className="card">
            <h4 className="text-white font-semibold text-sm mb-3">Active Workers</h4>
            <div className="flex flex-col gap-2">
              {mockWorkers.filter((w) => w.status !== 'offline').map((w) => (
                <div key={w.id} className="flex items-center gap-2 text-xs">
                  <span className={`glow-dot ${w.status === 'busy' ? 'bg-warning' : ''}`} />
                  <span className="text-white flex-1">{w.alias}</span>
                  <span className="text-text-dim">{w.reputation} rep</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="card bg-gradient-to-b from-bg-surface to-bg-card border-bitcoin/15">
            <h4 className="text-white font-semibold text-sm mb-3">Network Health</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Success Rate', value: `${networkStats.successRate}%` },
                { label: 'Open Jobs', value: networkStats.openJobs.toString() },
                { label: 'Active Nodes', value: networkStats.activeNodes.toString() },
                { label: 'Dispute Rate', value: `${networkStats.disputeRate}%` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-bg-card rounded-lg p-2.5">
                  <p className="text-white font-bold text-sm">{value}</p>
                  <p className="text-text-dim text-[10px]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timer */}
          <div className="card flex items-center gap-3">
            <Clock size={14} className="text-text-muted" />
            <div>
              <p className="text-white text-sm font-medium">Median job time</p>
              <p className="text-bitcoin text-xs">{networkStats.medianCompletionTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Judge takeaway */}
      <div className="mt-12 card border-bitcoin/20 bg-gradient-to-r from-bg-surface to-bg-card">
        <h3 className="text-white font-bold text-lg mb-4">Judge Takeaway</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Real infrastructure', desc: 'Two-sided marketplace with genuine supply/demand mechanics, not a toy dApp.' },
            { label: 'Bitcoin-native economics', desc: 'BTC escrow and settlement via OP_NET smart contracts. No tokens. No bridges.' },
            { label: 'Extensible primitive', desc: 'Expands into AI agent infrastructure, rendering pipelines, and data economy.' },
          ].map(({ label, desc }) => (
            <div key={label} className="flex flex-col gap-1">
              <CheckCircle2 size={14} className="text-bitcoin mb-1" />
              <h4 className="text-white font-semibold text-sm">{label}</h4>
              <p className="text-text-muted text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-8 flex-wrap">
        <Link to="/marketplace" className="btn-primary text-sm">
          Launch Marketplace <ArrowRight size={14} />
        </Link>
        <Link to="/architecture" className="btn-secondary text-sm">
          Read Architecture
        </Link>
      </div>
    </div>
  )
}
