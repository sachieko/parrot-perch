import React from "react";

const PrivateMessage = (props) => {
  const { username, color, message, pm } = props;
  return (
    <>
    {pm === 'receive' && (
    <div className='chat-list-item'>
        <span className='chat-username-item'>{`[PM from `}
          <span className='chat-username-item' style={{ color }}>{username}</span>
          {`]:`}
        <span className='message-item'>{message}</span>
        </span>
    </div>
    )}
    {pm === 'send' && (
    <div className='chat-list-item'>
        <span className='chat-username-item'>{`[PM to `}
          <span className='chat-username-item' style={{ color }}>{username}</span>
          {`]:`}
        </span>
        <span className='message-item'>{message}</span>
    </div>
    )}
    </>
  );
};

export default PrivateMessage;