# BitGrid — Bitcoin-Native GPU/CPU Compute Marketplace

> **OP_NET Vibecode 2026 Submission**

BitGrid is a decentralized compute marketplace built on Bitcoin Layer 1 using OP_NET smart contracts. Buyers escrow BTC to pay for GPU/CPU compute jobs; workers execute workloads and receive trustless, automatic BTC payouts upon verified completion — no custodian, no token, no bridge.

---

## How It Works

1. **Buyer** submits a compute job (AI inference, rendering, data processing, etc.) and escrows BTC in an OP_NET smart contract on Bitcoin L1
2. **Worker** accepts the job, runs it in a sandboxed environment, and submits a cryptographic proof hash on-chain
3. **OP_NET contract** verifies the proof (dual-run, challenger, or sample mode) and releases the escrowed BTC directly to the worker
4. **No intermediary** ever holds funds — settlement is enforced by Bitcoin consensus

---

## Features

- **Job Board** — Browse open GPU/CPU jobs with filter pills (AI · Render · Data · Research · GPU · CPU)
- **Buyer Dashboard** — Track submitted jobs, spending breakdown, completion stats
- **Worker Dashboard** — Node identity card, hardware detection, job pipeline (Running / Available tabs), 7-day earnings chart, recent payouts
- **Submit Job** — Full job creation form with compute class selection, IPFS input spec, escrow preview
- **Network Stats** — Global metrics, worker leaderboard, live job feed
- **Wallet Integration** — `@btc-vision/walletconnect` with balance chip (demo mode when disconnected)
- **Animated Grid Background** — Canvas-based dot grid hero animation on landing page

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v3 (custom Bitcoin design tokens) |
| Routing | React Router v6 |
| Wallet | `@btc-vision/walletconnect` |
| Bitcoin | OP_NET (Bitcoin L1 Tapscript smart contracts) |
| Icons | Lucide React |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

The app runs on `http://localhost:5173` by default.

> **Demo mode**: All data is mock. Connect a wallet (Unisat, Leather, or OYL) to interact with Bitcoin L1 via OP_NET testnet.

---

## Project Structure

```
src/
  components/
    layout/        Navbar (wallet chip, connect button)
    GridBackground Canvas dot-grid animation
  context/
    WalletContext  @btc-vision/walletconnect integration
  data/
    mockData       Jobs, workers, network stats (demo)
  pages/
    Landing        Hero + animated background
    Marketplace    Job board, dashboards, submit form, stats
    Workers        Worker landing + leaderboard
    Product        Feature overview
    HowItWorks     Protocol explanation
    Developers     API / SDK docs
    Demo           Interactive demo
public/
  bitgrid-worker-install.sh  Worker client install script
```

---

## OP_NET Contract Architecture

- **JobRegistry** — Stores job metadata, handles BTC escrow lock/release
- **WorkerRegistry** — On-chain reputation scores, hardware class, stake
- **VerificationEngine** — Dual-run comparison, challenger window, sample check
- **PayoutRouter** — Releases escrowed BTC to worker address on verified proof

All contracts are Tapscript-encoded calldata on Bitcoin L1. No L2, no sidechain, no wrapped tokens.

---

## License

MIT — open source, fork it, build on it.

Built for the **OP_NET Vibecode 2026** contest.
