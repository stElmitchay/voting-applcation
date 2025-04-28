'use client'

import dynamic from 'next/dynamic'
import { AnchorProvider } from '@coral-xyz/anchor'
import { WalletError } from '@solana/wallet-adapter-base'
import {
  AnchorWallet,
  useConnection,
  useWallet,
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { ReactNode, useCallback, useMemo, useState, useEffect } from 'react'
import { useCluster } from '../cluster/cluster-data-access'
import { CustomWalletButton } from './wallet-button'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'

require('@solana/wallet-adapter-react-ui/styles.css')

// Legacy wallet button for backward compatibility
const LegacyWalletButton = dynamic(async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton, {
  ssr: false,
})

// Export our custom wallet button instead
export const WalletButton = CustomWalletButton

export function SolanaProvider({ children }: { children: ReactNode }) {
  const { cluster } = useCluster()
  const endpoint = useMemo(() => cluster.endpoint, [cluster])
  const [autoConnect, setAutoConnect] = useState<boolean>(true)
  const [retryCount, setRetryCount] = useState(0)

  // Restore autoConnect state from localStorage
  useEffect(() => {
    const storedAutoConnect = localStorage.getItem('autoConnect')
    if (storedAutoConnect === 'false') {
      setAutoConnect(false)
    }
  }, [])

  // Persist autoConnect state to localStorage
  useEffect(() => {
    localStorage.setItem('autoConnect', autoConnect.toString())
  }, [autoConnect])

  const onError = useCallback((error: WalletError) => {
    console.error('Wallet error:', error)
    
    // Handle connection rejection specifically
    if (error.name === 'WalletConnectionError' && retryCount < 3) {
      console.log('Retrying connection...')
      setRetryCount(prev => prev + 1)
      // Add a small delay before retrying
      setTimeout(() => {
        setAutoConnect(true)
      }, 1000)
    } else if (retryCount >= 3) {
      console.log('Max retries reached, disabling auto-connect')
      setAutoConnect(false)
      setRetryCount(0)
    }
  }, [retryCount])

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect={true}
        localStorageKey="wallet-adapter"
        onError={onError}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider> 
      </WalletProvider>
    </ConnectionProvider>
  )
}

export function useAnchorProvider() {
  const { connection } = useConnection()
  const wallet = useWallet()

  return new AnchorProvider(connection, wallet as AnchorWallet, { commitment: 'confirmed' })
}
