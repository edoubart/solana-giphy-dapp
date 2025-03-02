// NPM Packages
import { useEffect, useState } from 'react';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { web3, AnchorProvider, Program } from '@coral-xyz/anchor';
import { Buffer } from 'buffer';

// Styles
import './index.css';

// Interface Definition Language (IDL)
import idl from './../../idl.json';

// Keypair
import kp from './../../keypair.json';

// Data
const GIFS = [
  'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGM0ZWV2cWgwcnNqd3ZxczY3N3NmcnRtdmlwdDU5eG9vMjVydW1wbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bbshzgyFQDqPHXBo4c/giphy.gif',
  'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGJ3MmZ3bXpyM254amdmdGIwNjk1NjNxcTYxeGZub3I5cjU3MWZzdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26gsspfbt1HfVQ9va/giphy.gif',
  'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXBkNnRxdHk4aXloNHdlNnc3Zno4dGsyaGE2Y2M3cDJ3MzR4eThiNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/otnqsqqzmsw7K/giphy.gif',
];

// Constants
const APP_TITLE = "🖼 GIF Portal";
const APP_DESCRIPTION = "View your GIF collection in the metaverse ✨";
const CONNECT_WALLET_BUTTON_LABEL = "Connect to Wallet";

// Solana
const { SystemProgram, Keypair } = web3;
window.Buffer = Buffer;
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);
const programId = new PublicKey(idl.metadata.address);
const network = clusterApiUrl('devnet');
const opts = {
  preflightCommitment: 'processed', // 'finalized'
};

function App() {
  // State
  const [ walletAddress, setWalletAddress ] = useState(null);
  const [ inputValue, setInputValue ] = useState(null);
  const [ gifList, setGifList ] = useState(GIFS);

  console.log('gifList: ', gifList);

  // Hooks
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    }

    window.addEventListener('load', onLoad);

    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching GIF list ...");

      getGifList();
    }
  }, [walletAddress]);

  async function checkIfWalletIsConnected() {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");

          const response = await solana.connect({ onlyIfTrusted: true });

          const publicKey = response.publicKey.toString();

          console.log("Connected with Public Key: ", publicKey);

          setWalletAddress(publicKey);
        }
      }
      else {
        alert("Solana object not found! Get a Phantom Wallet!");
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  async function connectWallet() {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();

      const publicKey = response.publicKey.toString();

      console.log("Connected with Public Key: ", publicKey);

      setWalletAddress(publicKey);
    }
  }

  // Helpers
  function getProvider() {
    // A provider is an authenticated connection to Solana.
    const connection = new Connection(network, opts.preflightCommitment);

    // We pass `window.solana` because we need an authenticated wallet too.
    // You can't communicate with Solana if you don't have an authenticated wallet.
    const provider = new AnchorProvider(connection, window.solana, opts.preflightCommitment);

    return provider;
  }

  async function getGifList() {
    try {
      const provider = getProvider();
      const program = new Program(idl, programId, provider);
      const account = await program.account.baseAccount
        .fetch(baseAccount.publicKey);

      console.log("Got the account: ", account);

      setGifList(account.gifList);
    }
    catch(error) {
      console.log("Error in getGifList: ", error);

      setGifList(null);
    }
  }

  // Handlers
  function handleChangeInput(event) {
    setInputValue(event.target.value);
  }

  async function handleSendGif() {
    if (inputValue.length > 0) {
      console.log("GIF link: ", inputValue);

      try {
        const provider = getProvider();
        const program = new Program(idl, programId, provider);

        await program.rpc.addGif(inputValue, {
          accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
          },
        });

        console.log("GIF successfully sent to program", inputValue);

        await getGifList();

        setInputValue('');
      }
      catch(error) {
        console.error(error);
      }
    }
    else {
      console.log("Empty input. Try again.");
    }
  }

  function handleSubmitGif(event) {
    event.preventDefault();

    handleSendGif();
  }

  // Renderers
  function renderConnectedContainer() {
    if (gifList == null) {
      return (
        <div className="connected-container">
          <button
            className="cta-button submit-gif-button"
            onClick={createGifAccount}
          >
            Do one-time initialization for GIF Program Account
          </button>
        </div>
      );
    }
    else {
      return (
        <div className="connected-container">
          <form onSubmit={handleSubmitGif}>
            <input
              onChange={handleChangeInput}
              placeholder="Enter GIF link!"
              type="text"
              value={inputValue}
            />
            <button className="cta-button submit-gif-button" type="submit">
              Submit
            </button>
          </form>
          <div className="gif-grid">
            { renderGifs(gifList) }
          </div>
        </div>
      );
    }
  }

  function renderGif(item, index) {
    return (
      <div className="gif-item" key={index}>
        <img src={item.gifLink} alt={item.gifLink} />
      </div>
    );
  }

  function renderGifs(gifs) {
    return gifs.map(renderGif);
  }

  function renderNotConnectedContainer() {
    return (
      <button
        className="cta-button connect-wallet-button"
        onClick={connectWallet}
      >
        { CONNECT_WALLET_BUTTON_LABEL }
      </button>
    );
  }

  async function createGifAccount() {
    try {
      const provider = getProvider();
      const program = new Program(idl, programId, provider);

      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [
          baseAccount,
        ],
      });

      console.log("Created a new Base Account w/ address: ", baseAccount.publicKey.toString());

      await getGifList();
    }
    catch(error) {
      console.log("Error creating BaseAccount account: ", error);
    }
  }

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">{ APP_TITLE }</p>
          <p className="sub-text">
            { APP_DESCRIPTION }
          </p>
          { !walletAddress && renderNotConnectedContainer() }
          { walletAddress && renderConnectedContainer() }
        </div>
        <div className="footer-container">
        </div>
      </div>
    </div>
  );
}

export default App;
