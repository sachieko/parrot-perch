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
    paths: [],
    youtubeVideo: {
      channel: '',
      duration: 0,
      state: 2 // 1 => play, 2 => pause, 3 => buffer 
    },
    users: []
  });
  const [isViewing, setIsViewing] = useState(false);
  // Chat only state
  const [to, setTo] = useState(''); // This is the state of who a user is sending a PM to.
  const [chatMessages, setChatMessages] = useState([]); // These messages are displayed on the chat window
  const [msg, setMsg] = useState(''); // This is the message before it's sent to our server
  // Channel changing state
  const [newChannel, setNewChannel] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  //youtube changing state
  const [player, setPlayer] = useState();
  const [incomingPath, setIncomingPath] = useState([]);

  // term is state
  const term = useDebounce(newChannel, 500);

  // Chat and Rooms useEffect with sockets
  useEffect(() => {
    const socket = io();
    setSocket(socket);

    socket.on('connect', () => {
      console.log('A parrot has perched! 🦜');
    });

    socket.on('serveRoom', (res) => {
      const room = res.room;
      setRoom((oldRoom) => {
        return {
          ...oldRoom,
          name: room.name,
          host: room.host,
          channel: room.channel,
          paths: room.paths,
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
        setChatMessages(prev => [message, ...prev]);
      }
      setIsViewing(true);
    });

    socket.on('system', data => {
      const { room, username, color, system } = data;
      setRoom((oldRoom) => {
        return { ...oldRoom, name: room.name, channel: room.channel, users: room.users, host: room.host };
      });
      const chatMessage = { username, color, system };
      setChatMessages(prev => [chatMessage, ...prev]);
    });

    socket.on('public', data => {
      const { username, color, message } = data;
      const chatMessage = { username, color, message };
      setChatMessages(prev => [chatMessage, ...prev]); // Keeps all messages in history right now
    });

    socket.on('private', data => {
      const { username, color, message, pm } = data;
      const chatMessage = { username, color, message, pm };
      setChatMessages(prev => [chatMessage, ...prev]); // Same as public. 
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

    socket.on('broadcastPath', (res) => {
      setIncomingPath(res.path);
    });

    return () => socket.disconnect();
  }, []);

  // Chat Functions
  const clearChatInput = () => {
    setMsg('');
  };

  // API use
  useEffect(() => {
    if (term === '') {
      setSearchResults([])
      return;
    }
    axios.get('/api/twitch_search', {
      params: {
        term: term
      }
    })
      .then(response => {
        setSearchResults([...response.data.data])
      })
  }, [term]);

  // Export any usable state or state setters (or custom functions to set state) by declaring them here.
  const roomData = { 
    to, setTo, // user to send a direct message to
    chatMessages, setChatMessages, // Chat messages that are showing for a user in the chat
    msg, setMsg, clearChatInput, // The message a user types in before sending
    socket, setSocket, // The socket their connection is on
    isViewing, setIsViewing, // Whether they are viewing a channel or not
    room, setRoom, // Which room the user is in, including userlist
    newChannel, setNewChannel, // When a user sets a channel for twitch
    searchResults, setSearchResults, // Results from the user's channel search
    searchValue, setSearchValue, // The term of the user's search value
    player, setPlayer, // Used to manage player for youtube API
    incomingPath, setIncomingPath // Manages the whiteboard app
   };

  return (
    <roomContext.Provider value={roomData}>
      {props.children}
    </roomContext.Provider>
  );
};