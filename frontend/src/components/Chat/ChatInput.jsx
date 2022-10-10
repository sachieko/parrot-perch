import React, { useContext } from "react";
import { roomContext } from '../../providers/RoomProvider';

const ChatInput = props => {
  const { to, setTo } = useContext(roomContext);

  const options = props.users.map(user => {
    return <option className='user-list-item' style={{color: user.color}} value={user.name}>{user.name}</option>
  });
  
  return (
    <div className="chat-input">
      <input
        onChange={event => props.onChange(event.target.value)}
        value={props.value}
        placeholder="Chat something!"
        onKeyUp={event => event.key === 'Enter' && props.value ? props.send() : null} id='chat-submit' />
      <div className="chat-pm">
        <button onClick={() => setTo('')}>Reset PM</button>
        <select onChange={(event) => setTo(event.target.value)} value={to} >
          <option className='user-list-item' value="">Select a friend</option>
          {options}
        </select>
        <button onClick={props.send}>Chat</button>
      </div>
    </div>
  );
};

export default ChatInput;