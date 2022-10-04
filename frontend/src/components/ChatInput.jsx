import React from "react";
import './ChatInput.scss';

const  ChatInput = props => {

  return (
  <div className="chat-input">
        <input 
          onChange={event => props.onChange(event.target.value)}
          value={props.value}
          placeholder="Chat something!" 
          onKeyUp={event => event.key === 'Enter' && props.value ? props.send() : null} id='chat-submit'/>
        <button onClick={props.send}>Send</button>
        <button onClick={() => props.clear([])}>Clear Chat</button>
  </div>
  );
};

export default ChatInput;