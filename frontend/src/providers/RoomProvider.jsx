import { createContext, useState, useEffect } from "react";
import io from "socket.io-client";

export const roomContext = createContext();

export default function RoomProvider(props) {
  const [to, setTo] = useState('');
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  const [socket, setSocket] = useState();
  const [isViewing, setIsViewing] = useState(false);
  const [room, setRoom] = useState({
    name: '',
    channel: '',
    users: []
  });

  useEffect(() => {
    const socket = io();
    setSocket(socket);

    socket.on('connect', () => {
      console.log('connected');
      
    });

    socket.on('serveRoom', (res) => {
      const room = res.room;
      setRoom((oldRoom) => {
        return { ...oldRoom, name: room.name, channel: room.channel, users: room.users };
      });
      const message = `Welcome aboard ${room.users.slice(-1)[0].name}!`; // Get the most recently joined user and welcome them.
      setMessages(prev => [message, ...prev]);
      setIsViewing(true);
    });

    socket.on('system', data => {
      // console.log(data);
      const { message, room } = data
      setRoom((oldRoom) => {
        return { ...oldRoom, name: room.name, channel: room.channel, users: room.users };
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

    return () => socket.disconnect();
  }, []);

  const roomData = { to, setTo, messages, setMessages, msg, setMsg, socket, setSocket, isViewing, setIsViewing, room, setRoom };
  return (
    <roomContext.Provider value={roomData}>
      {props.children}
    </roomContext.Provider>
  );
};