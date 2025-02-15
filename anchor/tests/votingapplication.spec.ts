import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import { Votingapplication } from '../target/types/votingapplication';
import {startAnchor} from "solana-bankrun";
import {BankrunProvider} from "anchor-bankrun";
import { publicKey } from '@coral-xyz/anchor/dist/cjs/utils';
import { initialize } from 'next/dist/server/lib/render-server';

const IDL = require ('../target/idl/votingapplication.json');

// @ts-ignore
process.removeAllListeners('warning');

const votingAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF")
describe('votingapplication', () =>{

  let context;
  let provider;
  let VotingapplicationProgram: Program<Votingapplication>;

  beforeAll(async () =>{
    context = await startAnchor("", [{
      name: "votingapplication",
      programId: votingAddress
    }], []);
    
     provider = new BankrunProvider(context);

    VotingapplicationProgram = new Program<Votingapplication>(
      IDL,
      provider,
    );
  })
  it('Intialize Poll', async () => {
      
    await VotingapplicationProgram.methods.initialzePoll(
      new anchor.BN(1),
      "Who is your GOAT?",
      new anchor.BN(0),
      new anchor.BN(1839279437)
    ).rpc();

    const[pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,'le',8)],
      votingAddress,
    )

    const poll = await VotingapplicationProgram.account.poll.fetch(pollAddress);
    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("Who is your GOAT?");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());

  });

  it("initialize candidate", async () => {

  })

  it ("vote", async() =>{

  })
  
});
