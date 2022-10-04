import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import './Chat.scss'
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';


const Chat = function(props) {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState();
  const [msg, setMsg] = useState('');
  const [to, setTo] = useState('');
  const [users, setUsers] = useState({});

  useEffect(() => {
    const socket = io();
    setSocket(socket);

    socket.on('connect', () => {
      console.log('Connected.');
    });

    socket.on('system', data => {
      // console.log(data);
      setMessages(prev => [data.message, ...prev]);
      setUsers(data.roomUsers);
    });

    socket.on('public', data => {
      const message = `${data.username}: ${data.msg}`;
      setMessages(prev => [message, ...prev]); // Change this socket event for keeping only X amount of messages in history. Right now it keeps all.
    });

    socket.on('private', data => {
      const message = `PM from ${data.username}: ${data.msg}`;
      setMessages(prev => [message, ...prev]); // Same as public. DRY later
    });

    socket.on('serveRoom', data => {
      setUsers(data.users);
    });

    return () => socket.disconnect();
  }, []);

  const send = function() {
    socket.emit('message', {msg, to});
    if (to) {
      const message = `PM to ${to}:${msg}`;
      setMessages(prev => [message, ...prev]);
    };
    setMsg('');
  };

  const messageList = messages.map((message, i) => {
    return <ChatMessage index={i} message={message} color={'no color set'}/>;
  });

  return (
    <section className="chat">
      <div className="chat-pm">
        <input 
          onChange={event => setTo(event.target.value)}
          value={to}
          placeholder="Username" />
      </div>
      <ChatInput onChange={setMsg} value={msg} send={send} clear={setMessages} />
      <div id='message-list'> 
        {messageList}
      </div>
    </section>
  );
};



export default Chat;