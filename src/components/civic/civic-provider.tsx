'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { GatewayProvider, useGateway } from '@civic/solana-gateway-react'
import { Connection, PublicKey } from '@solana/web3.js'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

const UNIQUENESS_PASS_KEY = new PublicKey('uniqobk8oGh4XBLMqM68K8M2zNu3CdYX7q5go7whQiv')

interface CivicContextType {
  hasValidPass: boolean
  isLoading: boolean
  error: string | null
  refreshPass: () => Promise<void>
}

const CivicContext = createContext<CivicContextType>({
  hasValidPass: false,
  isLoading: true,
  error: null,
  refreshPass: async () => {},
})

export function CivicProvider({ children }: { children: ReactNode }) {
  const { publicKey, connected } = useWallet()
  const { gatewayToken, requestGatewayToken } = useGateway()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const hasValidPass = !!gatewayToken && gatewayToken.state === 'ACTIVE'

  const refreshPass = async () => {
    try {
      setIsLoading(true)
      setError(null)
      if (!publicKey) {
        throw new Error('Wallet not connected')
      }
      await requestGatewayToken()
    } catch (err) {
      console.error('Civic verification error:', err)
      setError(err instanceof Error ? err.message : 'Failed to refresh Civic Pass')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (connected && publicKey) {
      refreshPass().catch(console.error)
    } else {
      setIsLoading(false)
    }
  }, [connected, publicKey])

  return (
    <CivicContext.Provider value={{ hasValidPass, isLoading, error, refreshPass }}>
      {children}
    </CivicContext.Provider>
  )
}

export function CivicWrapper({ children }: { children: ReactNode }) {
  const { publicKey } = useWallet()
  const connection = new Connection('https://api.devnet.solana.com')

  if (!publicKey) {
    return <>{children}</>
  }

  const wallet = {
    publicKey,
    signTransaction: async (transaction: any) => {
      // This will be handled by the wallet adapter
      return transaction
    },
    signAllTransactions: async (transactions: any[]) => {
      // This will be handled by the wallet adapter
      return transactions
    }
  }

  return (
    <GatewayProvider
      connection={connection}
      wallet={wallet}
      gatekeeperNetwork={UNIQUENESS_PASS_KEY}
    >
      <CivicProvider>{children}</CivicProvider>
    </GatewayProvider>
  )
}

export const useCivic = () => useContext(CivicContext) 