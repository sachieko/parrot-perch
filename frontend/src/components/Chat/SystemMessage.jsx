import React from 'react';

const  SystemMessage = props => {
  const { username, color, system } = props;
  return (
    <>
      {system === 'welcome' && ( 
      <div className='chat-list-item'>
        <span className='message-item'>🦜 Welcome aboard </span>
        <span className='chat-username-item' style={{ color }}>{username}</span>
      </div>
      )}
      {system === 'announce' && ( 
      <div className='chat-list-item'>
        <span className='message-item'>🦜 Arr, ye've been boarded by </span>
        <span className='chat-username-item' style={{ color }}>{username}</span>
      </div>
      )}
      {system === 'exit' && ( 
      <div className='chat-list-item'>
        <span className='message-item'>🌊 </span>
        <span className='chat-username-item' style={{ color }}>{username}</span>
        <span className='message-item'> has walked the plank!</span>
      </div>
      )}
    </>
  );
};

export default SystemMessage;