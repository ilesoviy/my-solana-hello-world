import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import { SolanaHelloWorld } from "./types/solana_hello_world";
import {
  connection,
  commitmentLevel,
  helloWorldprogramId,
  helloWorldprogramInterface,
} from "./utils/constants";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export default async function createMessage(
  inputtedMessage: string,
  wallet: AnchorWallet,
  messageAccount: web3.Keypair
) {
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: commitmentLevel,
  });

  if (!provider) return;

  /* create the program interface combining the idl, program Id, and provider */
  const program = new Program(
    helloWorldprogramInterface,
    helloWorldprogramId,
    provider
  ) as Program<SolanaHelloWorld>;

  try {
    /* interact with the program via rpc */
    const txn = await program.rpc.createMessage(inputtedMessage, {
      accounts: {
        message: messageAccount.publicKey,
        author: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      },
      signers: [messageAccount],
    });

    const message = await program.account.message.fetch(
      messageAccount.publicKey
    );
    console.log("messageAccount Data: ", message);
    return message;
  } catch (err) {
    console.log("Transaction error: ", err);
    return;
  }
}
