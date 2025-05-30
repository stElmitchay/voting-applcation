'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { AppHero, ellipsify } from '../ui/ui-layout'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useVotingapplicationProgram } from './votingapplication-data-access'
import { VotingapplicationCreate, VotingapplicationList } from './votingapplication-ui'
import { useState, useEffect } from 'react'

export default function VotingapplicationFeature() {
  const { publicKey } = useWallet()
  const { programId } = useVotingapplicationProgram()
  const [isLoading, setIsLoading] = useState(true)



  return publicKey ? (
    <div>
      <AppHero
        title="Votingapplication"
        subtitle={
          'Create a new account by clicking the "Create" button. The state of a account is stored on-chain and can be manipulated by calling the program\'s methods (increment, decrement, set, and close).'
        }
      >
        <p className="mb-6">
          <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
        </p>
        <VotingapplicationCreate />
      </AppHero>
      <VotingapplicationList />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  )
}
