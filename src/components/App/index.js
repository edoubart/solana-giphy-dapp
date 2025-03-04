// NPM Packages
import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';

// Custom Modules
import { ConnectWallet } from './../wallet';
import { InitializeGifsAccount } from './../accounts';
import { CreateGif, ListGifs } from './../gifs';
import { checkIfWalletIsConnected, getGifsAccount } from './../../actions';

// Styles
import './index.css';

// Constants
const APP_TITLE = "🖼 GIF Portal";
const APP_DESCRIPTION = "View your GIF collection in the metaverse ✨";

// Buffer
window.Buffer = Buffer;

function App() {
  // State
  const [ walletAddress, setWalletAddress ] = useState(null);
  const [ gifsAccountAddress, setGifsAccountAddress ] = useState(null);
  //const [ gifs, setGifs ] = useState([]);

  // Hooks
  useEffect(() => {
    const onLoad = async () => {
      const publicKey = await checkIfWalletIsConnected();

      setWalletAddress(publicKey);
    }

    window.addEventListener('load', onLoad);

    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      const gifsAccount = getGifsAccount()
      const publicKey = gifsAccount.publicKey.toString();

      console.log('publicKey: ', publicKey);

      setGifsAccountAddress(publicKey);
    }
  }, [ walletAddress ]);

  // Handlers
  function handleConnectWallet(publicKey) {
    setWalletAddress(publicKey);
  }

  function handleInitializeGifsAccount(publicKey) {
    setGifsAccountAddress(publicKey);
  }

  // Renderers
  function renderConnectedContainer() {
    let result;

    if (!gifsAccountAddress) {
      result = (
        <InitializeGifsAccount
          data={{
            gifsAccountAddress,
          }}
          handlers={{
            initializeGifsAccount: handleInitializeGifsAccount,
          }}
        />
      );
    }
    else {
      result = (
        <>
          <CreateGif />
          <div className="gif-grid">
            <ListGifs
              data={{
                walletAddress,
              }}
            />
          </div>
        </>
      );
    }

    return (
      <div className="connected-container">
        { result }
      </div>
    );
  }

  function renderNotConnectedContainer() {
    return (
      <ConnectWallet
        data={{
          walletAddress,
        }}
        handlers={{
          connectWallet: handleConnectWallet,
        }}
      />
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
