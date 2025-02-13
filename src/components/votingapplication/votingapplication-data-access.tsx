'use client'

import { getVotingapplicationProgram, getVotingapplicationProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useVotingapplicationProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getVotingapplicationProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getVotingapplicationProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['votingapplication', 'all', { cluster }],
    queryFn: () => program.account.votingapplication.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['votingapplication', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ votingapplication: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useVotingapplicationProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useVotingapplicationProgram()

  const accountQuery = useQuery({
    queryKey: ['votingapplication', 'fetch', { cluster, account }],
    queryFn: () => program.account.votingapplication.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['votingapplication', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ votingapplication: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['votingapplication', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ votingapplication: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['votingapplication', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ votingapplication: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['votingapplication', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ votingapplication: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
