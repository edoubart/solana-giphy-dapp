// NPM Packages
import { useState } from 'react';

// Custom Modules
import { createGif } from './../../../actions.js';

// Styles
import './index.css';

// Constants
const CREATE_GIF_BUTTON_LABEL = "Submit";
const CREATE_GIF_FIELD_URL_PLACEHOLDER = "Enter GIF link!";
const CREATE_GIF_FIELD_URL_TYPE = 'text';

function CreateGif() {
  // State
  const [ gif, setGif ] = useState({
    url: null,
  });

  // Handlers
  function handleChangeUrl(event) {
    const url = event.target.value;

    setGif({
      ...gif,
      url,
    });
  }

  function handleSubmitGif(event) {
    event.preventDefault();

    createGif(gif);
  }

  // Renderers
  function renderForm() {
    return (
      <form onSubmit={handleSubmitGif}>
        <input
          onChange={handleChangeUrl}
          placeholder={CREATE_GIF_FIELD_URL_PLACEHOLDER}
          type={CREATE_GIF_FIELD_URL_TYPE}
          value={gif.url || ''}
        />
        <button className="cta-button submit-gif-button" type="submit">
          { CREATE_GIF_BUTTON_LABEL }
        </button>
      </form>
    );
  }

  return (
    <div className="CreateGif">
      { renderForm() }
    </div>
  );
}

export default CreateGif;
