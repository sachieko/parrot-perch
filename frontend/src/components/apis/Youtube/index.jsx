import axios from 'axios';
import he from 'he';
import YoutubePlayer from 'react-youtube';
import { useState, useContext, useEffect } from 'react';
import { roomContext } from '../../../providers/RoomProvider';
import useDebounce from '../../../hooks/useDebounce';
import Result from './Result';

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
    axios.get('/api/youtube_search', {
      params: {
        terms: terms
      }
    })
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

  const displaySuggestions = suggestions.map((suggestion, i) => {
    const { id, thumb, title } = suggestion;
    return (
      <Result key={i} id={id} thumb={thumb} title={title} onClick={enterURL} />
    )
  });

  return (
    <div className='widget youtube-widget'>
      <div className='search'>
        <form className='search__form' onSubmit={e => e.preventDefault()}>
          <input className='radius' type='text' value={term} placeholder='Search Youtube' onChange={(e) => setTerm(e.target.value)} />
        </form>
      </div>
      {displaySuggestions}

      <YoutubePlayer
        videoId={room.youtubeVideo.channel}
        opts={opts}
        onReady={onReady}
        onStateChange={emitStateChange}
        style={{ display: room.youtubeVideo.channel ? 'block' : 'none' }}
      />
    </div>
  );
}

export default Youtube;