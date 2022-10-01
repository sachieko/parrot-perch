import './App.css';
import io from 'socket.io-client'
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    const socket = io();
    socket.on('connect', () => {
      console.log('connected')
    })
    return () => socket.disconnect(); // prevents memory leaks
  }, [])
  return (
    <div className="App">
      <h1>Hello World!</h1>
    </div>
  );
}

export default App;
