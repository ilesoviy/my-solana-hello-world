import { useState } from "react";
import { Keypair } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useIsMounted from "./api/utils/useIsMounted";
import createMessage from "./api/createMessage";
import updateMessage from "./api/updateMessage";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [messageAccount, _] = useState(Keypair.generate());
  const [message, setMessage] = useState("");
  const [messageAuthor, setMessageAuthor] = useState("");
  const [messageTime, setMessageTime] = useState(0);
  const [inputtedMessage, setInputtedMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const wallet = useAnchorWallet();
  const mounted = useIsMounted();

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>{mounted && <WalletMultiButton />}</div>

      <div className={styles.main}>
        <h1 className={styles.title}>
          Your First Solana Program with{" "}
          <a href="https://alchemy.com/solana/?a=d0c917f7ef">Alchemy</a>!
        </h1>

        {wallet && (
          <div className={styles.message_bar}>
            <input
              className={styles.message_input}
              placeholder="Write Your Message!"
              onChange={(e) => setInputtedMessage(e.target.value)}
              value={inputtedMessage}
            />
            <button
              className={styles.message_button}
              disabled={!inputtedMessage}
              onClick={async () => {
                setLoading(true);
                const deployedMessage = message
                  ? await updateMessage(inputtedMessage, wallet, messageAccount)
                  : await createMessage(
                      inputtedMessage,
                      wallet,
                      messageAccount
                    );

                if (deployedMessage) {
                  setMessage(deployedMessage.content.toString());
                  setMessageAuthor(deployedMessage.author.toString());
                  setMessageTime(deployedMessage.timestamp.toNumber() * 1000);
                  setInputtedMessage("");
                }
                setLoading(false);
              }}
            >
              {message ? "Update the Message!" : "Create a Message!"}
            </button>
          </div>
        )}

        {loading ? (
          <div className={styles.loader_bar}>
            <h2> Loading</h2>
            <div className={styles.loader} />
          </div>
        ) : (
          wallet &&
          message && (
            <div className={styles.card}>
              <h2>Current Message: {message}</h2>
              <h2>
                Message Author: {messageAuthor.substring(0, 4)}
                ...
                {messageAuthor.slice(-4)}
              </h2>
              <h2>Time Published: {new Date(messageTime).toLocaleString()}</h2>
            </div>
          )
        )}
      </div>
    </div>
  );
}
