import React from 'react';

const  SystemMessage = props => {
  const { username, color, system } = props;
  return (
    <>
      {system === 'welcome' && ( 
      <div className='chat-list-item'>
        <span className='message-item'>{`🦜 Welcome aboard `} 
        <span className='chat-username-item' style={{ color }}>{username}</span>
        </span>
      </div>
      )}
      {system === 'announce' && ( 
      <div className='chat-list-item'>
        <span className='message-item'>{`🦜 Arr, ye've been boarded by `}
        <span className='chat-username-item' style={{ color }}>{username}</span>
        </span>
      </div>
      )}
      {system === 'exit' && ( 
      <div className='chat-list-item'>
        <span className='message-item'>🌊
        <span className='chat-username-item' style={{ color }}>{username}</span>
        <span className='message-item'>{` has walked the plank!`}</span>
        </span>
      </div>
      )}
      {system === 'hostSwap' && ( 
      <div className='chat-list-item'>
        <span className='message-item'>🚢🏴‍☠️ 
        <span className='chat-username-item' style={{ color }}>{username}</span>
        <span className='message-item'>{` is the Captain now!`}</span>
        </span>
      </div>
      )}
      {system === 'left' && ( 
      <div className='chat-list-item'>
        <span className='message-item'>☠️
        <span className='chat-username-item' style={{ color }}>{username}</span>
        <span className='message-item'>{` is swimming with the sharks!`}</span>
        </span>
      </div>
      )}
    </>
  );
};

export default SystemMessage;