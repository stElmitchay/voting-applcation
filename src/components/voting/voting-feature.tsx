'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
// Comment out HiddenPollsList import
import { PollsList /* HiddenPollsList */ } from './voting-ui'
import Link from 'next/link'
import { useState } from 'react'

export function VotingFeature() {
  const { publicKey } = useWallet()
  // Add filter state
  const [filter, setFilter] = useState<'active' | 'future' | 'past'>('active')

  return (
    <div className="min-h-screen bg-[#2c5446] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#2c5446] rounded-xl border border-[#F5F5DC] overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#F5F5DC] rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0A1A14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-[#F5F5DC]">Active Polls</h1>
                  </div>
                  {publicKey ? (
                    <Link href="/create-poll" className="bg-white hover:bg-[#A3E4D7] text-[#0A1A14] py-2 px-4 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#A3E4D7] focus:ring-offset-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create New Poll
                    </Link>
                  ) : (
                    <WalletButton />
                  )}
                </div>
                
                {!publicKey && (
                  <div className="mb-4 bg-[#3a6b5a] p-4 rounded-lg text-[#F5F5DC] text-sm">
                    <p className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Connect your wallet to vote on polls and create new ones.
                    </p>
                  </div>
                )}
                
                {/* Add filter dropdown */}
                <div className="flex justify-end mb-4">
                  <div className="relative">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as 'active' | 'future' | 'past')}
                      className="appearance-none bg-[#3a6b5a] border border-[#F5F5DC]/20 text-[#F5F5DC] py-2 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A3E4D7] focus:border-transparent"
                    >
                      <option value="active">Active Polls</option>
                      <option value="future">Future Polls</option>
                      <option value="past">Past Polls</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#F5F5DC]">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  {/* Pass filter to PollsList */}
                  <PollsList filter={filter} />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#2c5446] rounded-xl border border-[#F5F5DC] overflow-hidden p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-[#F5F5DC] rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0A1A14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-[#F5F5DC]">About Voting</h2>
              </div>
              
              <div className="space-y-4 text-[#F5F5DC]/80 text-sm">
                <p>
                  Our decentralized voting platform leverages Solana blockchain technology to provide secure, transparent, and efficient voting experiences.
                </p>
                <p>
                  <strong>Features:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Secure voting with blockchain validation</li>
                  <li>Real-time results and transparent vote counting</li>
                  <li>Customizable poll parameters and end dates</li>
                </ul>
                <p>
                  Connect your wallet to create polls, vote, and participate in the community.
                </p>
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