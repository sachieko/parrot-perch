import { useState, useEffect, useRef, useContext } from "react";
import { roomContext } from '../../providers/RoomProvider';
import drawPath from "../../helpers/whiteboardHelpers";


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
  }, [room.paths]);

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
        style={{ border: '1px solid white' }}
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