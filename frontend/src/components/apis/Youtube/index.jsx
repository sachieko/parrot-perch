import axios from 'axios';
import he from 'he';
import YoutubePlayer from 'react-youtube';
import { useState, useContext, useEffect } from 'react';
import { roomContext } from '../../../providers/RoomProvider';
import useDebounce from '../../../hooks/useDebounce';
import Result from './Result';
import './Youtube.scss';
import { useRef } from 'react';

function Youtube(props) {
  const { socket, room } = useContext(roomContext);
  const [term, setTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const terms = useDebounce(term, 500);
  const playRef = useRef(null);
  const opts = {
    height: '600',
    playerVars: {
      autoplay: 1,
      mute: 1,
      origin: 'http://localhost:3000'
    }
  };

  const onReady = (event) => {
    if (room.youtubeVideo.channel) {
      socket.emit('retrieveHostYoutubeTime', { room: room });
    }
  }

  const emitStateChange = (e) => {
    const state = e.target.getPlayerState();
    const currentTime = e.target.getCurrentTime();
    socket.emit('editVideo', { room: room, time: currentTime, state: state });
  }

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('getHostYoutubeTime', (res) => {
      playRef.current.internalPlayer.getCurrentTime()
        .then(time => {
          res.time = time;
          socket.emit('sendJoinerYoutubeTime', res);
        })
        .catch(e => {
          console.log(e);
        });
    });
    socket.on('setJoinerYoutubeTime', (res) => {
      playRef.current.internalPlayer.seekTo(res.time);
    });
    socket.on('serveVideo', (res) => {
      playRef.current.internalPlayer.seekTo(res.time);
      if (res.state === 1) {
        playRef.current.internalPlayer.playVideo();
      }
      if (res.state === 2 || res.state === 3) {
        playRef.current.internalPlayer.pauseVideo();
      }
    });
  }, [socket]);

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

  if (!props.selected && playRef.current) {
    playRef.current.internalPlayer.mute();
  }

  return (
    <div className='youtube-widget' style={{ display: props.selected ? 'flex' : 'none' }}>
      <div className='youtube-search' >
        <form className='search__form' onSubmit={e => e.preventDefault()}>
          <input className='radius' type='text' value={term} placeholder='Search Youtube' onChange={(e) => setTerm(e.target.value)} />
        </form>
        {suggestions.length > 0 && term && (
          <div className='youtube-results'>
            {displaySuggestions}
          </div>
        )}
      </div>
      <YoutubePlayer
        videoId={room.youtubeVideo.channel}
        opts={opts}
        ref={playRef}
        onReady={onReady}
        onStateChange={emitStateChange}
        className='youtube-video'
        style={{ display: room.youtubeVideo.channel && props.selected ? 'flex' : 'none' }}
      />
    </div>
  );
}

export default Youtube;