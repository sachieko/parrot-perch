
import { useContext, useEffect, useRef, useState } from 'react';
import { roomContext } from '../../providers/RoomProvider';

function Snake() {
  const { socket, room } = useContext(roomContext);
  const [clicked, setClicked] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    socket.on('snakeGame', (res) => {
      if (!canvasRef.current) {
        return;
      }
      draw(res.players, res.apples);
    });
  }, [socket])

  const play = (e) => {
    socket.emit('play', { room });
    setClicked(true);
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
      e.preventDefault();
      console.log('here;');
      console.log('code', e.keyCode);
      socket.emit('key', { key: e.keyCode });
    }
  }

  const draw = (players, apples) => {
    const ctx = canvasRef.current.getContext('2d');
    const BB = canvasRef.current.getBoundingClientRect();
    console.log(BB.left, BB.top);
    const cellSize = 400 / 40;
    ctx.fillStyle = "#555";
    ctx.fillRect(0, 0, 400, 400);
    players.forEach((p) => {
      // players
      ctx.fillStyle = "#4286f4";
      ctx.fillRect(p.x * cellSize - BB.left, p.y * cellSize - BB.top, cellSize, cellSize);

      // tails
      p.tail.forEach((t) => {
        console.log('tail');
        ctx.fillRect(t.x * cellSize - BB.left, t.y * cellSize - BB.top, cellSize, cellSize);
      });
    });
    apples.forEach((a) => {
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(a.x * cellSize - BB.left, a.y * cellSize - BB.top, cellSize, cellSize);
    });
  }

  return (
    <div>
      {!clicked && <button onClick={play}>Play</button>}
      <canvas
        ref={canvasRef}
        width='400px'
        height='400px'
        onClick={(e) => console.log(e.clientX, e.clientY)}></canvas>
    </div>

  );
}

export default Snake;