import { useState, useEffect, useRef, useContext } from "react";
import { roomContext } from '../../providers/RoomProvider';

function Whiteboard() {
  const [mouseDown, setMouseDown] = useState(false);
  const [path, setPath] = useState([]);
  const canvasRef = useRef(null);
  const { socket, room, incomingPath } = useContext(roomContext);

  useEffect(() => {
    for (const path of room.paths) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      drawPath(ctx, path);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawPath(ctx, incomingPath);
  }, [incomingPath]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawPath(ctx, path);
  }, [path]);

  const drawPath = (ctx, path) => {
    for (let i = 0; i < path.length; i++) {
      const p = path[i];
      const { x, y } = p;
      if (i === 0) {
        ctx.moveTo(x, y);
      }
      if (i === path.length - 1) {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      if (i > 0 && i < path.length) {
        ctx.lineTo(x, y);
      }
    }
  }

  const handleMouseDown = (e) => {
    const BB = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - BB.left;
    const y = e.clientY - BB.top;
    setPath([{ x, y }]);
    setMouseDown(true);
  }

  const handleMouseMove = (e) => {
    const BB = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - BB.left;
    const y = e.clientY - BB.top;
    if (mouseDown) {
      setPath(oldPath => [...oldPath, { x, y }]);
      socket.emit('savePath', { room: room, path: path });
    }
  }

  const handleMouseUp = (e) => {
    const BB = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - BB.left;
    const y = e.clientY - BB.top;
    setPath(oldPath => [...oldPath, { x, y }]);
    setMouseDown(false);
  }

  return (
    <div>
      <canvas
        id='whiteboard'
        width={'1000px'}
        height={'200px'}
        style={{ border: '1px solid black' }}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
      </canvas>
    </div >
  )
}

export default Whiteboard;