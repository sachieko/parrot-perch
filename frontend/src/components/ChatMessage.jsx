import React from "react";

const  ChatMessage = props => {

  return (
    <div key={props.i}>{props.message}</div>
  );
};

export default ChatMessage;