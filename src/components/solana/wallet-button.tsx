'use client'

import { useWallet, Wallet } from '@solana/wallet-adapter-react'
import { WalletName } from '@solana/wallet-adapter-base'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useCallback, useMemo, useState } from 'react'
import { ellipsify } from '../ui/ui-layout'

export function CustomWalletButton() {
  const { wallets, wallet, publicKey, connecting, connected, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleConnectClick = useCallback(() => {
    setVisible(true)
  }, [setVisible])

  const handleDisconnectClick = useCallback(() => {
    disconnect().catch((error) => console.error(error))
    setShowDropdown(false)
  }, [disconnect])

  const formattedAddress = useMemo(() => {
    if (!publicKey) return null
    return ellipsify(publicKey.toString())
  }, [publicKey])

  const buttonContent = useMemo(() => {
    if (connected && publicKey) {
      return (
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span>{formattedAddress}</span>
        </div>
      )
    }
    
    if (connecting) {
      return (
        <div className="flex items-center">
          <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></div>
          <span>Connecting...</span>
        </div>
      )
    }
    
    return (
      <div className="flex items-center">
        <span>Connect Wallet</span>
      </div>
    )
  }, [connecting, connected, publicKey, formattedAddress])

  return (
    <div className="relative">
      <button
        className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          connected
            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        onClick={connected ? () => setShowDropdown(!showDropdown) : handleConnectClick}
      >
        {buttonContent}
        {connected && (
          <svg 
            className={`ml-2 h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {showDropdown && connected && (
        <div 
          className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-10"
        >
          <button
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={handleDisconnectClick}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
} 