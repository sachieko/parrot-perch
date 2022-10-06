import axios from 'axios';
import he from 'he';
import YoutubePlayer from 'react-youtube';
import { useState } from 'react';
import { roomContext } from '../../../providers/RoomProvider';
import { useContext } from 'react';

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY
function Youtube() {
  const { socket, room, player, setPlayer } = useContext(roomContext);
  const [term, setTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const opts = useState({
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
      mute: 1,
      start: room.youtubeVideo.duration
    }
  })[0];

  const onReady = (event) => {
    console.log('setting player');
    setPlayer(event.target);
    event.target.seekTo(room.youtubeVideo.duration);
    console.log(event.target);
  }

  const seek = (event) => {
    player.seekTo(9);
  }

  const typing = (e) => {
    axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${e.target.value}&key=${API_KEY}`)
      .then((res) => {
        const list = [];
        for (const i of res.data.items) {
          let ply = {};
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

  const enterURL = (e, vid) => {
    const ytvideo = {...room.youtubeVideo }
    ytvideo.channel = vid;
    socket.emit('editRoom', { room: { ...room,  youtubeVideo: ytvideo } });
  }

  const displaySuggestions = suggestions.map((r, i) => {
    return (
      <article key={i} onClick={(e) => enterURL(e, r.id)}>
        <img alt='thumbnail' style={{ height: '4em' }} src={r.thumb} />
        {r.title}
      </article>
    )
  })

  return (
    <div>
      <input type='text' value={term} placeholder='Search Youtube' onChange={typing} />
      {displaySuggestions}
      <YoutubePlayer videoId={room.youtubeVideo.channel} opts={opts} onReady={onReady} />
      <button onClick={seek}>seek</button>
    </div>
  );
}

export default Youtube;