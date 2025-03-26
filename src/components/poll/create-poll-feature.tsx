'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { CreatePollForm } from '../voting/voting-ui'
import { useVotingProgram } from '../voting/voting-data-access'
import toast from 'react-hot-toast'
import * as anchor from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import { BN } from '@coral-xyz/anchor'
import { useAnchorProvider } from '../solana/solana-provider'
import { getVotingapplicationProgramId } from '@project/anchor'

export default function CreatePollFeature() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [stage, setStage] = useState(1) // 1: Poll details, 2: Add candidates
  const [pollDetails, setPollDetails] = useState<any>(null)
  const [candidates, setCandidates] = useState<string[]>([])
  const [newCandidate, setNewCandidate] = useState('')
  const { program } = useVotingProgram()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const provider = useAnchorProvider()
  const programId = getVotingapplicationProgramId('devnet')

  const handlePollCreated = (details: any) => {
    setPollDetails(details)
    setStage(2)
  }

  const handleAddCandidate = () => {
    if (newCandidate.trim() !== '') {
      setCandidates([...candidates, newCandidate.trim()])
      setNewCandidate('')
    }
  }

  const handleRemoveCandidate = (index: number) => {
    const newCandidates = [...candidates]
    newCandidates.splice(index, 1)
    setCandidates(newCandidates)
  }

  const handleFinish = async () => {
    if (candidates.length < 2 || !pollDetails) return
    
    setIsSubmitting(true)
    try {
      // Create a transaction builder
      const tx = new anchor.web3.Transaction()
      
      // Add poll initialization instruction
      const [pollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(new BN(pollDetails.pollId).toArray('le', 8))],
        programId
      )

      const initializePollIx = await program.methods
        .initializePoll(
          new BN(pollDetails.pollId),
          pollDetails.description,
          new BN(pollDetails.pollStart),
          new BN(pollDetails.pollEnd)
        )
        .accounts({ 
          signer: provider.publicKey,
          poll: pollPda, 
          systemProgram: new PublicKey("11111111111111111111111111111111")
        })
        .instruction()

      tx.add(initializePollIx)

      // Add candidate initialization instructions
      for (const candidate of candidates) {
        const [candidatePda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from(new BN(pollDetails.pollId).toArray('le', 8)),
            Buffer.from(candidate)
          ],
          programId
        )

        const initializeCandidateIx = await program.methods
          .initializeCandidate(
            candidate,
            new BN(pollDetails.pollId)
          )
          .accounts({ 
            signer: provider.publicKey,
            poll: pollPda,
            candidate: candidatePda,
            systemProgram: new PublicKey("11111111111111111111111111111111")
          })
          .instruction()

        tx.add(initializeCandidateIx)
      }

      // Send the transaction
      const signature = await provider.sendAndConfirm(tx)
      
      toast.success('Poll and candidates created successfully!')
      router.push('/voting')
    } catch (error) {
      console.error('Error creating poll:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to create poll: ${errorMessage}`);
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md px-6">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Create a New Poll</h1>
              <div className="w-16 h-0.5 bg-gray-200 mx-auto mb-5"></div>
              <p className="text-gray-600 mb-8 px-4">
                Connect your wallet to create a new poll on the Solana blockchain.
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Create a New Poll</h1>
            <div className="text-sm font-medium">
              Step {stage} of 2
            </div>
          </div>
          <div className="mt-4 relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div style={{ width: `${stage * 50}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"></div>
            </div>
            <div className="flex justify-between">
              <div className={`text-sm ${stage >= 1 ? 'font-medium text-blue-600' : 'text-gray-500'}`}>Poll Details</div>
              <div className={`text-sm ${stage >= 2 ? 'font-medium text-blue-600' : 'text-gray-500'}`}>Add Candidates</div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          {stage === 1 && (
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Enter Poll Details</h2>
              <div className="space-y-5">
                <CreatePollForm onPollCreated={handlePollCreated} />
              </div>
            </div>
          )}

          {stage === 2 && (
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Add Candidates</h2>
              <p className="text-sm text-gray-500 mb-4">
                Add at least two candidates to your poll. Voters will be able to choose between these options.
              </p>

              <div className="mb-6 flex">
                <input
                  type="text"
                  placeholder="Enter candidate name"
                  className="flex-grow px-4 py-2.5 bg-white border border-gray-200 rounded-l-lg text-gray-700 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={newCandidate}
                  onChange={(e) => setNewCandidate(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCandidate()}
                />
                <button
                  onClick={handleAddCandidate}
                  className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-r-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2 mb-6">
                {candidates.length > 0 ? (
                  candidates.map((candidate, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-800">{index + 1}</span>
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-900">{candidate}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveCandidate(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No candidates added yet. Add at least two candidates to create a poll.
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStage(1)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={isSubmitting}
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={candidates.length < 2 || isSubmitting}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    candidates.length < 2 || isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    'Create Poll'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 