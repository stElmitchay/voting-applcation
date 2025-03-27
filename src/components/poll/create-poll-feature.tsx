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
      <div className="min-h-screen bg-[#0A1A14] flex items-center justify-center">
        <div className="max-w-md px-6">
          <div className="bg-[#0A1A14] rounded-xl border border-[#143D28] overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-[#A3E4D7] rounded-full flex items-center justify-center mx-auto mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0A1A14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[#F5F5F5] mb-3">Create a New Poll</h1>
              <div className="w-16 h-0.5 bg-[#143D28] mx-auto mb-5"></div>
              <p className="text-[#A3E4D7] mb-8 px-4">
                Connect your wallet to create a new poll on the Solana blockchain.
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-[#F5F5F5]">Create a New Poll</h1>
            <div className="text-sm font-medium text-[#A3E4D7]">
              Step {stage} of 2
            </div>
          </div>
          <div className="mt-4 relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#143D28]">
              <div style={{ width: `${stage * 50}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-[#0A1A14] justify-center bg-[#A3E4D7] transition-all duration-500"></div>
            </div>
            <div className="flex justify-between">
              <div className={`text-sm ${stage >= 1 ? 'font-medium text-[#A3E4D7]' : 'text-[#F5F5F5]/50'}`}>Poll Details</div>
              <div className={`text-sm ${stage >= 2 ? 'font-medium text-[#A3E4D7]' : 'text-[#F5F5F5]/50'}`}>Add Candidates</div>
            </div>
          </div>
        </div>

        <div className="bg-[#0A1A14] border border-[#143D28] overflow-hidden rounded-lg">
          {stage === 1 && (
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-[#F5F5F5] mb-4">Enter Poll Details</h2>
              <div className="space-y-5">
                <CreatePollForm onPollCreated={handlePollCreated} />
              </div>
            </div>
          )}

          {stage === 2 && (
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-[#F5F5F5] mb-4">Add Candidates</h2>
              <p className="text-sm text-[#A3E4D7]/70 mb-4">
                Add at least two candidates to your poll. Voters will be able to choose between these options.
              </p>

              <div className="mb-6 flex">
                <input
                  type="text"
                  placeholder="Enter candidate name"
                  className="flex-grow px-4 py-2.5 bg-[#0A1A14] border border-[#143D28] rounded-l-lg text-[#F5F5F5] text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#A3E4D7] focus:border-transparent placeholder-[#A3E4D7]/50"
                  value={newCandidate}
                  onChange={(e) => setNewCandidate(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCandidate()}
                />
                <button
                  onClick={handleAddCandidate}
                  className="px-4 py-2.5 bg-[#143D28] text-[#F5F5F5] text-sm font-medium rounded-r-lg hover:bg-[#1e5438] transition-colors focus:outline-none focus:ring-2 focus:ring-[#A3E4D7] focus:ring-offset-2"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2 mb-6">
                {candidates.length > 0 ? (
                  candidates.map((candidate, index) => (
                    <div key={index} className="flex items-center justify-between bg-[#0A1A14] border border-[#143D28] p-3 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#143D28] flex items-center justify-center">
                          <span className="text-sm font-medium text-[#F5F5F5]">{index + 1}</span>
                        </div>
                        <span className="ml-3 text-sm font-medium text-[#F5F5F5]">{candidate}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveCandidate(index)}
                        className="text-[#F5F5F5]/70 hover:text-red-500"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-[#F5F5F5]/50">
                    No candidates added yet. Add at least two candidates to create a poll.
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStage(1)}
                  className="px-4 py-2 border border-[#143D28] text-sm font-medium rounded-md text-[#F5F5F5] bg-[#0A1A14] hover:bg-[#143D28] focus:outline-none focus:ring-2 focus:ring-[#A3E4D7] focus:ring-offset-2"
                  disabled={isSubmitting}
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={candidates.length < 2 || isSubmitting}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    candidates.length < 2 || isSubmitting
                      ? 'bg-[#143D28]/50 text-[#F5F5F5]/50 cursor-not-allowed'
                      : 'bg-[#143D28] text-[#F5F5F5] hover:bg-[#1e5438] focus:outline-none focus:ring-2 focus:ring-[#A3E4D7] focus:ring-offset-2'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-[#F5F5F5] rounded-full"></div>
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