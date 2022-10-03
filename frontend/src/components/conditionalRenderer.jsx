import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import JoinRoom from './joinRoom';
import ViewRoom from './viewRoom';

function ConditionalRenderer() {
  const [roomChannel, setRoomChannel] = useState('')
  const [newRoom, setNewRoom] = useState('')
  const [socket, setSocket] = useState()
  const [isVeiwing, setIsViewing] = useState(false)
  const [room, setRoom] = useState('')

  const handleJoin = function (e) {
    e.preventDefault()
    socket.emit('createOrJoinRoom', { roomName: newRoom })
    setNewRoom('')
  }

  useEffect(() => {
    const socket = io();
    setSocket(socket);
    socket.on('connect', () => {
      console.log('connected')
    });
    socket.on('hereIsYourRoom', (res) => {
      setRoom(res.name)
      setRoomChannel(res.channel)
      setIsViewing(true)
    });
    socket.on('serveChannel', (res) => {
      setRoomChannel(res.channel)
    });
    return () => socket.disconnect();
  }, [])

  return (
    <>
      {!isVeiwing &&
        <JoinRoom
          value={newRoom}
          onClick={handleJoin}
          onChange={(e) => setNewRoom(e.target.value)}
        />
      }
      {isVeiwing &&
        <ViewRoom
          channel={roomChannel}
          room={room}
          socket={socket}
        />
      }
    </>
  )
}

export default ConditionalRenderer;