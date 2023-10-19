import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolanaHelloWorld } from "../target/types/solana_hello_world";
import * as assert from "assert";

describe("solana-hello-world", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .SolanaHelloWorld as Program<SolanaHelloWorld>;

  it("Can create a message", async () => {
    const message = anchor.web3.Keypair.generate();
    const messageContent = "Hello World!";
    await program.rpc.createMessage(messageContent, {
      accounts: {
        message: message.publicKey,
        author: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [message],
    });

    const messageAccount = await program.account.message.fetch(
      message.publicKey
    );

    assert.equal(
      messageAccount.author.toBase58(),
      provider.wallet.publicKey.toBase58()
    );
    assert.equal(messageAccount.content, messageContent);
    assert.ok(messageAccount.timestamp);
  });

  it("Can create and then update a message", async () => {
    const message = anchor.web3.Keypair.generate();
    const messageContent = "Hello World!";
    await program.rpc.createMessage(messageContent, {
      accounts: {
        message: message.publicKey,
        author: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [message],
    });

    const updatedMessageContent = "Solana is cool!";
    await program.rpc.updateMessage(updatedMessageContent, {
      accounts: {
        message: message.publicKey,
        author: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    });

    const messageAccount = await program.account.message.fetch(
      message.publicKey
    );

    assert.equal(
      messageAccount.author.toBase58(),
      provider.wallet.publicKey.toBase58()
    );
    assert.notEqual(messageAccount.content, messageContent);
    assert.equal(messageAccount.content, updatedMessageContent);
    assert.ok(messageAccount.timestamp);
  });
});
