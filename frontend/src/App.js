import './App.css';
import io from 'socket.io-client'
import { useEffect, useState } from 'react';

function App() {
  const [channel, setChannel] = useState('')
  const [enterChannel, setEnterChannel] = useState('')
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
    socket.on('hereIsYourRoom', (res) => {
      setTheRoomYoureViewing(res.name)
      setEnterChannel(res.channel)
      setNewRoom(true)
    });
    socket.on('serveChannel', (res) => {
      setEnterChannel(res.channel)
    });
    return () => socket.disconnect();
  }, [])

  const handleSubmit = function (e) {
    e.preventDefault()
    socket.emit('attachChannelToRoom', { roomName: theRoomYoureViewing, channel: channel })
    setChannel('')
  }

  const submit = function (e) {
    e.preventDefault()
    socket.emit('createOrJoinRoom', { roomName })
    setRoomName('')
  }
  return (
    <div className="App">
      <h1>Hello World!</h1>
      {!newRoom && <form>
        <label>
          Join Room:
          <input type="text" name="roomName" value={roomName} onChange={e => setRoomName(e.target.value)} />
        </label>
        <input type="submit" value="Submit" onClick={submit} />
      </form>}
      {newRoom &&
        <div>
          {theRoomYoureViewing}
          <div>
            <form onSubmit={handleSubmit}>
              <label> Enter Channel:
                <input type='text' value={channel} onChange={e => setChannel(e.target.value)} />
              </label>
              <input type='submit' value="submit" />
            </form>
          </div>
          <div>
            <iframe
              display='inline'
              src={`https://player.twitch.tv/?channel=${enterChannel}&parent=localhost`}
              height="480"
              width="69%"
              allowFullScreen
              title={theRoomYoureViewing}>
            </iframe>
            <iframe
              display="inline"
              frameBorder="0"
              scrolling="no"
              src={`https://www.twitch.tv/embed/${enterChannel}/chat?darkpopout&parent=localhost`}
              height="480"
              width="30%">
            </iframe>
          </div>
        </div>}
    </div>
  );
}

export default App;
