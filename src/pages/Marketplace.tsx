import { useState, useMemo, useEffect } from 'react'
import {
  Search, Filter, Cpu, Zap, Clock, ArrowRight, CheckCircle2,
  AlertTriangle, Loader, XCircle, Plus, BarChart3, Users,
  TrendingUp, Activity, MonitorPlay,
  Bitcoin, Wallet, DollarSign, Timer,
  Target, Award, Boxes, CircuitBoard, ServerCrash,
  ChevronRight, UploadCloud, Layers
} from 'lucide-react'
import { mockJobs, mockWorkers, networkStats, recentPayouts, type Job, type JobType } from '../data/mockData'
import { useWallet } from '../context/WalletContext'

type Tab = 'board' | 'buyer' | 'worker' | 'submit' | 'stats'
type AccentKey = 'bitcoin' | 'success' | 'purple' | 'blue' | 'warning'

function sats(v: number) { return v.toLocaleString() + ' sats' }
function btc(v: number) { return '₿' + (v / 100_000_000).toFixed(5) }

// ── Hardware detection ────────────────────────────────────────────────────────
function useHardware() {
  return useMemo(() => {
    const cores = navigator.hardwareConcurrency ?? '?'
    const ram = (navigator as { deviceMemory?: number }).deviceMemory ?? '?'
    let gpu = 'Unavailable'
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') as WebGLRenderingContext | null
      if (gl) {
        const ext = gl.getExtension('WEBGL_debug_renderer_info')
        if (ext) gpu = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string
      }
    } catch { /* ignore */ }
    const hasGpu = gpu !== 'Unavailable' && !gpu.toLowerCase().includes('swiftshader')
    return { cores, ram, gpu, hasGpu }
  }, [])
}

function statusBadge(s: Job['status']) {
  const map: Record<Job['status'], string> = {
    open: 'badge-success', in_progress: 'badge-blue', verifying: 'badge-warning',
    completed: 'badge-muted', disputed: 'badge-error', failed: 'badge-error',
  }
  const labels: Record<Job['status'], string> = {
    open: 'Open', in_progress: 'In Progress', verifying: 'Verifying',
    completed: 'Completed', disputed: 'Disputed', failed: 'Failed',
  }
  return <span className={map[s]}>{labels[s]}</span>
}

function statusIcon(s: Job['status']) {
  const p = { size: 13 }
  switch (s) {
    case 'open': return <CheckCircle2 {...p} className="text-success" />
    case 'in_progress': return <Loader {...p} className="text-blue-400 animate-spin" />
    case 'verifying': return <AlertTriangle {...p} className="text-warning" />
    case 'completed': return <CheckCircle2 {...p} className="text-text-muted" />
    case 'disputed': return <AlertTriangle {...p} className="text-error" />
    case 'failed': return <XCircle {...p} className="text-error" />
  }
}

function KpiCard({ icon: Icon, label, value, sub, accent, trend }: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string; value: string; sub?: string; accent?: AccentKey; trend?: string
}) {
  const accentMap: Record<AccentKey, string> = {
    bitcoin: 'text-bitcoin bg-bitcoin/10 border-bitcoin/20',
    success: 'text-success bg-success/10 border-success/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
  }
  const iconClass = accent ? accentMap[accent] : 'text-text-muted bg-bg-surface border-border-subtle'
  const valueClass = accent === 'bitcoin' ? 'text-bitcoin' : 'text-white'
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${iconClass}`}>
          <Icon size={14} />
        </div>
        {trend && <span className="text-success text-[10px] font-semibold flex items-center gap-0.5"><TrendingUp size={9} /> {trend}</span>}
      </div>
      <div>
        <p className={`text-2xl font-extrabold tracking-tight ${valueClass}`}>{value}</p>
        <p className="text-text-muted text-xs mt-0.5">{label}</p>
        {sub && <p className="text-text-dim text-[10px] mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function JobCard({ job, onClick, active, accepted, onAccept }: {
  job: Job; onClick: () => void; active: boolean
  accepted: boolean; onAccept: (id: string) => void
}) {
  const gpu = job.computeClass === 'gpu'
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-150 ${
        active ? 'bg-bitcoin/5 border-bitcoin/30' : 'bg-bg-card border-border-subtle hover:border-bitcoin/20 hover:bg-bg-surface'
      }`}
    >
      {/* Type icon */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${gpu ? 'bg-purple-500/10 border-purple-500/20' : 'bg-blue-500/10 border-blue-500/20'}`}>
        <CircuitBoard size={13} className={gpu ? 'text-purple-400' : 'text-blue-400'} />
      </div>

      {/* Title + meta */}
      <div className="min-w-0 flex-1">
        <p className="text-white text-sm font-medium truncate">{job.title}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${gpu ? 'bg-purple-500/15 text-purple-400' : 'bg-blue-500/15 text-blue-400'}`}>{job.computeClass.toUpperCase()}</span>
          <span className="text-text-dim text-[10px] capitalize">{job.type.replace('_', ' ')}</span>
          <span className="text-text-dim text-[10px]">·</span>
          <span className="text-text-dim text-[10px] flex items-center gap-0.5"><Clock size={9} />{job.runtime}</span>
          <span className="text-text-dim text-[10px]">·</span>
          <span className="text-text-dim text-[10px]">{job.verificationMode}</span>
        </div>
      </div>

      {/* Budget + status + action */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-right">
          <p className="text-bitcoin font-bold text-sm">{btc(job.budget)}</p>
          <div className="flex items-center gap-1 justify-end mt-0.5">{statusIcon(job.status)}{statusBadge(job.status)}</div>
        </div>
        {job.status === 'open' && !accepted && (
          <button
            onClick={(e) => { e.stopPropagation(); onAccept(job.id) }}
            className="px-3 py-1.5 bg-bitcoin text-black text-xs font-bold rounded-lg hover:bg-bitcoin-dark transition-colors"
          >
            Accept
          </button>
        )}
        {accepted && <span className="badge-blue text-[10px]">Accepted</span>}
      </div>
    </div>
  )
}

function JobDetail({ job, onClose, accepted, onAccept }: {
  job: Job; onClose: () => void; accepted: boolean; onAccept: (id: string) => void
}) {
  return (
    <div className="card border-bitcoin/20 sticky top-20">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-text-dim">{job.id}</span>
            {accepted ? <span className="badge-blue text-[10px]">Accepted</span> : statusBadge(job.status)}
          </div>
          <h3 className="text-white font-semibold">{job.title}</h3>
        </div>
        <button onClick={onClose} className="text-text-dim hover:text-white p-1 transition-colors"><XCircle size={16} /></button>
      </div>
      <p className="text-text-muted text-xs leading-relaxed mb-4">{job.description}</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { label: 'Escrow', value: btc(job.budget) },
          { label: 'Compute', value: job.computeClass.toUpperCase() },
          { label: 'Runtime', value: job.runtime },
          { label: 'Verification', value: job.verificationMode },
          { label: 'Deadline', value: job.deadline },
          { label: 'Posted', value: new Date(job.created).toLocaleDateString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-bg-surface rounded-lg p-2.5">
            <p className="text-text-dim text-[10px] mb-0.5">{label}</p>
            <p className="text-white text-xs font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-border-subtle pt-4 mb-4">
        <p className="text-white text-[10px] font-semibold uppercase tracking-widest mb-2">Lifecycle</p>
        {[
          { label: 'Buyer', value: job.buyer ? `${job.buyer.slice(0, 10)}…` : '—', done: true },
          { label: 'Worker', value: accepted ? 'You (accepted)' : job.worker ? `${job.worker.slice(0, 10)}…` : 'Unassigned', done: !!job.worker || accepted },
          { label: 'Proof', value: job.proofHash ? `${job.proofHash.slice(0, 12)}…` : 'Pending', done: !!job.proofHash },
          { label: 'Payout', value: job.payoutTx ? `${job.payoutTx.slice(0, 12)}…` : 'Pending', done: !!job.payoutTx },
        ].map(({ label, value, done }) => (
          <div key={label} className="flex items-center gap-2 mb-1.5">
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${done ? 'bg-success' : 'bg-border-subtle'}`} />
            <span className="text-text-dim w-12 text-[10px]">{label}</span>
            <span className={`font-mono text-[10px] ${done ? 'text-white' : 'text-text-dim'}`}>{value}</span>
          </div>
        ))}
      </div>
      {job.status === 'open' && !accepted && (
        <button
          onClick={() => onAccept(job.id)}
          className="btn-primary w-full justify-center text-xs"
        >
          Accept Job <ArrowRight size={13} />
        </button>
      )}
      {accepted && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-center gap-3">
          <CheckCircle2 size={16} className="text-blue-400 flex-shrink-0" />
          <div>
            <p className="text-white text-xs font-semibold">Job accepted — execute and submit proof</p>
            <p className="text-text-dim text-[10px] mt-0.5">BTC will be released on verified completion</p>
          </div>
        </div>
      )}
    </div>
  )
}

function DemoBanner({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 mb-5 rounded-xl bg-bitcoin/5 border border-bitcoin/20">
      <Wallet size={14} className="text-bitcoin flex-shrink-0" />
      <p className="text-text-muted text-xs flex-1">Demo mode — all data is mock. <span className="text-white">Connect wallet</span> to transact on Bitcoin L1.</p>
      <button onClick={onConnect} className="text-bitcoin text-xs font-bold hover:underline flex-shrink-0">Connect</button>
    </div>
  )
}


function BuyerDashboard() {
  const { connected, connect } = useWallet()
  const myJobs = mockJobs.slice(0, 5)
  const activeJobs = myJobs.filter((j) => j.status === 'in_progress' || j.status === 'verifying')
  const completedJobs = myJobs.filter((j) => j.status === 'completed')
  const totalSpent = completedJobs.reduce((s, j) => s + j.budget, 0)

  return (
    <div className="flex flex-col gap-6">
      {!connected && <DemoBanner onConnect={connect} />}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={DollarSign} label="Total Spent" value={btc(totalSpent)} sub="all time" accent="bitcoin" trend="+12%" />
        <KpiCard icon={Boxes} label="Active Jobs" value={String(activeJobs.length)} sub="running now" accent="blue" />
        <KpiCard icon={CheckCircle2} label="Completed" value={String(completedJobs.length)} sub="verified jobs" accent="success" trend="+3 this week" />
        <KpiCard icon={Timer} label="Avg Turnaround" value="14 min" sub="per job" accent="purple" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card col-span-2">
          <h4 className="text-white font-semibold text-sm mb-4 flex items-center gap-2"><Activity size={14} className="text-bitcoin" /> My Jobs</h4>
          <div className="flex flex-col">
            {myJobs.map((job) => (
              <div key={job.id} className="flex items-center gap-3 py-2.5 border-b border-border-subtle last:border-none">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  job.status === 'completed' ? 'bg-success' : job.status === 'in_progress' ? 'bg-blue-400' :
                  job.status === 'verifying' ? 'bg-warning' : job.status === 'disputed' ? 'bg-error' : 'bg-text-dim'
                }`} />
                <div className="min-w-0 flex-1">
                  <p className="text-white text-xs font-medium truncate">{job.title}</p>
                  <p className="text-text-dim text-[10px]">{job.id} · {job.computeClass.toUpperCase()} · {job.type}</p>
                </div>
                <p className="text-bitcoin text-xs font-semibold flex-shrink-0">{btc(job.budget)}</p>
                {statusBadge(job.status)}
              </div>
            ))}
          </div>
        </div>

        <div className="card flex flex-col gap-4">
          <h4 className="text-white font-semibold text-sm flex items-center gap-2"><BarChart3 size={14} className="text-bitcoin" /> Spend by Type</h4>
          <div className="flex flex-col gap-3">
            {[
              { label: 'AI Inference', pct: 48, color: 'bg-purple-400' },
              { label: 'Rendering', pct: 31, color: 'bg-blue-400' },
              { label: 'Data Processing', pct: 14, color: 'bg-green-400' },
              { label: 'Research', pct: 7, color: 'bg-yellow-400' },
            ].map(({ label, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted">{label}</span>
                  <span className="text-white font-medium">{pct}%</span>
                </div>
                <div className="h-1.5 bg-bg-surface rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-3 border-t border-border-subtle">
            <p className="text-text-dim text-xs">Total BTC committed</p>
            <p className="text-bitcoin font-bold text-xl">₿0.18540</p>
          </div>
        </div>
      </div>

      <button className="w-full py-4 rounded-xl border-2 border-dashed border-bitcoin/30 hover:border-bitcoin/60 hover:bg-bitcoin/5 transition-all group flex items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-bitcoin/10 flex items-center justify-center group-hover:bg-bitcoin/20 transition-colors">
          <Plus size={16} className="text-bitcoin" />
        </div>
        <div className="text-left">
          <p className="text-white font-semibold text-sm">Submit a new GPU/CPU job</p>
          <p className="text-text-muted text-xs">Escrow BTC · Choose compute class · Set verification mode</p>
        </div>
        <ChevronRight size={16} className="text-bitcoin ml-auto" />
      </button>
    </div>
  )
}

// ── Earnings chart ────────────────────────────────────────────────────────────
const EARNINGS_BARS = [
  { day: 'Mon', sats: 28000 },
  { day: 'Tue', sats: 42000 },
  { day: 'Wed', sats: 19000 },
  { day: 'Thu', sats: 61000 },
  { day: 'Fri', sats: 38000 },
  { day: 'Sat', sats: 75000 },
  { day: 'Sun', sats: 31000 },
]
const CHART_H = 96

function EarningsChart() {
  const max = Math.max(...EARNINGS_BARS.map(b => b.sats))
  const total = EARNINGS_BARS.reduce((s, b) => s + b.sats, 0)
  const todayIdx = 5

  return (
    <div className="card flex-1">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 size={14} className="text-bitcoin" />
          <span className="text-white font-semibold text-sm">Earnings (7 days)</span>
        </div>
        <span className="text-bitcoin font-bold text-xs">{btc(total)}</span>
      </div>

      <div className="flex items-end gap-1.5" style={{ height: `${CHART_H}px` }}>
        {EARNINGS_BARS.map((b, i) => {
          const barH = Math.max(4, Math.round((b.sats / max) * CHART_H))
          const isToday = i === todayIdx
          return (
            <div key={b.day} className="flex-1 flex flex-col items-center justify-end gap-0.5 group">
              <div
                title={`${b.day}: ${sats(b.sats)}`}
                className={`w-full rounded-t transition-colors ${isToday ? 'bg-bitcoin' : 'bg-bitcoin/30 group-hover:bg-bitcoin/60'}`}
                style={{ height: `${barH}px` }}
              />
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between mt-2">
        {EARNINGS_BARS.map((b, i) => (
          <span key={b.day} className={`flex-1 text-center text-[9px] ${i === todayIdx ? 'text-bitcoin font-bold' : 'text-text-dim'}`}>
            {b.day.slice(0, 2)}
          </span>
        ))}
      </div>

      <p className="text-text-dim text-[10px] mt-2">{sats(total)} earned this week</p>
    </div>
  )
}

function WorkerDashboard({ acceptedJobIds, onAccept }: {
  acceptedJobIds: Set<string>
  onAccept: (id: string) => void
}) {
  const { connected, connect } = useWallet()
  const { cores, ram, gpu, hasGpu } = useHardware()
  const [pipelineTab, setPipelineTab] = useState<'running' | 'available'>('running')
  const me = mockWorkers[0]

  const availableJobs = mockJobs.filter((j) => j.status === 'open' && !acceptedJobIds.has(j.id))
  const acceptedJobs = mockJobs.filter((j) => acceptedJobIds.has(j.id))

  // auto-switch to running tab when first job is accepted
  useEffect(() => {
    if (acceptedJobs.length > 0 && pipelineTab === 'available') {
      setPipelineTab('running')
    }
  }, [acceptedJobs.length])

  return (
    <div className="flex flex-col gap-5">
      {!connected && <DemoBanner onConnect={connect} />}

      {/* ── Node identity + hardware ── */}
      <div className="card bg-gradient-to-br from-bg-surface to-bg-card border-bitcoin/15">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
            <CircuitBoard size={18} className="text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-white font-bold text-base">{me.alias}</h3>
              <span className="badge-success text-[10px]">{me.status}</span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${me.hardwareClass === 'gpu' ? 'bg-purple-500/15 text-purple-400' : 'bg-blue-500/15 text-blue-400'}`}>{me.hardwareClass.toUpperCase()}</span>
            </div>
            <p className="text-text-dim text-[11px] font-mono mt-0.5 truncate">{me.address}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-bitcoin font-extrabold text-xl">{btc(me.earnings)}</p>
            <p className="text-text-dim text-[10px]">total earned · {me.totalJobs} jobs</p>
          </div>
        </div>
        {/* Hardware row */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border-subtle">
          <div className="bg-bg-dark rounded-lg px-3 py-2">
            <p className="text-text-dim text-[10px] uppercase tracking-wider mb-0.5">CPU Cores</p>
            <p className="text-white font-semibold text-sm">{cores} <span className="text-text-dim font-normal text-[10px]">threads</span></p>
          </div>
          <div className="bg-bg-dark rounded-lg px-3 py-2">
            <p className="text-text-dim text-[10px] uppercase tracking-wider mb-0.5">RAM</p>
            <p className="text-white font-semibold text-sm">{ram}<span className="text-text-dim font-normal text-[10px]"> GB</span></p>
          </div>
          <div className="bg-bg-dark rounded-lg px-3 py-2">
            <p className="text-text-dim text-[10px] uppercase tracking-wider mb-0.5">GPU</p>
            <p className={`font-semibold text-xs truncate ${hasGpu ? 'text-purple-400' : 'text-text-muted'}`}>{hasGpu ? gpu : 'None detected'}</p>
          </div>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={Bitcoin}      label="Today's Earnings" value="₿0.00042"              sub="~42,000 sats"                  accent="bitcoin" trend="+18%" />
        <KpiCard icon={Layers}       label="Running Jobs"     value={String(acceptedJobs.length)} sub="in progress"            accent="blue" />
        <KpiCard icon={Award}        label="Reputation"       value={String(me.reputation)} sub={`${me.uptime}% uptime`}       accent="purple" trend="+2 pts" />
        <KpiCard icon={Target}       label="Completion Rate"  value={`${me.completionRate}%`} sub={`${me.totalJobs} jobs total`} accent="success" />
      </div>

      {/* ── Main content ── */}
      <div className="grid lg:grid-cols-5 gap-4">

        {/* Job pipeline (wider left) */}
        <div className="lg:col-span-3 card flex flex-col gap-0 overflow-hidden p-0">
          {/* Card header with tabs */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border-subtle">
            <h4 className="text-white font-semibold text-sm flex items-center gap-2">
              <Layers size={14} className="text-bitcoin" /> Job Pipeline
            </h4>
            <div className="flex items-center gap-1 bg-bg-dark rounded-lg p-1">
              <button
                onClick={() => setPipelineTab('running')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${pipelineTab === 'running' ? 'bg-bg-surface text-white' : 'text-text-muted hover:text-white'}`}
              >
                <Loader size={11} className={pipelineTab === 'running' && acceptedJobs.length > 0 ? 'animate-spin text-blue-400' : ''} />
                Running
                {acceptedJobs.length > 0 && <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center">{acceptedJobs.length}</span>}
              </button>
              <button
                onClick={() => setPipelineTab('available')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${pipelineTab === 'available' ? 'bg-bg-surface text-white' : 'text-text-muted hover:text-white'}`}
              >
                <Zap size={11} />
                Available
                {availableJobs.length > 0 && <span className="w-4 h-4 rounded-full bg-success/80 text-white text-[9px] font-bold flex items-center justify-center">{availableJobs.length}</span>}
              </button>
            </div>
          </div>

          {/* Running tab */}
          {pipelineTab === 'running' && (
            <div className="flex flex-col divide-y divide-border-subtle">
              {acceptedJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="w-10 h-10 rounded-xl bg-bg-surface border border-border-subtle flex items-center justify-center mb-3">
                    <Layers size={16} className="text-text-dim" />
                  </div>
                  <p className="text-text-muted text-sm font-medium mb-1">No jobs running</p>
                  <p className="text-text-dim text-xs mb-4">Switch to Available to pick up a job</p>
                  <button onClick={() => setPipelineTab('available')} className="text-bitcoin text-xs font-semibold hover:underline flex items-center gap-1">
                    Browse available jobs <ChevronRight size={12} />
                  </button>
                </div>
              ) : acceptedJobs.map((job) => (
                <div key={job.id} className="flex items-center gap-3 px-4 py-3 hover:bg-bg-surface/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-500/10 border border-blue-500/20">
                    <Loader size={13} className="text-blue-400 animate-spin" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-xs font-medium truncate">{job.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-semibold ${job.computeClass === 'gpu' ? 'text-purple-400' : 'text-blue-400'}`}>{job.computeClass.toUpperCase()}</span>
                      <span className="text-text-dim text-[10px]">· est. {job.runtime}</span>
                      <span className="text-text-dim text-[10px]">· due {job.deadline}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-bitcoin text-xs font-bold">{btc(job.budget)}</p>
                    <p className="text-text-dim text-[10px]">on completion</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Available tab */}
          {pipelineTab === 'available' && (
            <div className="flex flex-col divide-y divide-border-subtle">
              {availableJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="w-10 h-10 rounded-xl bg-bg-surface border border-border-subtle flex items-center justify-center mb-3">
                    <CheckCircle2 size={16} className="text-success" />
                  </div>
                  <p className="text-text-muted text-sm font-medium mb-1">All jobs accepted</p>
                  <p className="text-text-dim text-xs">Check the Running tab to see your active workloads</p>
                </div>
              ) : availableJobs.slice(0, 6).map((job) => (
                <div key={job.id} className="flex items-center gap-3 px-4 py-3 hover:bg-bg-surface/40 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${job.computeClass === 'gpu' ? 'bg-purple-500/10 border-purple-500/20' : 'bg-blue-500/10 border-blue-500/20'}`}>
                    <CircuitBoard size={13} className={job.computeClass === 'gpu' ? 'text-purple-400' : 'text-blue-400'} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-xs font-medium truncate">{job.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-semibold ${job.computeClass === 'gpu' ? 'text-purple-400' : 'text-blue-400'}`}>{job.computeClass.toUpperCase()}</span>
                      <span className="text-text-dim text-[10px]">· {job.runtime}</span>
                      <span className="text-text-dim text-[10px]">· {job.verificationMode}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="text-bitcoin text-xs font-bold">{btc(job.budget)}</p>
                    <button
                      onClick={() => onAccept(job.id)}
                      className="px-3 py-1.5 bg-bitcoin text-black text-[10px] font-bold rounded-lg hover:bg-bitcoin-dark transition-colors"
                    >Accept</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: earnings + payouts */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <EarningsChart />

          <div className="card flex-1">
            <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Award size={14} className="text-bitcoin" /> Recent Payouts
            </h4>
            <div className="flex flex-col">
              {recentPayouts.slice(0, 5).map((p, i) => (
                <div key={i} className="flex items-center gap-2.5 py-2.5 border-b border-border-subtle last:border-none">
                  <div className="glow-dot flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-[11px] font-medium truncate">{p.job}</p>
                    <p className="text-text-dim text-[10px]">{p.time}</p>
                  </div>
                  <span className="text-bitcoin text-xs font-bold flex-shrink-0">{sats(p.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SubmitJob() {
  const { connected, connect } = useWallet()
  const [computeClass, setComputeClass] = useState<'gpu' | 'cpu'>('gpu')
  const [form, setForm] = useState({ title: '', type: 'ai', description: '', budgetSats: '', deadline: '', verificationMode: 'dual-run', ipfsCid: '' })
  const [submitted, setSubmitted] = useState(false)
  const handle = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  if (submitted) return (
    <div className="max-w-lg mx-auto card text-center py-14">
      <div className="w-16 h-16 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 size={28} className="text-success" />
      </div>
      <h3 className="text-white font-extrabold text-xl mb-2">Job submitted!</h3>
      <p className="text-text-muted text-sm mb-2">BTC escrow broadcast to Bitcoin L1 via OP_NET.</p>
      <p className="font-mono text-xs text-bitcoin bg-bitcoin/10 px-3 py-1.5 rounded-full inline-block">
        JOB-{Math.floor(Math.random() * 900 + 100).toString().padStart(3, '0')}
      </p>
      <div className="mt-6 flex gap-3 justify-center">
        <button onClick={() => setSubmitted(false)} className="btn-secondary text-sm">Submit another</button>
        <button className="btn-primary text-sm">View on Explorer</button>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl">
      {!connected && <DemoBanner onConnect={connect} />}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-bitcoin flex items-center justify-center shadow-[0_0_16px_rgba(247,147,26,0.4)]">
          <UploadCloud size={16} className="text-black" />
        </div>
        <div>
          <h3 className="text-white font-extrabold text-lg">Submit a Compute Job</h3>
          <p className="text-text-muted text-xs">BTC escrowed on Bitcoin L1 · Released only on verified completion</p>
        </div>
      </div>

      <div className="mb-5">
        <p className="text-text-muted text-xs font-semibold uppercase tracking-widest mb-2">Compute Class</p>
        <div className="grid grid-cols-2 gap-3">
          {([
            { id: 'gpu' as const, label: 'GPU', sub: 'Rendering · AI Inference · ML Training', icon: MonitorPlay, color: 'text-purple-400', active: 'bg-purple-500/20 border-purple-400', inactive: 'bg-purple-500/5 border-purple-500/20' },
            { id: 'cpu' as const, label: 'CPU', sub: 'Data Processing · Backtests · Automation', icon: Cpu, color: 'text-blue-400', active: 'bg-blue-500/20 border-blue-400', inactive: 'bg-blue-500/5 border-blue-500/20' },
          ]).map(({ id, label, sub, icon: Icon, color, active, inactive }) => (
            <button key={id} onClick={() => setComputeClass(id)} className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${computeClass === id ? active : inactive}`}>
              <div className="w-10 h-10 rounded-xl bg-bg-card flex items-center justify-center flex-shrink-0">
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className={`font-bold text-sm ${computeClass === id ? 'text-white' : 'text-text-muted'}`}>{label}</p>
                <p className="text-text-dim text-[10px] mt-0.5">{sub}</p>
              </div>
              {computeClass === id && <CheckCircle2 size={16} className={`${color} ml-auto flex-shrink-0`} />}
            </button>
          ))}
        </div>
      </div>

      <div className="card flex flex-col gap-4">
        <div>
          <label className="text-text-muted text-xs font-medium mb-1.5 block">Job Title</label>
          <input className="input-base" placeholder={computeClass === 'gpu' ? 'e.g. Render 240 animation frames at 4K' : 'e.g. ETL pipeline for 50GB CSV dataset'} value={form.title} onChange={(e) => handle('title', e.target.value)} />
        </div>
        <div>
          <label className="text-text-muted text-xs font-medium mb-1.5 block">Job Type</label>
          <select className="select-base" value={form.type} onChange={(e) => handle('type', e.target.value)}>
            {computeClass === 'gpu'
              ? <><option value="ai">AI Inference</option><option value="render">Rendering</option><option value="gpu">GPU General</option></>
              : <><option value="data">Data Processing</option><option value="research">Research / Automation</option><option value="cpu">CPU General</option></>}
          </select>
        </div>
        <div>
          <label className="text-text-muted text-xs font-medium mb-1.5 block">Description</label>
          <textarea className="input-base resize-none" rows={3} placeholder="Describe inputs, expected outputs, and constraints…" value={form.description} onChange={(e) => handle('description', e.target.value)} />
        </div>
        <div>
          <label className="text-text-muted text-xs font-medium mb-1.5 block">Input Spec (IPFS CID)</label>
          <input className="input-base font-mono" placeholder="QmXyz…" value={form.ipfsCid} onChange={(e) => handle('ipfsCid', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-text-muted text-xs font-medium mb-1.5 block">BTC Budget (sats)</label>
            <input className="input-base" type="number" placeholder="e.g. 250000" value={form.budgetSats} onChange={(e) => handle('budgetSats', e.target.value)} />
            {form.budgetSats && <p className="text-bitcoin text-xs mt-1 font-semibold">{btc(Number(form.budgetSats))}</p>}
          </div>
          <div>
            <label className="text-text-muted text-xs font-medium mb-1.5 block">Deadline</label>
            <input className="input-base" type="date" value={form.deadline} onChange={(e) => handle('deadline', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="text-text-muted text-xs font-medium mb-1.5 block">Verification Mode</label>
          <select className="select-base" value={form.verificationMode} onChange={(e) => handle('verificationMode', e.target.value)}>
            <option value="dual-run">Dual-Run — two workers compare outputs (highest trust)</option>
            <option value="challenger">Challenger — open challenge window</option>
            <option value="sample">Sample — spot-check subset (large batches)</option>
            <option value="reputation">Reputation Weighted — trusted nodes only</option>
          </select>
        </div>
        {form.budgetSats && (
          <div className="bg-bitcoin/5 border border-bitcoin/20 rounded-xl p-4 flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-bitcoin/20 flex items-center justify-center flex-shrink-0">
              <Bitcoin size={14} className="text-bitcoin" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">Escrow Preview</p>
              <p className="text-text-muted text-xs">OP_NET contract locks {btc(Number(form.budgetSats))} on Bitcoin L1</p>
            </div>
            <p className="text-bitcoin font-extrabold text-xl">{btc(Number(form.budgetSats))}</p>
          </div>
        )}
        {connected ? (
          <button className="btn-primary justify-center py-3 text-sm w-full shadow-[0_0_20px_rgba(247,147,26,0.3)]" onClick={() => setSubmitted(true)}>
            <Zap size={15} className="fill-black" /> Escrow BTC &amp; Post Job
          </button>
        ) : (
          <button className="btn-primary justify-center py-3 text-sm w-full shadow-[0_0_20px_rgba(247,147,26,0.3)]" onClick={connect}>
            <Wallet size={15} className="fill-black" /> Connect Wallet to Post Job
          </button>
        )}
        <p className="text-text-dim text-[10px] text-center">Funds held by OP_NET smart contract · Released only on verified completion · Bitcoin L1 finality</p>
      </div>
    </div>
  )
}

function NetworkStats() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Activity, label: 'Total Jobs', value: networkStats.totalJobsSubmitted.toLocaleString(), accent: 'blue' as AccentKey },
          { icon: Users, label: 'Active Nodes', value: String(networkStats.activeNodes), accent: 'success' as AccentKey },
          { icon: TrendingUp, label: 'Success Rate', value: `${networkStats.successRate}%`, accent: 'success' as AccentKey, trend: '+0.4%' },
          { icon: ServerCrash, label: 'Dispute Rate', value: `${networkStats.disputeRate}%`, accent: 'warning' as AccentKey },
        ].map((p) => <KpiCard key={p.label} {...p} />)}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h4 className="text-white font-semibold text-sm mb-4 flex items-center gap-2"><Award size={14} className="text-bitcoin" /> Worker Leaderboard</h4>
          <div className="flex flex-col">
            {[...mockWorkers].sort((a, b) => b.reputation - a.reputation).map((w, i) => (
              <div key={w.id} className="flex items-center gap-3 py-2.5 border-b border-border-subtle last:border-none">
                <span className="text-text-dim text-xs w-5 font-mono">#{i + 1}</span>
                <div className={`w-2 h-2 rounded-full ${w.status === 'online' ? 'bg-success' : w.status === 'busy' ? 'bg-warning animate-pulse' : 'bg-text-dim'}`} />
                <span className="text-white text-sm flex-1">{w.alias}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${w.hardwareClass === 'gpu' ? 'bg-purple-500/15 text-purple-400' : 'bg-blue-500/15 text-blue-400'}`}>{w.hardwareClass.toUpperCase()}</span>
                <span className="text-text-muted text-xs">{w.reputation}</span>
                <span className="text-bitcoin text-xs font-bold">{btc(w.earnings)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h4 className="text-white font-semibold text-sm mb-4 flex items-center gap-2"><Activity size={14} className="text-bitcoin" /> Global Job Feed</h4>
          <div className="flex flex-col">
            {mockJobs.map((job) => (
              <div key={job.id} className="flex items-center gap-2 py-2 border-b border-border-subtle last:border-none">
                {statusIcon(job.status)}
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${job.computeClass === 'gpu' ? 'bg-purple-500/15 text-purple-400' : 'bg-blue-500/15 text-blue-400'}`}>{job.computeClass.toUpperCase()}</span>
                <span className="text-white text-xs flex-1 truncate">{job.title}</span>
                <span className="text-bitcoin text-xs font-semibold">{btc(job.budget)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card bg-gradient-to-r from-bg-surface to-bg-card border-bitcoin/15">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { label: 'BTC Paid to Workers', value: `₿${networkStats.btcPaidToWorkers}` },
            { label: 'Avg Job Price', value: `₿${networkStats.avgJobPrice}` },
            { label: 'Median Time', value: networkStats.medianCompletionTime },
            { label: 'Compute Hours', value: networkStats.totalComputeHours.toLocaleString() + 'h' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-text-dim text-xs mb-1">{label}</p>
              <p className="text-white font-bold text-xl">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Marketplace() {
  const [tab, setTab] = useState<Tab>('board')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [filter, setFilter] = useState<JobType | 'all'>('all')
  const [search, setSearch] = useState('')
  const [acceptedJobIds, setAcceptedJobIds] = useState<Set<string>>(new Set())

  const handleAccept = (id: string) => {
    setAcceptedJobIds((prev) => new Set([...prev, id]))
    setTab('worker')
    setSelectedJob(null)
  }

  const filtered = mockJobs.filter((j) => {
    if (filter !== 'all' && j.type !== filter) return false
    if (search && !j.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const mainTabs: { id: Tab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { id: 'board', label: 'Job Board', icon: Boxes },
    { id: 'buyer', label: 'Buyer Dashboard', icon: DollarSign },
    { id: 'worker', label: 'Worker Dashboard', icon: CircuitBoard },
    { id: 'stats', label: 'Network Stats', icon: BarChart3 },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="section-label">GPU · CPU · AI · Render</div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">BitGrid Marketplace</h1>
        <p className="text-text-muted text-sm mt-1">Rent GPU/CPU compute. Pay in BTC. Settle on Bitcoin L1 via OP_NET.</p>
      </div>

      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {mainTabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => { setTab(id); setSelectedJob(null) }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
              tab === id ? 'bg-bitcoin text-black shadow-[0_0_16px_rgba(247,147,26,0.3)]' : 'text-text-muted hover:text-white hover:bg-bg-surface border border-border-subtle'
            }`}>
            <Icon size={14} />{label}
          </button>
        ))}
        <button onClick={() => { setTab('submit'); setSelectedJob(null) }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 ml-auto border-2 ${
            tab === 'submit' ? 'bg-bitcoin text-black border-bitcoin shadow-[0_0_20px_rgba(247,147,26,0.45)]' : 'text-bitcoin border-bitcoin/50 hover:border-bitcoin hover:bg-bitcoin/10'
          }`}>
          <UploadCloud size={14} /> Submit Job
        </button>
      </div>

      {tab === 'board' && (
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex-1 min-w-0">
            {/* Search + filter pills */}
            <div className="flex flex-col gap-3 mb-4">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
                <input className="input-base pl-8 w-full" placeholder="Search jobs…" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Filter size={11} className="text-text-dim flex-shrink-0" />
                {([
                  { id: 'all',      label: 'All' },
                  { id: 'ai',       label: 'AI' },
                  { id: 'render',   label: 'Render' },
                  { id: 'data',     label: 'Data' },
                  { id: 'research', label: 'Research' },
                  { id: 'gpu',      label: 'GPU' },
                  { id: 'cpu',      label: 'CPU' },
                ] as { id: JobType | 'all'; label: string }[]).map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setFilter(id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      filter === id
                        ? 'bg-bitcoin text-black shadow-[0_0_10px_rgba(247,147,26,0.3)]'
                        : 'bg-bg-surface border border-border-subtle text-text-muted hover:text-white hover:border-bitcoin/30'
                    }`}
                  >{label}</button>
                ))}
                {filtered.length > 0 && (
                  <span className="ml-auto text-text-dim text-[10px]">{filtered.length} job{filtered.length !== 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              {filtered.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  active={selectedJob?.id === job.id}
                  accepted={acceptedJobIds.has(job.id)}
                  onAccept={handleAccept}
                  onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                />
              ))}
              {filtered.length === 0 && <div className="card text-center py-10 text-text-muted text-sm">No jobs match your filter.</div>}
            </div>
          </div>
          {selectedJob && (
            <div className="w-full lg:w-[340px] flex-shrink-0">
              <JobDetail
                job={selectedJob}
                onClose={() => setSelectedJob(null)}
                accepted={acceptedJobIds.has(selectedJob.id)}
                onAccept={handleAccept}
              />
            </div>
          )}
        </div>
      )}

      {tab === 'buyer' && <BuyerDashboard />}
      {tab === 'worker' && <WorkerDashboard acceptedJobIds={acceptedJobIds} onAccept={handleAccept} />}
      {tab === 'submit' && <SubmitJob />}
      {tab === 'stats' && <NetworkStats />}
    </div>
  )
}
