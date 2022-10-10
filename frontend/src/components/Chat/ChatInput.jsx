import React, { useContext } from "react";
import { roomContext } from '../../providers/RoomProvider';

const ChatInput = props => {
  const { to, setTo, msg } = useContext(roomContext);

  const options = props.users.map((user, i) => {
    return <option key={i} className='user-list-item' style={{color: user.color}} value={user.name}>{user.name}</option>
  });
  
  return (
    <div className="chat-input-container">
      <div className="chat-pm">
        <button onClick={() => setTo('')}><i className="fa fa-refresh" aria-hidden="true"></i></button>
        <select onChange={(event) => setTo(event.target.value)} value={to} >
          <option className='user-list-item' value="">Select a friend</option>
          {options}
        </select>
        
      </div>
      <div className="chat-input">
      <input
        onChange={event => props.onChange(event.target.value)}
        value={props.value}
        placeholder="Chat something!"
        autoComplete="off"
        onKeyUp={event => event.key === 'Enter' && props.value ? props.send() : null} id='chat-submit' />
        <button onClick={props.send}>Chat</button>
        {msg.length > 1000 && (
        <span className="warning-text">{`${msg.length}/1000`}</span>
        )}
      </div>
    </div>
  );
};

export default ChatInput;