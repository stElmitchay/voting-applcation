'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { PollsList } from './voting-ui'
import Link from 'next/link'

export function VotingFeature() {
  const { publicKey } = useWallet()

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-[#0A1A14] flex items-center justify-center">
        <div className="max-w-md px-6">
          <div className="bg-[#0A1A14] rounded-xl border border-[#143D28] overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-[#A3E4D7] rounded-full flex items-center justify-center mx-auto mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0A1A14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[#F5F5F5] mb-3">View Active Polls</h1>
              <div className="w-16 h-0.5 bg-[#143D28] mx-auto mb-5"></div>
              <p className="text-[#A3E4D7] mb-8 px-4">
                Connect your wallet to view and vote on active polls on the Solana blockchain.
              </p>
              <div className="mb-3">
                <WalletButton />
              </div>
              <p className="text-sm text-[#A3E4D7]/70">
                Connect your wallet to get started
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A1A14] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#0A1A14] rounded-xl border border-[#143D28] overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#A3E4D7] rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0A1A14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-[#F5F5F5]">Active Polls</h1>
                  </div>
                  <Link href="/create-poll" className="bg-[#143D28] hover:bg-[#1e5438] text-[#F5F5F5] py-2 px-4 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#A3E4D7] focus:ring-offset-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create New Poll
                  </Link>
                </div>
                
                <div className="mt-4">
                  <PollsList />
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:block lg:col-span-1">
            <div className="bg-[#0A1A14] rounded-xl overflow-hidden border border-[#143D28] sticky top-4">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[#A3E4D7] rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0A1A14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-[#F5F5F5]">About Voting</h2>
                </div>
                <p className="text-sm text-[#F5F5F5] mb-6">
                  Utopia is a decentralized voting platform built on Solana blockchain technology. 
                  Create polls, vote securely, and track results in real-time.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#143D28] rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#A3E4D7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-[#F5F5F5]/70">Secure and transparent voting on the blockchain</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#143D28] rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#A3E4D7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-[#F5F5F5]/70">Real-time results and vote tracking</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#143D28] rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#A3E4D7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-[#F5F5F5]/70">Create and manage your own polls</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export as default to maintain backward compatibility 
export default VotingFeature 