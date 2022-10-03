import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import JoinRoom from './joinRoom';
import ViewRoom from './viewRoom';

function ConditionalRenderer() {
  const [socket, setSocket] = useState();
  const [isVeiwing, setIsViewing] = useState(false);
  const [room, setRoom] = useState({
    name: '',
    channel: ''
  });

  const handleJoin = function (e) {
    e.preventDefault();
    socket.emit('createOrJoinRoom', { room });
  }

  useEffect(() => {
    const socket = io();
    setSocket(socket);
    socket.on('connect', () => {
      console.log('connected');
    });
    socket.on('serveRoom', (res) => {
      const room = res.room;
      setRoom((oldRoom) => {
        return { ...oldRoom, name: room.name, channel: room.channel };
      });
      setIsViewing(true);
    });
    return () => socket.disconnect();
  }, [])

  return (
    <>
      {!isVeiwing &&
        <JoinRoom
          value={room.name}
          onClick={handleJoin}
          onChange={(e) => setRoom({ ...room, name: e.target.value })}
        />
      }
      {isVeiwing &&
        <ViewRoom
          room={room}
          setRoom={setRoom}
          socket={socket}
        />
      }
    </>
  )
}

export default ConditionalRenderer;