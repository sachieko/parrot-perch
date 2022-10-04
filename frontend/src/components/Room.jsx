import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import Join from './JoinRoom';
import View from './ViewRoom';
import Chat from './components/Chat';

function Room() {
  const [socket, setSocket] = useState();
  const [isViewing, setIsViewing] = useState(false);
  const [room, setRoom] = useState({
    name: '',
    channel: '',
    users: []
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
        return { ...oldRoom, name: room.name, channel: room.channel, users: room.users };
      });
      setIsViewing(true);
    });
    return () => socket.disconnect();
  }, [])

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
        <>
        <View
          room={room}
          setRoom={setRoom}
          socket={socket}
        />
        <Chat />
        </>
      }
    </>
  )
}

export default Room;
