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
    clearChatInput();

  };
  
  const chatMessageList = chatMessages.map((messageObj, i) => {
    const { username, color, message, pm, system } = messageObj;
    return <ChatMessage key={i} message={message} username={username} color={color} pm={pm} system={system} />;
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