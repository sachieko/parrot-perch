import { useContext } from 'react';
import './Room.scss';
import Join from './JoinRoom';
import View from './ViewRoom';
import { roomContext } from '../providers/RoomProvider';

function Room() {
  const { room, setRoom, isViewing, socket } = useContext(roomContext);

  const handleJoin = function (e) {
    e.preventDefault();
    socket.emit('createOrJoinRoom', { room });
  };

  return (
    <>
      {!isViewing &&
      <div>
        <Join
          value={room.name}
          value2={room.password}
          onClick={handleJoin}
          onChange={(e) => setRoom({ ...room, name: e.target.value })}
          onChange2={(e) => setRoom({ ...room, password: e.target.value })} 
        />
        </div>
      }
      {isViewing &&
        <View
          room={room}
          setRoom={setRoom}
          socket={socket}
        />
      }
    </>
  )
}

export default Room;
