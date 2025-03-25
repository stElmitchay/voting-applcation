'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { PollsList } from './voting-ui'
import Link from 'next/link'

export function VotingFeature() {
  const { publicKey } = useWallet()

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md px-6">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">View Active Polls</h1>
              <div className="w-16 h-0.5 bg-gray-200 mx-auto mb-5"></div>
              <p className="text-gray-600 mb-8 px-4">
                Connect your wallet to view and vote on active polls on the Solana blockchain.
              </p>
              <div className="mb-3">
                <WalletButton />
              </div>
              <p className="text-sm text-gray-500">
                Connect your wallet to get started
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="p-8">
                  <div className="inline-flex items-center px-2.5 py-1 bg-blue-50 rounded-full mb-4">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    <span className="text-xs font-medium text-blue-700">Community Voting</span>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-5">
                    Active Polls
                  </h1>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="avatar">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">U</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-700 font-medium">Utopia</span>
                      <p className="text-xs text-gray-500">Decentralized voting platform</p>
                    </div>
                  </div>
                  
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      View and vote on active polls. Your vote is securely recorded on the Solana blockchain,
                      ensuring transparency and immutability.
                    </p>
                  </div>
                  
                  <div className="flex my-6">
                    <Link href="/create-poll" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
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
              <div className="bg-white rounded-xl overflow-hidden shadow-md sticky top-4">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">About Voting</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Utopia is a decentralized voting platform built on Solana blockchain technology. 
                    Create polls, vote securely, and track results in real-time.
                  </p>
                  
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">How it works</h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex">
                        <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">Create polls with custom options</span>
                      </li>
                      <li className="flex">
                        <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">Each wallet can vote once per poll</span>
                      </li>
                      <li className="flex">
                        <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">Results are transparent and immutable</span>
                      </li>
                      <li className="flex">
                        <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">All data stored on Solana blockchain</span>
                      </li>
                    </ul>
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