import React from 'react';

const UserList = function(props) {
  const { username, color } = props;
  return (
    <div className='user-list-item'>
      <button style={{ color }}>{username}</button>
    </div>
  );
};

export default UserList;