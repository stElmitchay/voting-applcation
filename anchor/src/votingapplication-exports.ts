// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import VotingapplicationIDL from '../target/idl/votingapplication.json'
import type { Votingapplication } from '../target/types/votingapplication'

// Re-export the generated IDL and type
export { Votingapplication, VotingapplicationIDL }

// The programId is imported from the program IDL.
export const VOTINGAPPLICATION_PROGRAM_ID = new PublicKey(VotingapplicationIDL.address)

// This is a helper function to get the Votingapplication Anchor program.
export function getVotingapplicationProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...VotingapplicationIDL, address: address ? address.toBase58() : VotingapplicationIDL.address } as Votingapplication, provider)
}

// This is a helper function to get the program ID for the Votingapplication program depending on the cluster.
export function getVotingapplicationProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Votingapplication program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return VOTINGAPPLICATION_PROGRAM_ID
  }
}
