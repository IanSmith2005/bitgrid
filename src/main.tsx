import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WalletProvider } from './context/WalletContext.tsx'
import { WalletConnectProvider } from '@btc-vision/walletconnect'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletConnectProvider theme="dark">
      <WalletProvider>
        <App />
      </WalletProvider>
    </WalletConnectProvider>
  </StrictMode>,
)
