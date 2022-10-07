import { useState, useEffect, useRef, useContext } from "react";
import { roomContext } from '../../providers/RoomProvider';

function Whiteboard() {
  const [mouseDown, setMouseDown] = useState(false);
  const [path, setPath] = useState([]);
  const canvasRef = useRef(null);
  const { socket, room } = useContext(roomContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx.canvas.width !== 1000) {
      ctx.canvas.width = 1000;
    }
    for (const path of room.paths) {
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
  }, [path, room]);

  const handleMouseDown = (e) => {
    const x = e.clientX - canvasRef.current.offsetLeft;
    const y = e.clientY - canvasRef.current.offsetTop;
    setPath([{ x, y }]);
    setMouseDown(true);
  }

  const handleMouseMove = (e) => {
    const x = e.clientX - canvasRef.current.offsetLeft;
    const y = e.clientY - canvasRef.current.offsetTop;
    if (mouseDown) {
      setPath(oldPath => [...oldPath, { x, y }]);
      socket.emit('savePath', { room: { ...room, paths: [...room.paths, path] } });
    }
  }

  const handleMouseUp = (e) => {
    const x = e.clientX - canvasRef.current.offsetLeft;
    const y = e.clientY - canvasRef.current.offsetTop;
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