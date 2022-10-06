import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import io from "socket.io-client";
import useDebounce from "../hooks/useDebounce";

export const roomContext = createContext();

export default function RoomProvider(props) {
  // room and socket state for a client
  const [socket, setSocket] = useState();
  const [room, setRoom] = useState({
    name: '',
    password: '',
    channel: '',
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


  // Chat and Rooms useEffect
  useEffect(() => {
    const socket = io();
    setSocket(socket);

    socket.on('connect', () => {
      console.log('A parrot has perched! 🦜');
    });

    socket.on('serveRoom', (res) => {
      const room = res.room;
      setRoom((oldRoom) => {
        // Possibly store hashed user identifier in local storage?
        return { ...oldRoom, name: room.name, channel: room.channel, users: room.users };
      });
      const message = res.message;
      if (message) {
        setChatMessages(prev => [message, ...prev]);
      }
      setIsViewing(true);
    });

    socket.on('system', data => {
      // console.log(data);
      const room = data.room
      setRoom((oldRoom) => {
        return { ...oldRoom, name: room.name, channel: room.channel, users: room.users };
      });
      const message = { username: 'System', message: data.message, color: data.color }
      setChatMessages(prev => [message, ...prev]);
    });

    socket.on('public', data => {
      const message = { username: data.username, color: data.color, message: data.msg};
      setChatMessages(prev => [message, ...prev]); // Keeps all messages in history right now
    });

    socket.on('private', data => {
      const message = { username: data.username, color: data.color, message: data.msg, pm: data.pm };
      setChatMessages(prev => [message, ...prev]); // Same as public. 
    });

    return () => socket.disconnect();
  }, []);

  // API use
  useEffect(() => {
    let token = '';
    if (newChannel === '') {
      setSearchResults([])
      return;
    }
    const searchURL = `https://api.twitch.tv/helix/search/channels?query=${newChannel}&live_only=true`;
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
      })
      .then(response => {
        axios.get(searchURL, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Client-Id': process.env.REACT_APP_CLIENT_ID
          }
        })
          .then(response => {
            setSearchResults([...response.data.data])
            // console.log(results);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  }, [newChannel]);

  const term = useDebounce(newChannel, 200);

  // eslint-disable-next-line
  const onSearch = useCallback(setNewChannel, [term]);

  // on search use effect
  useEffect(() => {
    onSearch(term);
    setNewChannel(term);
  }, [term, onSearch]);


  // Export any usable state or state setters (or custom functions to set state) by declaring them here.
  const roomData = { 
    to, setTo, 
    chatMessages, setChatMessages, 
    msg, setMsg, 
    socket, setSocket, 
    isViewing, setIsViewing, 
    room, setRoom,
    newChannel, setNewChannel,
    searchResults, setSearchResults,
    searchValue, setSearchValue
   };

  return (
    <roomContext.Provider value={roomData}>
      {props.children}
    </roomContext.Provider>
  );
};