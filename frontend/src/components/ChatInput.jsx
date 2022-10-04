import React from "react";

const  ChatInput = props => {

  return (
  <div className="text-input">
        <input 
          onChange={event => props.onChange(event.target.value)}
          value={props.value}
          placeholder="Chat something!" 
          onKeyUp={event => event.key === 'Enter' ? props.send() : null} id='chat-input'/>
        <button onClick={props.send}>Send</button>
        <button onClick={() => props.clear([])}>Clear Chat</button>
  </div>
  );
};

export default ChatInput;