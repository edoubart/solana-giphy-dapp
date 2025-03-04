// Custom Modules
import { initializeGifsAccount } from './../../../actions';

// Constants
const INITIALIZE_GIFS_ACCOUNT_BUTTON_LABEL = "Do one-time initialization for GIF Program Account";

function InitializeGifsAccount(props) {
  // Handlers
  async function handleInitializeGifsAccount() {
    const publicKey = await initializeGifsAccount();

    props.handlers.initializeGifsAccount(publicKey);
  }

  return (
    <div className="InitializeGifsAccount">
      <button
        className="cta-button submit-gif-button"
        onClick={handleInitializeGifsAccount}
      >
        { INITIALIZE_GIFS_ACCOUNT_BUTTON_LABEL }
      </button>
    </div>
  );
}

export default InitializeGifsAccount;
