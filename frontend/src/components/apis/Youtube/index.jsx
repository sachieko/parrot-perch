import axios from 'axios';
import he from 'he';
import YoutubePlayer from 'react-youtube';
import { useState } from 'react';

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY
function Youtube() {
  const [player, setPlayer] = useState();
  const [term, setTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [videoId, setVideoId] = useState('');

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

  const printChange = (event) => {
    console.log(event.target);
  }

  const typing = (e) => {
    axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${e.target.value}&key=${API_KEY}`)
      .then((res) => {
        const list = [];
        for (const i of res.data.items) {
          let ply = {}
          ply.id = i.id.videoId;
          ply.thumb = i.snippet.thumbnails.default.url;
          ply.title = he.decode(i.snippet.title, "text/html");
          list.push(ply);
        }
        setSuggestions(list);
      })
      .catch((err) => {
        console.log(err);
      });
    setTerm(e.target.value);
  }

  const displaySuggestions = suggestions.map((r, i) => {
    return (
      <article key={i} onClick={() => setVideoId(r.id)}>
        <img alt='thumbnail' style={{ height: '4em' }} src={r.thumb} />
        {r.title}
      </article>
    )
  })

  return (
    <div>
      <input type='text' value={term} placeholder='Search Youtube' onChange={typing} />
      {displaySuggestions}
      <YoutubePlayer videoId={videoId} opts={opts} onReady={onReady} onStateChange={printChange} />
      <button onClick={seek}>seek</button>
    </div>
  );
}

export default Youtube;