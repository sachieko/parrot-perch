import { useContext } from 'react';
import './Room.scss';
import Join from './JoinRoom';
import View from './ViewRoom';
import { roomContext } from '../providers/RoomProvider';

function Room() {
  const { room, setRoom, isViewing, socket, alert, clearAlert } = useContext(roomContext);

  const handleJoin = function (e) {
    e.preventDefault();
    clearAlert();
    socket.emit('createOrJoinRoom', { room });
  };
  
  return (
    <>
      {!isViewing &&
      <div className='join-inputs'>
        <Join
          value={room.name}
          value2={room.password}
          onClick={handleJoin}
          onChange={(e) => setRoom({ ...room, name: e.target.value })}
          onChange2={(e) => setRoom({ ...room, password: e.target.value })} 
          alert={alert}
        />
        </div>
      }
      {isViewing &&
        <View />
      }
    </>
  )
};

export default Room;
