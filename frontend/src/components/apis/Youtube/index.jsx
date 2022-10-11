import axios from 'axios';
import he from 'he';
import YoutubePlayer from 'react-youtube';
import { useState, useContext, useEffect } from 'react';
import { roomContext } from '../../../providers/RoomProvider';
import useDebounce from '../../../hooks/useDebounce';
import Result from './Result';
import './Youtube.scss';

function Youtube() {
  const { socket, room } = useContext(roomContext);
  const [term, setTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const terms = useDebounce(term, 500);
  const [player, setPlayer] = useState();
  const opts = {
    height: '600',
    width: '100%',
    playerVars: {
      autoplay: 1,
      mute: 1
    }
  };

  const onReady = (event) => {
    setPlayer(event.target);
    socket.emit('retrieveHostYoutubeTime', {room: room})
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
    if (!socket) {
      return;
    }

    socket.on('getHostYoutubeTime', (res) => {
      console.log('here');
      console.log(player);
      if (player) {
        console.log(player);
        res.time = player.getCurrentTime();
        console.log('time', res.time);
        socket.emit('sendJoinerYoutubeTime', res);
      }
    });

    socket.on('setJoinerYoutubeTime', (res) => {
      console.log('here', player, res.time);
      if (player) {
        player.seekTo(res.time);
      }
    });

    /*socket.on('serveVideo', (res) => {
      const room = res.room;
      setPlayer(oldPlayer => {
        if (oldPlayer) {
          const s = oldPlayer.getPlayerState();
          if (s === 1 || s === 2 || s === 3) {
            const state = room.youtubeVideo.state;
            if (state === 1) {
              oldPlayer.seekTo(room.youtubeVideo.duration);
            }
            if (state === 2 || state === 3) {
              oldPlayer.seekTo(room.youtubeVideo.duration);
              oldPlayer.pauseVideo();
            }
          }
          return oldPlayer;
        }
      });
    });*/

    return () => {
      socket.off('setJoinerYoutubeTime');
      socket.off('getHostYoutubeTime');
      socket.off('serveVideo');
    }
  }, [socket, player])

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
        {suggestions.length > 0 && term && (
          <div className='youtube-results'>
            {displaySuggestions}
          </div>
        )}
      </div>
      <YoutubePlayer
        videoId={room.youtubeVideo.channel}
        opts={opts}
        onReady={onReady}
        onStateChange={emitStateChange}
        className='youtube-video'
        style={{ display: room.youtubeVideo.channel ? 'block' : 'none' }}
      />
    </div>
  );
}

export default Youtube;