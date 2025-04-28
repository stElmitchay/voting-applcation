import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import { Votingapplication } from '../target/types/votingapplication';
import {startAnchor} from "solana-bankrun";
import {BankrunProvider} from "anchor-bankrun";
import { publicKey } from '@coral-xyz/anchor/dist/cjs/utils';
import { initialize } from 'next/dist/server/lib/render-server';
import { Z_ASCII } from 'zlib';

const IDL = require ('../target/idl/votingapplication.json');

// @ts-ignore
process.removeAllListeners('warning');

const votingAddress = new PublicKey("5zuwXytbwB9nDBvpcP8n235F2hBJSSPc561MB25kZboX")
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
    await VotingapplicationProgram.methods.initializeCandidate(
      "Name",
      new anchor.BN(1),
    ).rpc();
    await VotingapplicationProgram.methods.initializeCandidate(
      "Name2",
      new anchor.BN(1),
    ).rpc();

    const [NameAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,'le',8), Buffer.from("Name")],
      votingAddress,
    );
    const nameCandidate = await VotingapplicationProgram.account.candidate.fetch(NameAddress);
    console.log(nameCandidate);
    expect(nameCandidate.candidateVotes.toNumber()).toEqual(0)

    const [Name2Address] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,'le',8), Buffer.from("Name2")],
      votingAddress,
    );
    const name2Candidate = await VotingapplicationProgram.account.candidate.fetch(Name2Address);
    console.log(name2Candidate)
    expect(name2Candidate.candidateVotes.toNumber()).toEqual(0)
    
  })

  it ("vote", async() =>{

    await VotingapplicationProgram.methods
      .vote(
        "Name",
        new anchor.BN(1)
      ).rpc()

      const [NameAddress] = PublicKey.findProgramAddressSync(
        [new anchor.BN(1).toArrayLike(Buffer,'le',8), Buffer.from("Name")],
        votingAddress,
      );
      const nameCandidate = await VotingapplicationProgram.account.candidate.fetch(NameAddress);
      console.log(nameCandidate);
      expect(nameCandidate.candidateVotes.toNumber()).toEqual(1)

  })
  
});
