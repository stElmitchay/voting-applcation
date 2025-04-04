'use client'

import { getVotingapplicationProgram, getVotingapplicationProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { BN } from '@coral-xyz/anchor'
import { Cluster, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
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

  // Required SOL amount to vote (in SOL)
  const REQUIRED_SOL_AMOUNT = 1

  // Function to check SOL balance
  const checkSolBalance = async (userPublicKey: PublicKey): Promise<{ hasEnough: boolean, balance: number }> => {
    try {
      console.log('Checking SOL balance for wallet:', userPublicKey.toString())
      
      // Get account balance in lamports
      const lamports = await connection.getBalance(userPublicKey)
      
      // Convert to SOL
      const solBalance = lamports / LAMPORTS_PER_SOL
      console.log('SOL balance:', solBalance)
      
      return { 
        hasEnough: solBalance >= REQUIRED_SOL_AMOUNT,
        balance: solBalance
      }
    } catch (error) {
      console.error('Error checking SOL balance:', error)
      return { hasEnough: false, balance: 0 }
    }
  }

  // Function to get hidden polls from localStorage
  const getHiddenPolls = () => {
    const hiddenPolls = localStorage.getItem('hiddenPolls')
    return hiddenPolls ? JSON.parse(hiddenPolls) : []
  }

  // Function to hide a poll
  const hidePoll = (pollId: number) => {
    const hiddenPolls = getHiddenPolls()
    if (!hiddenPolls.includes(pollId)) {
      hiddenPolls.push(pollId)
      localStorage.setItem('hiddenPolls', JSON.stringify(hiddenPolls))
    }
  }

  // Function to unhide a poll
  const unhidePoll = (pollId: number) => {
    const hiddenPolls = getHiddenPolls()
    const updatedHiddenPolls = hiddenPolls.filter((id: number) => id !== pollId)
    localStorage.setItem('hiddenPolls', JSON.stringify(updatedHiddenPolls))
  }

  // Function to get all hidden polls
  const getHiddenPollsData = useQuery({
    queryKey: ['voting', 'hiddenPolls', { cluster }],
    queryFn: async () => {
      try {
        const accounts = await program.account.poll.all()
        const hiddenPolls = getHiddenPolls()
        return accounts.filter(account => hiddenPolls.includes(account.account.pollId.toNumber()))
      } catch (error) {
        console.error('Error fetching hidden polls:', error)
        return []
      }
    },
  })

  // Query all polls (excluding hidden ones)
  const polls = useQuery({
    queryKey: ['voting', 'polls', { cluster }],
    queryFn: async () => {
      try {
        const accounts = await program.account.poll.all()
        const hiddenPolls = getHiddenPolls()
        return accounts.filter(account => !hiddenPolls.includes(account.account.pollId.toNumber()))
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
        .initializePoll(
          new BN(pollId),
          description,
          new BN(pollStart),
          new BN(pollEnd)
        )
        .accounts({ 
          signer: provider.publicKey,
          poll: pollPda, 
          systemProgram: new PublicKey("11111111111111111111111111111111")
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
      // Get poll account to check start time
      const [pollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(new BN(pollId).toArray('le', 8))],
        programId
      )
      
      const pollAccount = await program.account.poll.fetch(pollPda)
      const now = Math.floor(Date.now() / 1000)
      
      if (now >= pollAccount.pollStart.toNumber()) {
        throw new Error('Cannot add candidates after poll has started')
      }

      const [candidatePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(new BN(pollId).toArray('le', 8)),
          Buffer.from(candidateName)
        ],
        programId
      )

      // @ts-ignore - bypass TypeScript errors for account naming discrepancies
      return (program.methods as any)
        .initializeCandidate(
          candidateName,
          new BN(pollId)
        )
        .accounts({ 
          signer: provider.publicKey,
          poll: pollPda,
          candidate: candidatePda,
          systemProgram: new PublicKey("11111111111111111111111111111111")
        })
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      toast.success('Candidate added successfully!')
      return polls.refetch()
    },
    onError: (error: any) => {
      console.error(error)
      if (error.message?.includes('poll has started')) {
        toast.error('Cannot add candidates after poll has started')
      } else {
        toast.error('Failed to add candidate')
      }
    },
  })

  // Vote for a candidate with SOL balance check
  const vote = useMutation({
    mutationKey: ['voting', 'vote', { cluster }],
    mutationFn: async ({ pollId, candidateName }: { pollId: number, candidateName: string }) => {
      // Check SOL balance before allowing to vote
      console.log('Checking SOL balance before voting...')
      const { hasEnough, balance } = await checkSolBalance(provider.publicKey)
      console.log('Has enough SOL:', hasEnough, 'Balance:', balance, 'Required:', REQUIRED_SOL_AMOUNT)
      
      if (!hasEnough) {
        throw new Error(`Voting requires ${REQUIRED_SOL_AMOUNT} SOL. You have ${balance.toFixed(4)} SOL.`)
      }

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
    onError: (error: any) => {
      console.error('Vote error details:', error)
      if (error.message?.includes('SOL')) {
        toast.error(error.message)
      } else {
        toast.error('Failed to cast vote: ' + (error.message || 'Unknown error'))
      }
    },
  })

  // Get candidates for a specific poll
  const getPollCandidates = async (pollId: number) => {
    try {
      const accounts = await program.account.candidate.all()
      // Filter candidates that belong to this poll
      return accounts.filter(account => {
        const [candidatePda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from(new BN(pollId).toArray('le', 8)),
            Buffer.from(account.account.candidateName)
          ],
          programId
        )
        return candidatePda.equals(account.publicKey)
      })
    } catch (error) {
      console.error('Error fetching candidates:', error)
      return []
    }
  }

  const deleteCandidate = useMutation({
    mutationKey: ['voting', 'deleteCandidate', { cluster }],
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
        .deleteCandidate(candidateName, new BN(pollId))
        .accounts({ 
          signer: provider.publicKey,
          poll: pollPda,
          candidate: candidatePda
        })
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      toast.success('Candidate deleted successfully!')
      return polls.refetch()
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to delete candidate')
    },
  })

  return {
    program,
    programId,
    polls,
    initializePoll,
    hidePoll,
    initializeCandidate,
    deleteCandidate,
    vote,
    getPollCandidates,
    checkSolBalance,
    REQUIRED_SOL_AMOUNT,
    unhidePoll,
    getHiddenPollsData
  }
} 