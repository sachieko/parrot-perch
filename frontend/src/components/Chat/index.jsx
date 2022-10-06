import React, { useContext} from 'react';
import './Chat.scss'
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { roomContext } from '../../providers/RoomProvider';


const Chat = function(props) {
  const { chatMessages, setChatMessages, socket, to, setTo, msg, setMsg, room } = useContext(roomContext);
  const users = room.users;
  const send = function() {
    socket.emit('message', {msg, room, to});
    if (to) {
      const message = `PM to ${to}:${msg}`;
      setChatMessages(prev => [message, ...prev]);
    };

    setMsg('');
  };
  
  const chatMessageList = chatMessages.map((message, i) => {
    return <ChatMessage key={i} message={message} user={'no user set'}/>;
  });

  const userList = users.map((user, i) => {
    return <li key={i}>{user.name}</li>;
  });

  return (
    <section className="chat">
      <div className="chat-pm">
        <input 
          onChange={event => setTo(event.target.value)}
          value={to}
          placeholder="Username" />
      </div>
      <ChatInput onChange={setMsg} value={msg} send={send} clear={setChatMessages} />
      <div id='message-list'> 
        {chatMessageList}
      </div>
      <ul>
        {userList}
      </ul>
    </section>
  );
};

export default Chat;