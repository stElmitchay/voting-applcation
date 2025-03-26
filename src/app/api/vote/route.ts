// import { ActionGetRequest, ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse,} from "@solana/actions"
// import { Connection, PublicKey, Transaction } from "@solana/web3.js";
// import { title } from "process"
// import { Votingapplication } from "@/../anchor/target/types/votingapplication";
// import { BN, Program } from "@coral-xyz/anchor";

// const IDL = require('@/../anchor/target/idl/votingapplication.json');


// export const OPTIONS = GET;

// export async function GET(request: Request) {
//   const actionMetadata: ActionGetRequest = {
//     icon:"https://pbs.twimg.com/profile_images/1691898050250199040/bxXygbsW_400x400.jpg",
//     title: "Vote",
//     description: "Simplifying Voting processes in Sierra Leone",
//     label: "Vote",
//     links:{
//       actions: [
//         {
//           label: "Name",        
//           href: "/api/vote?candidate=Name",
//         },
//         {
//           label: "Name2",
//           href: "/api/vote?candidate=Name2",
//         }
//       ]
//     }
//   }; 
//   return Response.json(actionMetadata, {headers: ACTIONS_CORS_HEADERS})
// }

// export async function POST(request: Request) {
//   const url =new URL(request.url);
//   const candidate = url.searchParams.get('candidate');

//   if (candidate != "Name" && candidate != "Name2")
//     {
//       return new Response("Invalid candidate",{status:400, headers: ACTIONS_CORS_HEADERS})
//     }

//     const connection = new Connection("https://api.devnet.solana.com","confirmed");
//     const program: Program<Votingapplication> = new Program(IDL, {connection})

//     const body: ActionPostRequest = await request.json();
//     let voter;

//     try{
//      voter = new PublicKey(body.account);
//     } catch (error){
//       return new Response("Invalid account", {status:400, headers: ACTIONS_CORS_HEADERS})
//     } 

//     const instruction = await program.methods
//     .vote(candidate, new BN(1))
//     .accounts({
//       signer: voter,

//     })
//     .instruction()

//     const blockhash = await connection.getLatestBlockhash();

//     const transaction = new Transaction({
//       feePayer: voter,
//       blockhash: blockhash.blockhash,
//       lastValidBlockHeight: blockhash.lastValidBlockHeight,
//     }).add(instruction);

//     const response = await createPostResponse({
//       fields: {
//         transaction: transaction
//       }
//     });

//     return Response.json(response, {headers: ACTIONS_CORS_HEADERS});
// }
