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
      setIsViewing(true);
    });

    socket.on('system', data => {
      // console.log(data);
      setMessages(prev => [data.message, ...prev]);
    });

    socket.on('public', data => {
      const message = `${data.username}: ${data.msg}`;
      setMessages(prev => [message, ...prev]); // Keeps all messages in history right now
    });

    socket.on('private', data => {
      const message = `PM from ${data.username}: ${data.msg}`;
      setMessages(prev => [message, ...prev]); // Same as public. DRY later
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