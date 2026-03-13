import { Link } from 'react-router-dom'
import { ArrowRight, Upload, Cpu, FileCheck, Shield, Bitcoin, ChevronRight } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    num: '01',
    title: 'Submit a Job',
    color: 'text-bitcoin',
    bg: 'bg-bitcoin/10 border-bitcoin/20',
    items: [
      'Buyer selects job type: AI, render, data, or research',
      'Uploads job spec and input hash (IPFS CID)',
      'Specifies expected output format',
      'Sets BTC budget as maximum escrow amount',
      'Smart contract locks the escrow on Bitcoin L1',
    ],
    detail: 'The OP_NET job registry contract stores the job state on-chain. The IPFS CID serves as a content-addressed pointer to the job spec — no large data on-chain.',
  },
  {
    icon: Cpu,
    num: '02',
    title: 'Worker Claims the Task',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    items: [
      'Worker node broadcasts availability via the protocol',
      'Accepts the job by signing a claim transaction',
      'Node stakes its reputation score as implicit collateral',
      'Execution begins in a sandboxed environment',
    ],
    detail: 'Workers are matched to jobs by compute class (CPU/GPU) and availability. The assignment is recorded in the contract, preventing double-assignment.',
  },
  {
    icon: FileCheck,
    num: '03',
    title: 'Result Delivery',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    items: [
      'Worker completes execution and hashes the output',
      'Result hash is submitted on-chain to the job contract',
      'Actual output data is optionally pinned via IPFS',
      'Encrypted delivery is supported for sensitive workloads',
    ],
    detail: 'The on-chain record stores only the proof hash and output reference. Large data lives off-chain. This keeps Bitcoin L1 costs minimal.',
  },
  {
    icon: Shield,
    num: '04',
    title: 'Verification',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
    items: [
      'Challenge window opens (duration set per job class)',
      'Any registered verifier can contest the result',
      'Verifier re-runs or samples the task independently',
      'Honest results pass the window — no action needed',
      'Invalid results trigger the dispute resolution path',
    ],
    detail: 'For dual-run jobs, two workers execute independently and results are compared. For challenger-mode jobs, the first contestation triggers arbitration.',
  },
  {
    icon: Bitcoin,
    num: '05',
    title: 'Settlement',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    items: [
      'If verification passes: BTC is released to the worker',
      'If disputed: contract enters arbitration state',
      'If arbitration resolves for buyer: escrow is refunded',
      'Dispute outcome updates both parties\' reputation scores',
    ],
    detail: 'Settlement is enforced entirely by the OP_NET smart contract. No centralized arbiter. The contract follows deterministic rules defined at deployment.',
  },
]

export default function HowItWorks() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <div className="section-label mx-auto w-fit">Mechanism</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          How BitGrid Works
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">
          Five deterministic steps from job post to BTC payout, coordinated entirely
          by OP_NET smart contract logic on Bitcoin L1.
        </p>
      </div>

      {/* Flow diagram */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-16 text-sm font-medium">
        {['Buyer', 'Job Contract', 'Worker Node', 'Verification', 'BTC Settlement'].map((label, i, arr) => (
          <div key={label} className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-bg-surface border border-border-subtle text-white text-xs">
              {label}
            </div>
            {i < arr.length - 1 && <ChevronRight size={14} className="text-bitcoin" />}
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-8">
        {steps.map(({ icon: Icon, num, title, color, bg, items, detail }) => (
          <div key={num} className="grid lg:grid-cols-[80px_1fr] gap-5">
            <div className="flex flex-col items-center">
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${bg}`}>
                <Icon size={22} className={color} />
              </div>
              <span className={`font-mono text-xs font-bold mt-2 ${color}`}>{num}</span>
            </div>
            <div className="card">
              <h2 className="text-white font-bold text-lg mb-3">{title}</h2>
              <ul className="flex flex-col gap-2 mb-4">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-muted">
                    <div className="w-1.5 h-1.5 rounded-full bg-bitcoin mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="bg-bg-surface rounded-lg p-3 border border-border-subtle">
                <p className="text-text-dim text-xs leading-relaxed">{detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 grid sm:grid-cols-3 gap-4">
        <Link to="/marketplace" className="card-hover flex flex-col gap-2">
          <h3 className="text-white font-semibold text-sm">Try the Marketplace</h3>
          <p className="text-text-muted text-xs">Post a job or explore open compute tasks.</p>
          <span className="text-bitcoin text-xs flex items-center gap-1 mt-auto">Open <ArrowRight size={11} /></span>
        </Link>
        <Link to="/verification" className="card-hover flex flex-col gap-2">
          <h3 className="text-white font-semibold text-sm">Verification Detail</h3>
          <p className="text-text-muted text-xs">Deep dive into how results are verified.</p>
          <span className="text-bitcoin text-xs flex items-center gap-1 mt-auto">Read <ArrowRight size={11} /></span>
        </Link>
        <Link to="/architecture" className="card-hover flex flex-col gap-2">
          <h3 className="text-white font-semibold text-sm">Architecture</h3>
          <p className="text-text-muted text-xs">OP_NET contracts, worker client, and indexer.</p>
          <span className="text-bitcoin text-xs flex items-center gap-1 mt-auto">Read <ArrowRight size={11} /></span>
        </Link>
      </div>
    </div>
  )
}
