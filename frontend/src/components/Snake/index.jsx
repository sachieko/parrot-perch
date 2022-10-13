
import { useContext, useEffect, useRef } from 'react';
import { roomContext } from '../../providers/RoomProvider';
import './snake.scss' 

function Snake() {
  const { socket, room } = useContext(roomContext);
  const canvasRef = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        socket.emit('key', { key: e.key });
      }
    });
    socket.on('snakeGame', (res) => {
      if (!canvasRef.current) {
        return;
      }
      draw(res.players, res.apples);
    });
  }, [socket])

  const play = (e) => {
    socket.emit('play', { room });
  }

  const kill = (e) => {
    socket.emit('kill', { room });
  }

  const draw = (players, apples) => {
    const ctx = canvasRef.current.getContext('2d');
    const cellSize = 400 / 40;
    ctx.fillStyle = "#555";
    ctx.fillRect(0, 0, 400, 400);
    players.forEach((p) => {
      // players
      ctx.fillStyle = "#4286f4";
      ctx.fillRect(p.x * cellSize, p.y * cellSize, cellSize, cellSize);

      // tails
      p.tail.forEach((t) => {
        ctx.fillRect(t.x * cellSize, t.y * cellSize, cellSize, cellSize);
      });
    });
    apples.forEach((a) => {
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(a.x * cellSize, a.y * cellSize, cellSize, cellSize);
    });
  }

  return (
    <div className='snake-canvas'>
      {<div><button onClick={play}>Play</button><button onClick={kill}>Kill</button></div>}
      <canvas
        ref={canvasRef}
        width='400px'
        height='400px'></canvas>
    </div>

  );
}

export default Snake;