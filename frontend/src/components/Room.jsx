import { useContext } from 'react';
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
        <Join
          value={room.name}
          onClick={handleJoin}
          onChange={(e) => setRoom({ ...room, name: e.target.value })}
        />
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
