import React from "react";

const PublicMessage = (props) => {
  const { username, color, message } = props;
  return (
    <div className='chat-list-item'>
      <span>
        <span className='chat-username-item' style={{ color }}>{username}</span>
        {`: `}
      </span>
        <span className='message-item'>{message}</span>
    </div>
  );
};

export default PublicMessage;