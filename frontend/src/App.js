import './App.css';
import io from 'socket.io-client'
import { useEffect, useState } from 'react';

function App() {
  const [channel, setChannel] = useState('')
  const [enterChannel, setEnterChannel] = useState('')
  useEffect(() => {
    const socket = io();
    socket.on('connect', () => {
      console.log('connected')
    })
    return () => socket.disconnect(); // prevents memory leaks
  }, [])

  const handleSubmit = function(e){
    e.preventDefault()
    setEnterChannel(channel)
    setChannel('')
  }
  return (
    <div className="App">
      <h1>Hello World!</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <input type='text' value={channel} onChange={e => setChannel(e.target.value)} />
          <input type='submit' value="submit" />
        </form>
      </div>
      <iframe
        src={`https://player.twitch.tv/?channel=${enterChannel}&parent=localhost`}
        height="480"
        width="940"
        allowfullscreen>
      </iframe>
    </div>
  );
}

export default App;
