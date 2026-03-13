import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap, Wallet, ChevronDown, Copy, LogOut, Bitcoin, FlaskConical } from 'lucide-react'
import { useWallet } from '../../context/WalletContext'

const navLinks = [
  { label: 'Product', to: '/product' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Marketplace', to: '/marketplace' },
  { label: 'Workers', to: '/workers' },
  { label: 'Developers', to: '/developers' },
  { label: 'Demo', to: '/demo' },
]

function btcDisplay(sats: number) {
  return (sats / 100_000_000).toFixed(5)
}

// ── Wallet button ─────────────────────────────────────────────────────────────
function WalletButton() {
  const { connected, connecting, address, balance, confirmed, unconfirmed, connect, disconnect } = useWallet()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (connecting) {
    return (
      <button disabled className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-bitcoin/30 text-bitcoin/60 text-xs font-semibold cursor-wait">
        <div className="w-3 h-3 rounded-full border-2 border-bitcoin/30 border-t-bitcoin animate-spin" />
        Connecting…
      </button>
    )
  }

  if (!connected) {
    return (
      <button
        onClick={connect}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-bitcoin/40 text-bitcoin text-xs font-semibold hover:bg-bitcoin/10 transition-all duration-200 hover:border-bitcoin"
      >
        <Wallet size={13} />
        Connect Wallet
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-surface border border-border-subtle hover:border-bitcoin/40 transition-all duration-200"
      >
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-bitcoin/20 flex items-center justify-center">
            <Bitcoin size={9} className="text-bitcoin" />
          </div>
          <span className="text-bitcoin font-bold text-xs">₿{btcDisplay(balance)}</span>
        </div>
        <div className="w-px h-3 bg-border-subtle" />
        <span className="text-text-muted font-mono text-[10px] hidden sm:block">
          {address.slice(0, 8)}…{address.slice(-4)}
        </span>
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <ChevronDown size={11} className={`text-text-dim transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[190]" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 z-[191] bg-bg-card border border-border-subtle rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-bitcoin/10 to-transparent p-4 border-b border-border-subtle">
              <p className="text-text-dim text-xs mb-1">Total Balance</p>
              <p className="text-white font-extrabold text-2xl tracking-tight">₿{btcDisplay(balance)}</p>
              <p className="text-text-muted text-xs mt-0.5">{balance.toLocaleString()} sats</p>
            </div>
            <div className="p-3 border-b border-border-subtle">
              <p className="text-text-dim text-[10px] mb-1 uppercase tracking-widest">Address</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-white flex-1 truncate">{address}</span>
                <button onClick={copy} className="text-text-muted hover:text-bitcoin transition-colors flex-shrink-0">
                  {copied ? <span className="text-success text-[10px]">Copied!</span> : <Copy size={12} />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border-subtle">
              <div className="bg-bg-card p-3">
                <p className="text-text-dim text-[10px]">Confirmed</p>
                <p className="text-white font-semibold text-sm">₿{btcDisplay(confirmed)}</p>
              </div>
              <div className="bg-bg-card p-3">
                <p className="text-text-dim text-[10px]">Pending</p>
                <p className={`font-semibold text-sm ${unconfirmed > 0 ? 'text-warning' : 'text-white'}`}>
                  ₿{btcDisplay(unconfirmed)}
                </p>
              </div>
            </div>
            <div className="p-2">
              <button
                onClick={() => { disconnect(); setOpen(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-error text-xs font-medium hover:bg-error/10 transition-colors"
              >
                <LogOut size={13} /> Disconnect Wallet
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ── Balance chip (demo when disconnected) ────────────────────────────────────
const DEMO_BALANCE_SATS = 18540000 // ₿0.18540

function BalanceChip() {
  const { connected, balance } = useWallet()
  const displaySats = connected ? balance : DEMO_BALANCE_SATS
  const displayBtc = btcDisplay(displaySats)

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-surface border border-border-subtle">
      <div className="w-4 h-4 rounded-full bg-bitcoin/20 flex items-center justify-center flex-shrink-0">
        <Bitcoin size={9} className="text-bitcoin" />
      </div>
      <span className="text-bitcoin font-bold text-xs">₿{displayBtc}</span>
      {!connected && (
        <span className="flex items-center gap-0.5 text-[9px] font-bold text-text-dim bg-bg-dark border border-border-subtle rounded px-1 py-0.5">
          <FlaskConical size={8} /> DEMO
        </span>
      )}
    </div>
  )
}

// ── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isActive = (to: string) => location.pathname === to

  return (
    <nav className="sticky top-0 z-50 bg-bg-dark/90 backdrop-blur-xl border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-bitcoin flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(247,147,26,0.35)]">
              <Zap size={14} className="text-black fill-black" />
            </div>
            <span className="font-bold text-white text-sm tracking-tight">BitGrid</span>
            <span className="hidden sm:block text-text-dim text-[10px] font-medium border border-border-subtle rounded px-1.5 py-0.5 ml-0.5">GPU Marketplace</span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                  isActive(link.to)
                    ? 'text-white bg-bg-surface'
                    : 'text-text-muted hover:text-white hover:bg-bg-surface/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2.5">
            <BalanceChip />
            <WalletButton />
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <WalletButton />
            <button
              onClick={() => setOpen(!open)}
              className="text-text-muted hover:text-white p-1.5 rounded-lg hover:bg-bg-surface transition-all"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border-subtle bg-bg-dark">
          <div className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.to) ? 'text-white bg-bg-surface' : 'text-text-muted hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border-subtle mt-1">
              <BalanceChip />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
