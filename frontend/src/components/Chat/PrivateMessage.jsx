import React from "react";

const PrivateMessage = (props) => {
  const { username, color, message, pm } = props;
  console.log(props);
  return (
    <>
    {pm === 'receive' && (
    <div className='chat-list-item'>
        <span className='message-item'>[PM from </span>
        <span className='chat-username-item' style={{ color }}>{username}</span>
        <span className='message-item'>]: {message}</span>
    </div>
    )}
    {pm === 'send' && (
    <div className='chat-list-item'>
        <span className='message-item'>[PM to </span>
        <span className='chat-username-item' style={{ color }}>{username}</span>
        <span className='message-item'>]: {message}</span>
    </div>
    )}
    </>
  );
};

export default PrivateMessage;