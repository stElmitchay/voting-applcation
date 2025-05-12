'use client'

import { getVotingapplicationProgram, getVotingapplicationProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { BN } from '@coral-xyz/anchor'
import { Cluster, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo, useState, useEffect } from 'react'
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
  const programId = useMemo(() => {
    const id = getVotingapplicationProgramId(cluster.network as Cluster)
    console.log('Initializing program with ID:', id.toString())
    return id
  }, [cluster])
  
  const program = useMemo(() => {
    console.log('Creating program with provider:', provider.publicKey?.toString())
    const p = getVotingapplicationProgram(provider, programId)
    console.log('Program created successfully')
    return p
  }, [provider, programId])

  // Required SOL amount to vote (in SOL)
  const REQUIRED_SOL_AMOUNT = 1
  const [solBalance, setSolBalance] = useState<number>(0)
  const [hasEnoughSol, setHasEnoughSol] = useState<boolean>(false)

  // Check SOL balance when wallet connects
  useEffect(() => {
    const checkBalance = async () => {
      if (provider.publicKey) {
        try {
          console.log('Checking SOL balance for wallet:', provider.publicKey.toString())
          const lamports = await connection.getBalance(provider.publicKey)
          const balance = lamports / LAMPORTS_PER_SOL
          console.log('SOL balance:', balance)
          setSolBalance(balance)
          setHasEnoughSol(balance >= REQUIRED_SOL_AMOUNT)
        } catch (error) {
          console.error('Error checking SOL balance:', error)
          setSolBalance(0)
          setHasEnoughSol(false)
        }
      }
    }

    checkBalance()
  }, [provider.publicKey, connection])

  // Function to get hidden polls from localStorage
  const getHiddenPolls = () => {
    const hiddenPolls = localStorage.getItem('hiddenPolls')
    return hiddenPolls ? JSON.parse(hiddenPolls) : []
  }

  // Function to get active polls from localStorage
  const getActivePolls = () => {
    const activePolls = localStorage.getItem('activePolls')
    return activePolls ? JSON.parse(activePolls) : []
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

  // Function to set a poll as active
  const setPollActive = (pollId: number, isActive: boolean) => {
    const activePolls = getActivePolls()
    if (isActive && !activePolls.includes(pollId)) {
      activePolls.push(pollId)
    } else if (!isActive) {
      const updatedActivePolls = activePolls.filter((id: number) => id !== pollId)
      localStorage.setItem('activePolls', JSON.stringify(updatedActivePolls))
      return
    }
    localStorage.setItem('activePolls', JSON.stringify(activePolls))
  }

  // Function to check if a poll is active
  const isPollActive = (pollId: number) => {
    const activePolls = getActivePolls()
    return activePolls.includes(pollId)
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
        console.log('Fetching polls...')
        const accounts = await program.account.poll.all()
        const hiddenPolls = getHiddenPolls()
        return accounts.filter(account => !hiddenPolls.includes(account.account.pollId.toNumber()))
      } catch (error) {
        console.error('Error fetching polls:', error)
        return []
      }
    },
    staleTime: Infinity, // Never consider the data stale
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnReconnect: false, // Don't refetch when reconnecting
  })

  // Function to manually refetch polls
  const refetchPolls = () => {
    console.log('Manually refetching polls...')
    polls.refetch()
  }

  // Initialize a new poll
  const initializePoll = useMutation({
    mutationKey: ['voting', 'initializePoll', { cluster }],
    mutationFn: async ({ pollId, description, pollStart, pollEnd }: { pollId: number, description: string, pollStart: number, pollEnd: number }) => {
      const [pollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(new BN(pollId).toArray('le', 8))],
        programId
      )

      return program.methods
        .initializePoll(
          new BN(pollId),
          description,
          new BN(pollStart),
          new BN(pollEnd)
        )
        .accounts({
          signer: provider.publicKey,
          poll: pollPda,
          systemProgram: anchor.web3.SystemProgram.programId
        } as any)
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      toast.success('Poll created successfully!')
      refetchPolls() // Manually refetch after creating a new poll
    },
    onError: (error: any) => {
      console.error('Error creating poll:', error)
      if (error.message?.includes('already in use')) {
        toast.error('This poll ID is already taken. Please try a different ID.')
      } else {
        toast.error('Failed to create poll: ' + error.message)
      }
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
  const vote = async ({ pollId, candidateName }: { pollId: number; candidateName: string }) => {
    if (!provider) throw new Error('Wallet not connected')
    if (!hasEnoughSol) throw new Error('Insufficient SOL balance')

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

    return await program.methods
      .vote(candidateName, new BN(pollId))
      .accounts({
        signer: provider.publicKey,
        poll: pollPda,
        candidate: candidatePda,
        systemProgram: SystemProgram.programId
      } as any)
      .rpc()
  }

  // Function to get candidates for a specific poll
  const getPollCandidates = async (pollId: number) => {
    try {
      const accounts = await program.account.candidate.all()
      // Filter candidates that belong to this poll
      return accounts.filter(account => {
        const pollIdBuffer = Buffer.from(new BN(pollId).toArray('le', 8))
        const candidateNameBuffer = Buffer.from(account.account.candidateName)
        const [candidatePda] = PublicKey.findProgramAddressSync(
          [pollIdBuffer, candidateNameBuffer],
          programId
        )
        return candidatePda.equals(account.publicKey)
      })
    } catch (error) {
      console.error('Error fetching candidates:', error)
      return []
    }
  }

  // Function to check if the current user is an admin (the creator of the poll)
  const isUserAdmin = (pollCreator: PublicKey | null) => {
    if (!provider.publicKey || !pollCreator) return false
    return provider.publicKey.toString() === pollCreator.toString()
  }

  return {
    program,
    programId,
    polls,
    initializePoll,
    hidePoll,
    initializeCandidate,
    vote,
    getPollCandidates,
    solBalance,
    hasEnoughSol,
    REQUIRED_SOL_AMOUNT,
    unhidePoll,
    getHiddenPollsData,
    setPollActive,
    isPollActive,
    isUserAdmin
  }
} 