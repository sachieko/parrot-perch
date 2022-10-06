import React from 'react';

const  ChatMessage = props => {
  const { username, color, message, pm } = props;

  return (
    <>
     {!pm && ( 
      <div className='chat-list-item'>
      <span className='chat-username-item' style={`color:${color}`}>{username}</span>
      <span className='message-item'>{message}</span>
    </div>
      )}
     {pm && ( 
      <div className='chat-list-item'>
      <span className='chat-username-item' style={`color:${color}`}>[PM From {username}]</span>
      <span className='message-item'>: {message}</span>
    </div>
      )}
    </>
  );
};

export default ChatMessage;