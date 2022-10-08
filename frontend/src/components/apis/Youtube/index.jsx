import axios from 'axios';
import he from 'he';
import YoutubePlayer from 'react-youtube';
import { useState } from 'react';
import { roomContext } from '../../../providers/RoomProvider';
import { useContext } from 'react';
import { useEffect } from 'react';
import useDebounce from '../../../hooks/useDebounce';

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY

function Youtube() {
  const { socket, room, setPlayer } = useContext(roomContext);
  const [term, setTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const terms = useDebounce(term, 500);
  const opts = useState({
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
      mute: 1
    }
  })[0];

  const onReady = (event) => {
    setPlayer(event.target);
    if (room.youtubeVideo.channel) {
      event.target.seekTo(room.youtubeVideo.duration);
    }
  }

  const emitStateChange = (e) => {
    const state = e.target.getPlayerState();
    if (state !== 1 && state !== 2 && state !== 3) {
      return;
    }
    const currentTime = e.target.getCurrentTime();
    const changedRoom = {
      ...room,
      youtubeVideo: {
        ...room.youtubeVideo,
        duration: currentTime,
        state: state
      }
    }
    if (state === 1) {
      socket.emit('editVideo', { room: changedRoom });
    }
  }

  useEffect(() => {
    if (terms === '') {
      setSuggestions([])
      return;
    }
    axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${terms}&key=${API_KEY}`)
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
  }, [terms])

  const enterURL = (e, vid) => {
    const ytvideo = { ...room.youtubeVideo }
    ytvideo.channel = vid;
    socket.emit('editRoom', { room: { ...room, youtubeVideo: ytvideo } });
    setSuggestions([]);
    setTerm('');
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
      <div className='search'>
        <form  className='search__form' onSubmit={e => e.preventDefault()}>
          <input className='radius' type='text' value={term} placeholder='Search Youtube' onChange={(e) => setTerm(e.target.value)} />
        </form>
      </div>
      {displaySuggestions}
      { room.youtubeVideo && room.youtubeVideo.channel && ( 
        <YoutubePlayer
          videoId={room.youtubeVideo.channel}
          opts={opts}
          onReady={onReady}
          onStateChange={emitStateChange} />
       )}
    </div>
  );
}

export default Youtube;