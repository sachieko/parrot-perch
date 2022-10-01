import './App.css';
import io from 'socket.io-client'
import { useEffect, useState } from 'react';

function App() {
  const [roomName, setRoomName] = useState('')
  const [socket, setSocket] = useState()
  const [newRoom, setNewRoom] = useState(false)
  const [theRoomYoureViewing, setTheRoomYoureViewing] = useState('')
  useEffect(() => {
    const socket = io();
    setSocket(socket);
    socket.on('connect', () => {
      console.log('connected')
    });
    socket.on('hereIsYourRoom', (res) =>{
      console.log(res)
      setTheRoomYoureViewing(res.ta)
      setNewRoom(true)
    });
    return () => socket.disconnect();
  }, [])

  const submit = function(e){
    e.preventDefault()
    console.log(roomName);
    socket.emit('createOrJoinRoom', {roomName})
    setRoomName('')
  } 

  return (
    <div className="App">
      <h1>Hello World!</h1>
      {!newRoom && <form>
        <label>
          Join Room:
          <input type="text" name="roomName" value={roomName} onChange={e => setRoomName(e.target.value) }/>
        </label>
        <input type="submit" value="Submit" onClick={submit} />
      </form>}
      {newRoom && <div>{theRoomYoureViewing}</div>}
    </div>
  );
}

export default App;
