import { Link } from 'react-router-dom'
import { Zap, Github, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-dark mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-bitcoin flex items-center justify-center">
                <Zap size={14} className="text-black fill-black" />
              </div>
              <span className="font-bold text-white text-sm">BitGrid</span>
            </Link>
            <p className="text-text-muted text-xs leading-relaxed max-w-[200px]">
              Rent compute. Pay in BTC. Verify on Bitcoin.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-text-muted hover:text-white transition-colors"
              >
                <Github size={16} />
              </a>
              <a
                href="https://opnet.org"
                target="_blank"
                rel="noreferrer"
                className="text-text-muted hover:text-white transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          {/* Protocol */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-3">Protocol</h4>
            <ul className="flex flex-col gap-2">
              {[
                { label: 'Product', to: '/product' },
                { label: 'How It Works', to: '/how-it-works' },
                { label: 'Architecture', to: '/architecture' },
                { label: 'Verification', to: '/verification' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-text-muted hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-3">Marketplace</h4>
            <ul className="flex flex-col gap-2">
              {[
                { label: 'Job Board', to: '/marketplace' as const },
                { label: 'Submit Job', to: '/marketplace' as const },
                { label: 'For Workers', to: '/workers' as const },
                { label: 'For Developers', to: '/developers' as const },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-text-muted hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-3">Resources</h4>
            <ul className="flex flex-col gap-2">
              {[
                { label: 'Demo', to: '/demo' as string | undefined, href: undefined },
                { label: 'Use Cases', to: '/use-cases' as string | undefined, href: undefined },
                { label: 'FAQ', to: '/faq' as string | undefined, href: undefined },
                { label: 'OP_NET', to: undefined, href: 'https://opnet.org' as string | undefined },
              ].map((l) => (
                <li key={l.label}>
                  {l.to ? (
                    <Link to={l.to} className="text-text-muted hover:text-white text-sm transition-colors">
                      {l.label}
                    </Link>
                  ) : (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-text-muted hover:text-white text-sm transition-colors inline-flex items-center gap-1"
                    >
                      {l.label} <ExternalLink size={10} />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-dim text-xs">
            © 2026 BitGrid. Built on OP_NET — Bitcoin L1 smart contracts.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-text-dim text-xs hover:text-text-muted cursor-pointer transition-colors">Terms</span>
            <span className="text-text-dim text-xs hover:text-text-muted cursor-pointer transition-colors">Privacy</span>
            <span className="text-text-dim text-xs hover:text-text-muted cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
