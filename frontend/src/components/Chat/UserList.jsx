import React from 'react';

const UserList = function(props) {
  return (
    <div className='user-list-item'>
      <button style={`color:${props.color}`}>{props.username}</button>
    </div>
  );
};

export default UserList;