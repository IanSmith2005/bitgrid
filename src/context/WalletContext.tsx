import { createContext, useContext, type ReactNode } from 'react'
import { useWalletConnect, type WalletInformation, SupportedWallets } from '@btc-vision/walletconnect'

interface WalletState {
  connected: boolean
  connecting: boolean
  address: string
  balance: number
  confirmed: number
  unconfirmed: number
  allWallets: WalletInformation[]
  connect: () => void
  connectToWallet: (wallet: SupportedWallets) => void
  disconnect: () => void
}

const WalletContext = createContext<WalletState | null>(null)

export function WalletProvider({ children }: { children: ReactNode }) {
  const {
    walletAddress,
    walletBalance,
    openConnectModal,
    connectToWallet,
    disconnect,
    connecting,
    allWallets,
  } = useWalletConnect()

  return (
    <WalletContext.Provider value={{
      connected: !!walletAddress,
      connecting,
      address: walletAddress ?? '',
      balance: walletBalance?.total ?? 0,
      confirmed: walletBalance?.confirmed ?? 0,
      unconfirmed: walletBalance?.unconfirmed ?? 0,
      allWallets,
      connect: openConnectModal,
      connectToWallet,
      disconnect,
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used inside WalletProvider')
  return ctx
}

export { SupportedWallets }
export type { WalletInformation }
