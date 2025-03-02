// NPM Packages
import { useEffect, useState } from 'react';

// Styles
import './index.css';

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

      setGifList(GIFS);
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

  // Handlers
  function handleChangeInput(event) {
    setInputValue(event.target.value);
  }

  async function handleSendGif() {
    if (inputValue.length > 0) {
      console.log("GIF link: ", inputValue);

      setGifList([ ...gifList, inputValue ]);
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

  function renderGif(gif) {
    return (
      <div className="gif-item" key={gif}>
        <img src={gif} alt={gif} />
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
