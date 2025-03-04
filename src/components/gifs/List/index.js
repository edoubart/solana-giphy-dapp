// NPM Packages
import { useEffect, useState } from 'react';

// Custom Modules
import { listGifs } from './../../../actions';

// Styles
import './index.css';

function ListGifs(props) {
  // State
  const [ gifs, setGifs ] = useState(null);

  // Hooks
  useEffect(() => {
    async function fetchData() {
      if (props && props.data && props.data.walletAddress) {
        const gifs = await listGifs();

        setGifs([ ...new Set(gifs) ]);
      }
    }

    fetchData();
  }, [ props, props.data.walletAddress ]);

  // Renderers
  function renderGif(gif, index) {
    return (
      <div className="gif-gif" key={index}>
        <img src={gif.url} alt={gif.url} />
      </div>
    );
  }

  function renderGifs(gifs) {
    return gifs.map(renderGif);
  }

  return (
    <div className="ListGifs">
      { gifs && renderGifs(gifs) }
    </div>
  );
}

export default ListGifs;
