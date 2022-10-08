const drawPath = function(ctx, path, color) {
  ctx.strokeStyle = 'white';
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.save();
  ctx.restore();
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
};

export default drawPath;