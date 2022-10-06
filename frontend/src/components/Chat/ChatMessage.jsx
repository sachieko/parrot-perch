import React from 'react';
import SystemMessage from './SystemMessage';
import PrivateMessage from './PrivateMessage';
import PublicMessage from './PublicMessage';

const  ChatMessage = props => {
  const { username, color, message, pm, system } = props;
  console.log(props);
  return (
    <>
      {system && ( 
      <SystemMessage username={username} system={system} color={color} />
      )}
      {pm && ( 
      <PrivateMessage username={username} color={color} message={message} pm={pm} />
      )}
      {!pm && !system && ( 
      <PublicMessage username={username} color={color} message={message} />
      )}
    </>
  );
};

export default ChatMessage;