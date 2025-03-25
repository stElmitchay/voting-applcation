'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import Link from 'next/link'

export default function LandingPage() {
  const { publicKey } = useWallet()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 py-8 md:py-16 lg:py-24">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                <span className="block">Utopia</span>
                <span className="block mt-2 text-3xl sm:text-4xl lg:text-5xl">Decentralized Voting Powered by Solana</span>
              </h1>
              
              <p className="mt-6 max-w-lg mx-auto text-xl text-blue-100 sm:max-w-3xl">
                Create polls, vote securely, and track results in real-time, all secured by blockchain technology.
              </p>
              
              <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                {publicKey ? (
                  <Link href="/voting" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                    View Polls
                  </Link>
                ) : (
                  <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5">
                    <div className="flex flex-col items-center">
                      <WalletButton />
                      <p className="mt-3 text-sm text-blue-100">Connect your wallet to get started</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8">
                <Link href="/create-poll" className="text-blue-100 hover:text-white flex justify-center items-center font-medium transition-colors">
                  <span>Learn More</span>
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full text-gray-50" viewBox="0 0 1440 120" fill="currentColor" preserveAspectRatio="none">
            <path d="M0,96L60,80C120,64,240,32,360,21.3C480,11,600,21,720,42.7C840,64,960,96,1080,96C1200,96,1320,64,1380,48L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
          </svg>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to vote
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Utopia provides a secure, transparent, and easy-to-use platform for decentralized voting.
            </p>
          </div>

          <div className="mt-12">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Create Custom Polls</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Set up polls with custom descriptions, durations, and multiple candidates.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Secure Blockchain Voting</h3>
                  <p className="mt-2 text-base text-gray-500">
                    All votes are secured by Solana blockchain, ensuring they can't be tampered with.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Real-time Results</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Track voting results in real-time as they're recorded on the blockchain.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">How It Works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Getting Started is Easy
            </p>
          </div>
          
          <div className="mt-16">
            <div className="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 text-blue-600 text-xl font-bold mx-auto">
                  1
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Connect Wallet</h3>
                <p className="mt-2 text-base text-gray-500">
                  Connect your Solana wallet to get started with our platform.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 text-blue-600 text-xl font-bold mx-auto">
                  2
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Create or Browse</h3>
                <p className="mt-2 text-base text-gray-500">
                  Create your own poll or browse existing ones to participate.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 text-blue-600 text-xl font-bold mx-auto">
                  3
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Cast Your Vote</h3>
                <p className="mt-2 text-base text-gray-500">
                  Vote on active polls securely and transparently.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 text-blue-600 text-xl font-bold mx-auto">
                  4
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">View Results</h3>
                <p className="mt-2 text-base text-gray-500">
                  Track results in real-time as they come in from the blockchain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to start voting?</span>
            <span className="block">Join Utopia today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-100">
            Get started with decentralized voting in minutes.
          </p>
          <div className="mt-8 flex justify-center">
            {publicKey ? (
              <div className="inline-flex rounded-md shadow">
                <Link
                  href="/voting"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
                >
                  View Polls
                </Link>
              </div>
            ) : (
              <div className="inline-flex rounded-md shadow">
                <WalletButton />
              </div>
            )}
            <div className="ml-3 inline-flex">
              <Link
                href="/create-poll"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700"
              >
                Create a Poll
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 