import React, { useContext} from 'react';
import './Chat.scss'
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import UserList from './UserList';
import { roomContext } from '../../providers/RoomProvider';


const Chat = function(props) {
  const { chatMessages, setChatMessages, socket, to, setTo, msg, setMsg, clearChatInput, room } = useContext(roomContext);
  const users = room.users;
  const send = function() {
    socket.emit('message', {msg, room, to});
    if (to) {
      const chatMessage = `PM to ${to}:${msg}`;
      setChatMessages(prev => [chatMessage, ...prev]);
    };
    clearChatInput();

  };
  
  const chatMessageList = chatMessages.map((messageObj, i) => {
    const { message, username, color, pm } = messageObj;
    return <ChatMessage key={i} message={message} displayName={username} color={color} pm={pm} />;
  });

  const userList = users.map((user, i) => { // Use room users to return the list of people you can PM by clicking the button
    return <UserList key={i} username={user.name} color={user.color} />;
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