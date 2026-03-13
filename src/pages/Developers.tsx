import { Link } from 'react-router-dom'
import { Globe, Code2, Zap, Database, ArrowRight, CheckCircle2, Terminal } from 'lucide-react'

const benefits = [
  { icon: Globe, title: 'Global compute supply', desc: 'Access a distributed network of CPU/GPU workers without managing infrastructure.' },
  { icon: Zap, title: 'BTC-native payments', desc: 'Pay for compute in satoshis. No accounts, no invoices, no credit cards.' },
  { icon: CheckCircle2, title: 'Verifiable execution', desc: 'On-chain proof records give you an auditable history of every job result.' },
  { icon: Database, title: 'Open marketplace pricing', desc: 'Set your own BTC budget. Competitive pricing from a global worker network.' },
]

const integrations = [
  {
    icon: Globe,
    title: 'Web App UI',
    desc: 'Use the BitGrid marketplace directly via the browser. Submit jobs, track status, review proofs.',
    badge: 'Live now',
    badgeClass: 'badge-success',
  },
  {
    icon: Code2,
    title: 'SDK (coming soon)',
    desc: 'TypeScript SDK for programmatic job submission, status polling, and result retrieval.',
    badge: 'Roadmap',
    badgeClass: 'badge-warning',
  },
  {
    icon: Zap,
    title: 'Contract Hooks',
    desc: 'Integrate directly with the OP_NET job registry contract via on-chain calls or cross-contract invocations.',
    badge: 'Contract layer',
    badgeClass: 'badge-btc',
  },
  {
    icon: Database,
    title: 'Indexer API',
    desc: 'Query job history, worker stats, and proof records via the BitGrid indexer REST API.',
    badge: 'Roadmap',
    badgeClass: 'badge-warning',
  },
]

const devExamples = [
  {
    title: 'AI App using BitGrid inference',
    desc: 'An AI application submits image classification jobs via BitGrid. Workers run ResNet-50 and return predictions. The app pays per-request in BTC.',
    tags: ['AI', 'GPU', 'per-request billing'],
    code: `// Submit inference job
const job = await bitgrid.submitJob({
  type: 'ai',
  computeClass: 'gpu',
  spec: ipfsCid,         // IPFS CID of input batch
  budget: 185_000,       // sats
  verification: 'dual-run'
})

// Poll for result
const result = await bitgrid.waitForResult(job.id)
console.log(result.outputCid) // IPFS CID of predictions`,
  },
  {
    title: 'Render app outsourcing frames',
    desc: 'A 3D studio submits animation frame render jobs. Workers with GPU hardware claim batches. Outputs are pinned to IPFS and verified by sample.',
    tags: ['Rendering', 'GPU', 'IPFS output'],
    code: `// Submit render job
const job = await bitgrid.submitJob({
  type: 'render',
  computeClass: 'gpu',
  spec: blenderCid,      // IPFS CID of .blend file
  budget: 890_000,       // sats
  verification: 'sample'
})

const result = await bitgrid.waitForResult(job.id)
// result.outputCid → rendered frames on IPFS`,
  },
  {
    title: 'Analytics app sending nightly batch tasks',
    desc: 'A data platform schedules nightly ETL jobs on BitGrid. Deterministic outputs make dual-run verification straightforward and cheap.',
    tags: ['Data', 'CPU', 'scheduled jobs'],
    code: `// Schedule nightly data job
cron.schedule('0 2 * * *', async () => {
  const job = await bitgrid.submitJob({
    type: 'data',
    computeClass: 'cpu',
    spec: dataCid,
    budget: 75_000,
    verification: 'dual-run'
  })
  await bitgrid.waitForResult(job.id)
})`,
  },
]

export default function Developers() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="section-label mx-auto w-fit">For Developers</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Integrate Bitcoin-native compute into your app
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto mb-8">
          Submit compute jobs via the BitGrid API. Get verified results back. Pay in BTC.
          No cloud accounts. No long-term contracts.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/marketplace" className="btn-primary text-sm px-6 py-3">
            Submit a Job <ArrowRight size={14} />
          </Link>
          <Link to="/how-it-works" className="btn-secondary text-sm px-6 py-3">
            Read the Docs
          </Link>
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

      {/* Integration options */}
      <h2 className="text-2xl font-bold tracking-tight mb-6">Integration Options</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-16">
        {integrations.map(({ icon: Icon, title, desc, badge, badgeClass }) => (
          <div key={title} className="card flex gap-4">
            <div className="w-9 h-9 rounded-xl bg-bg-surface border border-border-subtle flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon size={15} className="text-text-muted" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-semibold text-sm">{title}</h3>
                <span className={`${badgeClass} text-[10px]`}>{badge}</span>
              </div>
              <p className="text-text-muted text-xs leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Developer examples */}
      <h2 className="text-2xl font-bold tracking-tight mb-6">Developer Examples</h2>
      <div className="flex flex-col gap-6 mb-16">
        {devExamples.map(({ title, desc, tags, code }) => (
          <div key={title} className="card">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">{title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
              </div>
              <div className="flex gap-1.5 flex-wrap flex-shrink-0">
                {tags.map((t) => <span key={t} className="badge-muted text-[10px]">{t}</span>)}
              </div>
            </div>
            <div className="bg-bg-dark rounded-xl border border-border-subtle overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border-subtle bg-bg-surface/50">
                <Terminal size={11} className="text-text-dim" />
                <span className="text-text-dim text-xs font-mono">TypeScript</span>
              </div>
              <pre className="p-4 text-xs font-mono text-text-muted leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {code}
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* For app developers */}
      <div className="card border-bitcoin/20 mb-12">
        <h3 className="text-white font-semibold mb-4">For App Developers</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            'Submit jobs via API or smart contract hook',
            'Poll status or listen to contract events for updates',
            'Automate workload dispatch from your backend',
            'Integrate with AI or rendering pipelines',
            'Get auditable proof records for every completed job',
            'BTC payment — no fiat, no API keys, no accounts',
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm text-text-muted">
              <CheckCircle2 size={12} className="text-bitcoin mt-0.5 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="card border-bitcoin/20 bg-gradient-to-r from-bg-surface to-bg-card text-center py-8">
        <h3 className="text-white font-bold text-lg mb-2">Start building on BitGrid</h3>
        <p className="text-text-muted text-sm mb-6 max-w-md mx-auto">
          The marketplace is live. Submit your first job, explore the API, or integrate directly
          with the OP_NET contract layer.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/marketplace" className="btn-primary text-sm">
            Launch Marketplace <ArrowRight size={14} />
          </Link>
          <Link to="/architecture" className="btn-secondary text-sm">
            Architecture Docs
          </Link>
          <Link to="/demo" className="btn-secondary text-sm">
            Watch Demo
          </Link>
        </div>
      </div>
    </div>
  )
}
