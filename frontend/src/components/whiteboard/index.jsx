import { useState } from "react";
import { useEffect } from "react";

function Whiteboard({ canvasRef }) {
  const [mouseDown, setMouseDown] = useState(false);
  const [path, setPath] = useState([])

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
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
  }, [path]);

  const handleMouseDown = (e) => {
    const x = e.clientX;
    const y = e.clientY - canvasRef.current.offsetTop;
    setPath([{ x, y }]);
    setMouseDown(true);
  }

  const handleMouseMove = (e) => {
    const x = e.clientX;
    const y = e.clientY - canvasRef.current.offsetTop;
    if (mouseDown) {
      setPath(oldPath => [...oldPath, { x, y }]);
    }
  }

  const handleMouseUp = (e) => {
    const x = e.clientX;
    const y = e.clientY - canvasRef.current.offsetTop;
    setPath(oldPath => [...oldPath, { x, y }]);
    setMouseDown(false);
  }

  return (
    <div>
      <canvas
        id='whiteboard'
        width={window.innerWidth}
        height={'400px'}
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