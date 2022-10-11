import { useState, useEffect, useRef, useContext } from "react";
import { roomContext } from '../../providers/RoomProvider';
import drawPath from "../../helpers/whiteboardHelpers";


function Whiteboard(props) {
  const [mouseDown, setMouseDown] = useState(false);
  const [path, setPath] = useState([]);
  const canvasRef = useRef(null);
  const { socket, room } = useContext(roomContext);
  const [didLoad, setDidLoad] = useState(false);
  const [incomingPath, setIncomingPath] = useState([]);

  if (canvasRef.current && !didLoad) {
    for (const path of room.paths) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      drawPath(ctx, path);
      setDidLoad(true);
    }
  }

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('broadcastPath', (res) => {
      setIncomingPath(res.path);
    });
    socket.on('broadcastErase', (res) => {
      setIncomingPath(res.path);
    });
    return () => {
      socket.off('broadcastPath');
      socket.off('broadcastErase');
    }
  }, [socket]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (incomingPath.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    drawPath(ctx, incomingPath);
  }, [incomingPath]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawPath(ctx, path);
  }, [path]);

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

  const eraseWhiteboard = (e) => {
    socket.emit('eraseWhiteboard', { room: room });
  }

  return (
    <>
      <button onClick={eraseWhiteboard}>X</button>
      <canvas
        style={{
          display: props.selected ? 'block' : 'none',
          border: '1px solid white'
        }}
        id='whiteboard'
        width={'1000px'}
        height={'200px'}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setMouseDown(false)}
        onMouseLeave={() => setMouseDown(false)}
      >
      </canvas>
    </>
  )
}

export default Whiteboard;