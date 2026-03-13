import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ArrowRight } from 'lucide-react'

const faqs = [
  {
    q: 'Why put a compute marketplace on Bitcoin?',
    a: 'Bitcoin is the most secure, most credible monetary base layer. A compute marketplace that settles in BTC inherits that credibility — payments are final, escrow is enforced by code, and no party can unilaterally freeze funds. Most existing compute markets settle off-chain or on non-Bitcoin infrastructure with weaker guarantees.',
  },
  {
    q: 'Why OP_NET instead of another chain?',
    a: 'OP_NET enables programmable logic — escrow, challenge windows, payout rules — using Bitcoin\'s own security model. There\'s no separate gas token, no bridge risk, and no validator set to trust. Job coordination happens on Bitcoin L1, which is precisely where the economic guarantees should live.',
  },
  {
    q: 'Are results computed on-chain?',
    a: 'No. Computation happens off-chain on worker hardware. The Bitcoin L1 / OP_NET layer stores: the job spec reference (IPFS CID), escrowed BTC, the result hash, proof records, and challenge/dispute state. Large output data lives off-chain. This is by design — on-chain compute would be prohibitively expensive.',
  },
  {
    q: 'How are outputs verified?',
    a: 'BitGrid offers four verification models: dual-run (two workers execute independently and compare hashes), challenger system (open challenge window where any verifier can contest), sample verification (statistical spot-check for large batches), and reputation-weighted (trusted nodes execute with reduced overhead). The buyer selects the mode at job submission.',
  },
  {
    q: 'How are large files handled?',
    a: 'Large inputs and outputs are stored off-chain via IPFS. The job contract stores only content-addressed hashes (CIDs). This keeps Bitcoin L1 costs minimal while maintaining a verifiable audit trail. Workers pin outputs to IPFS and submit the CID on-chain.',
  },
  {
    q: 'Why would workers participate?',
    a: 'Workers earn BTC directly for verifiable compute results. The protocol is permissionless — any node with eligible hardware can register and start accepting jobs. Reputation scores accumulated on-chain create a credible trust signal that improves access to higher-value jobs over time.',
  },
  {
    q: 'Why would buyers trust it?',
    a: 'Because trust is enforced by the protocol, not by the provider. BTC escrow is held by the smart contract, not the worker. Results must pass verification before payment is released. The challenge window gives buyers (and third-party verifiers) an explicit window to contest invalid results.',
  },
  {
    q: 'What is settled on-chain vs off-chain?',
    a: 'On-chain (Bitcoin L1 via OP_NET): job state, BTC escrow, result hashes, proof records, reputation scores, dispute outcomes, payouts. Off-chain: actual compute execution, large input/output files (via IPFS), worker client communication, job spec details.',
  },
  {
    q: 'Can this expand into AI agent infrastructure?',
    a: 'Yes. BitGrid\'s job primitives (post, assign, verify, settle) map directly onto AI agent task delegation. An AI agent can post compute jobs, pay in BTC, and receive verified results — all via the BitGrid protocol. The marketplace becomes a trustless execution layer for autonomous agents operating on Bitcoin.',
  },
  {
    q: 'What happens if a job fails or a worker disappears?',
    a: 'If a worker fails to submit a result before the deadline, the job returns to open state and the buyer\'s escrow is refunded. If a result is submitted but fails verification, the contract enters dispute state and follows the arbitration path. Worker reputation is penalized for non-delivery.',
  },
  {
    q: 'Is the first version production-ready?',
    a: 'No. The current version is a hackathon demonstration of the concept, smart contract architecture, and marketplace UX. It showcases the mechanics without deploying fully audited contracts to mainnet. A production version would require a full security audit of the OP_NET contracts and a worker client that has been hardened against adversarial inputs.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border-subtle last:border-none">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className={`text-sm font-medium transition-colors ${open ? 'text-white' : 'text-text-muted group-hover:text-white'}`}>
          {q}
        </span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-text-dim mt-0.5 transition-transform duration-200 ${open ? 'rotate-180 text-bitcoin' : ''}`}
        />
      </button>
      {open && (
        <div className="pb-5">
          <p className="text-text-muted text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="section-label mx-auto w-fit">FAQ</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-text-muted text-lg">
          Common questions from judges, buyers, and workers about how BitGrid works.
        </p>
      </div>

      <div className="card mb-12">
        {faqs.map(({ q, a }) => (
          <FAQItem key={q} q={q} a={a} />
        ))}
      </div>

      <div className="card border-bitcoin/20 bg-gradient-to-r from-bg-surface to-bg-card text-center py-8">
        <h3 className="text-white font-bold text-lg mb-2">Still have questions?</h3>
        <p className="text-text-muted text-sm mb-6">
          Explore the architecture, read the verification model, or jump straight into the demo.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/demo" className="btn-primary text-sm">
            See Demo <ArrowRight size={14} />
          </Link>
          <Link to="/architecture" className="btn-secondary text-sm">
            Architecture
          </Link>
          <Link to="/verification" className="btn-secondary text-sm">
            Verification
          </Link>
        </div>
      </div>
    </div>
  )
}
