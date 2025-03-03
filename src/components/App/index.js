// NPM Packages
import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';

// Custom Modules
import { ConnectWallet } from './../wallet';
import { InitializeGifAccount } from './../accounts';
import { CreateGif, ListGifs } from './../gifs';
import { checkIfWalletIsConnected } from './../../actions';

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
  const [ baseAccountAddress, setBaseAccountAddress ] = useState(null);
  const [ gifList, setGifList ] = useState([]);

  // Hooks
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    }

    window.addEventListener('load', onLoad);

    return () => window.removeEventListener('load', onLoad);
  }, []);

  //useEffect(() => {
  //  if (walletAddress) {
  //    //fetchBaseAccountAddress();

  //    //getGifList();
  //  }
  //}, [ walletAddress ]);

  // Handlers
  function handleConnectWallet(publicKey) {
    setWalletAddress(publicKey);
  }

  // Renderers
  function renderConnectedContainer() {
    let result;

    if (gifList == null) {
      result = (
        <InitializeGifAccount />
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
