// Custom Modules
import { connectWallet } from './../../../actions';

// Styles
import './index.css';

// Constants
const CONNECT_WALLET_BUTTON_LABEL = "Connect to Wallet";

function ConnectWallet(props) {
  // Handlers
  async function handleConnectWallet() {
    const publicKey = await connectWallet();

    props.handlers.connectWallet(publicKey);
  }

  return (
    <div className="ConnectWallet">
      <button
        className="cta-button connect-wallet-button"
        onClick={handleConnectWallet}
      >
        { CONNECT_WALLET_BUTTON_LABEL }
      </button>
    </div>
  );
}

export default ConnectWallet;
