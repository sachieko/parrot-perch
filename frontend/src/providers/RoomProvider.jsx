import { createContext, useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import useDebounce from "../hooks/useDebounce";

export const roomContext = createContext();

export default function RoomProvider(props) {
  // room and socket state for a client
  const [socket, setSocket] = useState();
  const [room, setRoom] = useState({
    name: '',
    host: '',
    password: '',
    channel: '',
    youtubeVideo: {
      channel: '',
      duration: 0,
      state: 2 // 1 => play, 2 => pause, 3 => buffer 
    },
    users: []
  });
  const [isViewing, setIsViewing] = useState(false);
  // Chat only state
  const [to, setTo] = useState('');
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  // Channel changing state
  const [newChannel, setNewChannel] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  //youtube changing state
  const [player, setPlayer] = useState();

  // term is state
  const term = useDebounce(newChannel, 500);

  // Chat and Rooms useEffect
  useEffect(() => {
    const socket = io();
    setSocket(socket);

    socket.on('connect', () => {
      console.log('connected');

    });

    socket.on('serveRoom', (res) => {
      const room = res.room;
      setRoom((oldRoom) => {
        return {
          ...oldRoom,
          name: room.name,
          host: room.host,
          channel: room.channel,
          youtubeVideo: {
            channel: room.youtubeVideo.channel,
            duration: room.youtubeVideo.duration,
            state: room.youtubeVideo.state
          },
          users: room.users
        };
      });
      const message = res.message;
      if (message) {
        setMessages(prev => [message, ...prev]);
      }
      setIsViewing(true);
    });

    socket.on('system', data => {
      // console.log(data);
      const { message, room } = data
      setRoom((oldRoom) => {
        return { ...oldRoom, name: room.name, channel: room.channel, users: room.users, host: room.host };
      });
      setMessages(prev => [message, ...prev]);
    });

    socket.on('public', data => {
      const message = `${data.username}: ${data.msg}`;
      setMessages(prev => [message, ...prev]); // Keeps all messages in history right now
    });

    socket.on('private', data => {
      const message = `PM from ${data.username}: ${data.msg}`;
      setMessages(prev => [message, ...prev]); // Same as public. 
    });

    socket.on('setJoinerYoutubeTime', (res) => {
      setRoom((oldRoom) => {
        return {
          ...oldRoom,
          youtubeVideo: {
            ...oldRoom.youtubeVideo,
            duration: res.time
          }
        }
      });
    });

    socket.on('getHostYoutubeTime', (res) => {
      setPlayer(oldPlayer => {
        if (oldPlayer) {
          res.time = oldPlayer.getCurrentTime();
          socket.emit('sendJoinerYoutubeTime', res);
        }
        return oldPlayer;
      });
    });

    socket.on('serveVideo', (res) => {
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
    })

    return () => socket.disconnect();
  }, []);


  // API use
  useEffect(() => {
    let token = '';
    if (term === '') {
      setSearchResults([])
      return;
    }
    const searchURL = `https://api.twitch.tv/helix/search/channels?query=${term}&live_only=true`;
    axios.post('https://id.twitch.tv/oauth2/token', {
      client_id: process.env.REACT_APP_CLIENT_ID,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
      grant_type: process.env.REACT_APP_GRANT_TYPE
    })
      .then(response => {
        token = response.data.access_token

        axios.get('https://id.twitch.tv/oauth2/validate', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        return axios.get(searchURL, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Client-Id': process.env.REACT_APP_CLIENT_ID
          }
        })

      })
      .then(response => {
        setSearchResults([...response.data.data])
      })
      .catch((e) => {
        console.log(e);
      });
  }, [term]);

  // Export any usable state or state setters (or custom functions to set state) by declaring them here.
  const roomData = {
    to, setTo,
    messages, setMessages,
    msg, setMsg,
    socket, setSocket,
    isViewing, setIsViewing,
    room, setRoom,
    newChannel, setNewChannel,
    searchResults, setSearchResults,
    searchValue, setSearchValue,
    player, setPlayer
  };

  return (
    <roomContext.Provider value={roomData}>
      {props.children}
    </roomContext.Provider>
  );
};