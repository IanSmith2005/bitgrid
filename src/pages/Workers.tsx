import { Link } from 'react-router-dom'
import {
  Bitcoin, TrendingUp, Shield, Globe, Download, Settings,
  Play, CheckCircle2, ArrowRight, Clock, Cpu, Star
} from 'lucide-react'
import { mockWorkers } from '../data/mockData'

const benefits = [
  { icon: Bitcoin, title: 'Earn in BTC', desc: 'Get paid in satoshis for every verified job completion. No custodian. No token. Direct to your wallet.' },
  { icon: Globe, title: 'Permissionless', desc: 'Any node with eligible hardware can register and start accepting jobs. No approval required.' },
  { icon: TrendingUp, title: 'Build reputation', desc: 'Successful completions accumulate an on-chain reputation score that unlocks higher-value jobs.' },
  { icon: Shield, title: 'Honest protocol', desc: 'Smart contract enforces all rules. You cannot be defrauded by a buyer who refuses to pay.' },
]

const joinSteps = [
  { icon: Download, title: 'Install the worker client', desc: 'Run the BitGrid CLI daemon on your machine. Supports Linux and macOS. Docker-based sandbox included.' },
  { icon: Settings, title: 'Register hardware profile', desc: 'The client detects your hardware specs and submits a registration transaction to the OP_NET worker registry.' },
  { icon: Play, title: 'Accept jobs', desc: 'The client polls for available jobs matching your hardware class (CPU/GPU) and reputation level.' },
  { icon: CheckCircle2, title: 'Complete workloads', desc: 'Execute the task in a sandboxed environment. Submit the result hash on-chain when done.' },
  { icon: Bitcoin, title: 'Earn BTC', desc: 'If verification passes, the smart contract releases the escrowed BTC directly to your address.' },
]

function WorkerCard({ worker }: { worker: typeof mockWorkers[0] }) {
  const statusColor = worker.status === 'online' ? 'bg-success' : worker.status === 'busy' ? 'bg-warning' : 'bg-text-dim'

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-bitcoin/10 border border-bitcoin/20 flex items-center justify-center">
            <Cpu size={15} className="text-bitcoin" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">{worker.alias}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
            </div>
            <p className="text-text-dim text-xs mt-0.5">{worker.hardware}</p>
          </div>
        </div>
        <span className={`badge ${worker.hardwareClass === 'gpu' ? 'badge-purple' : 'badge-blue'} text-[10px]`}>
          {worker.hardwareClass.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Reputation', value: worker.reputation.toString(), icon: Star },
          { label: 'Completion', value: `${worker.completionRate}%`, icon: CheckCircle2 },
          { label: 'Uptime', value: `${worker.uptime}%`, icon: TrendingUp },
          { label: 'Avg Response', value: worker.avgResponseTime, icon: Clock },
        ].map(({ label, value }) => (
          <div key={label} className="bg-bg-surface rounded-lg px-3 py-2">
            <p className="text-white text-sm font-semibold">{value}</p>
            <p className="text-text-dim text-[10px]">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-bitcoin font-bold text-sm">{(worker.earnings / 100_000_000).toFixed(4)} BTC</p>
          <p className="text-text-dim text-xs">total earned · {worker.totalJobs} jobs</p>
        </div>
        <span className="text-text-muted text-xs">Since {worker.joinedDate}</span>
      </div>
    </div>
  )
}

export default function Workers() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="section-label mx-auto w-fit">For Workers</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Monetize idle CPU/GPU.{' '}
          <span className="text-gradient">Earn in BTC.</span>
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto mb-8">
          Join the BitGrid worker network. Accept compute jobs, submit verified results,
          and receive BTC directly — no middleman, no token, no bridge.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/marketplace" className="btn-primary text-sm px-6 py-3">
            Start Earning <ArrowRight size={14} />
          </Link>
          <a href="/bitgrid-worker-install.sh" download className="btn-secondary text-sm px-6 py-3">
            <Download size={14} /> Download Worker Client
          </a>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {benefits.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card-hover flex flex-col gap-3">
            <div className="w-9 h-9 rounded-xl bg-bitcoin/10 border border-bitcoin/20 flex items-center justify-center">
              <Icon size={16} className="text-bitcoin" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
              <p className="text-text-muted text-xs leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* How to join */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold tracking-tight mb-6">How to Join</h2>
        <div className="flex flex-col gap-4">
          {joinSteps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-bg-surface border border-border-subtle flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-text-muted" />
                </div>
                {i < joinSteps.length - 1 && <div className="w-px flex-1 bg-border-subtle mt-1 h-4" />}
              </div>
              <div className="card flex-1 mt-0.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-bitcoin text-xs">0{i + 1}</span>
                  <h3 className="text-white font-semibold text-sm">{title}</h3>
                </div>
                <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust model */}
      <div className="card border-success/20 mb-16">
        <h2 className="text-xl font-bold mb-4">Worker Trust Model</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: TrendingUp, color: 'text-success', bg: 'bg-success/10 border-success/20', title: 'Completions improve score', desc: 'Every verified job adds to your on-chain reputation. Higher scores unlock better jobs.' },
            { icon: Shield, color: 'text-warning', bg: 'bg-warning/10 border-warning/20', title: 'Failures lower ranking', desc: 'Jobs that fail verification or expire without submission reduce your reputation score.' },
            { icon: CheckCircle2, color: 'text-error', bg: 'bg-error/10 border-error/20', title: 'Disputes affect reliability', desc: 'Sustained disputes flag your node as unreliable and reduce access to high-value jobs.' },
          ].map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className="flex flex-col gap-2">
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${bg}`}>
                <Icon size={14} className={color} />
              </div>
              <h4 className="text-white font-medium text-sm">{title}</h4>
              <p className="text-text-muted text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Worker leaderboard */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold tracking-tight">Top Workers</h2>
          <Link to="/marketplace" className="btn-ghost text-sm">
            View all <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockWorkers.map((w) => (
            <WorkerCard key={w.id} worker={w} />
          ))}
        </div>
      </div>

      <div className="card border-bitcoin/20 bg-gradient-to-r from-bg-surface to-bg-card text-center py-8">
        <h3 className="text-white font-bold text-lg mb-2">Ready to start earning?</h3>
        <p className="text-text-muted text-sm mb-6 max-w-md mx-auto">
          Install the worker client, register your hardware, and receive your first BTC payout in minutes.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="/bitgrid-worker-install.sh" download className="btn-primary text-sm">
            <Download size={14} /> Download Client
          </a>
          <Link to="/how-it-works" className="btn-secondary text-sm">
            How It Works
          </Link>
        </div>
      </div>
    </div>
  )
}
