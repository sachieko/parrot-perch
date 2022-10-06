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
      const { room, message, color } = data;
      setRoom((oldRoom) => {
        return { ...oldRoom, name: room.name, channel: room.channel, users: room.users };
      });
      const chatMessage = { username: 'System', message, color };
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

    return () => socket.disconnect();
  }, []);

  // Chat Functions
  const clearChatInput = () => {
    setMsg('');
  };

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
    to, setTo, // user to send a direct message to
    chatMessages, setChatMessages, // Chat messages that are showing for a user in the chat
    msg, setMsg, clearChatInput, // The message a user types in before sending
    socket, setSocket, // The socket their connection is on
    isViewing, setIsViewing, // Whether they are viewing a channel or not
    room, setRoom, // Which room the user is in, including userlist
    newChannel, setNewChannel, // When a user sets a channel
    searchResults, setSearchResults, // Results from the user's channel search
    searchValue, setSearchValue // The term of the user's search value
   };

  return (
    <roomContext.Provider value={roomData}>
      {props.children}
    </roomContext.Provider>
  );
};