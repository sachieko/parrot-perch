import React from 'react';

const Alert = (props) => {
  const { message, color } = props;
  return (
    <>
    <div className='alert'>
    <span style={{ color }}>{message}</span>
    </div>
    </>
  )
};

export default Alert;