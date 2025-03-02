// NPM Packages
import { useEffect, useState } from 'react';

// Styles
import './index.css';

// Constants
const APP_TITLE = "🖼 GIF Portal";
const APP_DESCRIPTION = "View your GIF collection in the metaverse ✨";
const CONNECT_WALLET_BUTTON_LABEL = "Connect to Wallet";

function App() {
  // State
  const [ walletAddress, setWalletAddress ] = useState(null);

  // Hooks
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    }

    window.addEventListener('load', onLoad);

    return () => window.removeEventListener('load', onLoad);
  }, []);

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

  // Renderers
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
        </div>
        <div className="footer-container">
        </div>
      </div>
    </div>
  );
}

export default App;
