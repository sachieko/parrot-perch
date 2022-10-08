import React, { useContext } from "react";
import { roomContext } from '../../providers/RoomProvider';

const  ChatInput = props => {
  const { to, setTo } = useContext(roomContext);
  return (
  <div className="chat-input">
        <input 
          onChange={event => props.onChange(event.target.value)}
          value={props.value}
          placeholder="Chat something!" 
          onKeyUp={event => event.key === 'Enter' && props.value ? props.send() : null} id='chat-submit'/>
        <div className="chat-pm">
        <input 
          onChange={event => setTo(event.target.value)}
          value={to}
          placeholder="Username" />
          <button onClick={props.send}>Chat</button>
          <button onClick={() => props.clear([])}>Clear Chat</button>
        </div>
  </div>
  );
};

export default ChatInput;