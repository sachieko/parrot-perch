import YoutubePlayer from 'react-youtube';
import { useState } from 'react';

function Youtube() {
  const [player, setPlayer] = useState();

  const opts = useState({
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
      mute: 1,
      start: 0
    }
  })[0];

  const onReady = (event) => {
    setPlayer(event.target);
  }

  const seek = (event) => {
    player.seekTo(9);
  }

  return (
    <div>
      <YoutubePlayer videoId="2g811Eo7K8U" opts={opts} onReady={onReady} />
      <button onClick={seek}>seek</button>
    </div>
  );
}

export default Youtube;