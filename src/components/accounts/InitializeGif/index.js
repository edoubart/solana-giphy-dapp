// Constants
const INITIALIZE_GIF_ACCOUNT_BUTTON_LABEL = "Do one-time initialization for GIF Program Account";

function InitializeGifAccount() {
  // Handlers
  function handleCreateGifAccount() {
  }

  return (
    <div className="InitializeGifAccount">
      <button
        className="cta-button submit-gif-button"
        onClick={handleCreateGifAccount}
      >
        { INITIALIZE_GIF_ACCOUNT_BUTTON_LABEL }
      </button>
    </div>
  );
}

export default InitializeGifAccount;
