function plot(x, y, ctx, currentColor) {
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = currentColor;
  ctx.fillRect(x, y, 1, 1);
}

export { plot };
