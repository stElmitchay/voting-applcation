'use client'

import { getVotingapplicationProgram, getVotingapplicationProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { BN } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'
import * as anchor from '@coral-xyz/anchor'

export function useVotingProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getVotingapplicationProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getVotingapplicationProgram(provider, programId), [provider, programId])

  // Query all polls
  const polls = useQuery({
    queryKey: ['voting', 'polls', { cluster }],
    queryFn: async () => {
      try {
        const accounts = await program.account.poll.all()
        return accounts
      } catch (error) {
        console.error('Error fetching polls:', error)
        return []
      }
    },
  })

  // Initialize a new poll
  const initializePoll = useMutation({
    mutationKey: ['voting', 'initializePoll', { cluster }],
    mutationFn: async ({ pollId, description, pollStart, pollEnd }: { 
      pollId: number, 
      description: string, 
      pollStart: number, 
      pollEnd: number 
    }) => {
      const [pollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(new BN(pollId).toArray('le', 8))],
        programId
      )

      // @ts-ignore - bypass TypeScript errors for account naming discrepancies
      return (program.methods as any)
        .initialze_poll(
          new BN(pollId),
          description,
          new BN(pollStart),
          new BN(pollEnd)
        )
        .accounts({ 
          signer: provider.publicKey,
          poll: pollPda, 
          system_program: new PublicKey("11111111111111111111111111111111")
        })
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      toast.success('Poll created successfully!')
      return polls.refetch()
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to create poll')
    },
  })

  // Initialize a new candidate for a poll
  const initializeCandidate = useMutation({
    mutationKey: ['voting', 'initializeCandidate', { cluster }],
    mutationFn: async ({ pollId, candidateName }: { pollId: number, candidateName: string }) => {
      const [pollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(new BN(pollId).toArray('le', 8))],
        programId
      )
      
      const [candidatePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(new BN(pollId).toArray('le', 8)),
          Buffer.from(candidateName)
        ],
        programId
      )

      // @ts-ignore - bypass TypeScript errors for account naming discrepancies
      return (program.methods as any)
        .initialize_candidate(
          candidateName,
          new BN(pollId)
        )
        .accounts({ 
          signer: provider.publicKey,
          poll: pollPda,
          candidate: candidatePda,
          system_program: new PublicKey("11111111111111111111111111111111")
        })
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      toast.success('Candidate added successfully!')
      return polls.refetch()
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to add candidate')
    },
  })

  // Vote for a candidate
  const vote = useMutation({
    mutationKey: ['voting', 'vote', { cluster }],
    mutationFn: async ({ pollId, candidateName }: { pollId: number, candidateName: string }) => {
      const [pollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(new BN(pollId).toArray('le', 8))],
        programId
      )
      
      const [candidatePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(new BN(pollId).toArray('le', 8)),
          Buffer.from(candidateName)
        ],
        programId
      )

      // @ts-ignore - bypass TypeScript errors for account naming discrepancies
      return (program.methods as any)
        .vote(
          candidateName,
          new BN(pollId)
        )
        .accounts({ 
          signer: provider.publicKey,
          poll: pollPda,
          candidate: candidatePda
        })
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      toast.success('Vote cast successfully!')
      return polls.refetch()
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to cast vote')
    },
  })

  // Get candidates for a specific poll
  const getPollCandidates = async (pollId: number) => {
    try {
      const pollIdBuffer = Buffer.from(new BN(pollId).toArray('le', 8)).toString('base64')
      const accounts = await program.account.candidate.all([
        {
          memcmp: {
            offset: 8, // Skip the discriminator
            bytes: pollIdBuffer
          },
        },
      ])
      return accounts
    } catch (error) {
      console.error('Error fetching candidates:', error)
      return []
    }
  }

  return {
    program,
    programId,
    polls,
    initializePoll,
    initializeCandidate,
    vote,
    getPollCandidates,
  }
} 