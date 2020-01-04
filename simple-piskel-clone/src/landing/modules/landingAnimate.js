export default function animate(draw, imgDataURIArr) {
  if (imgDataURIArr.length === 0) return;
  let start = performance.now();
  let i = 0;
  let timeFraction = 0;
  let prev = timeFraction;
  requestAnimationFrame(function animateFrame(time) {
    let duration = 1000 / 4;
    prev = timeFraction;
    timeFraction = Math.abs(Math.floor((time - start) / duration));
    if (timeFraction !== prev) {
      draw(i); // draw frame
      i++;
      i %= imgDataURIArr.length;
    }
    if (timeFraction >= 0) {
      requestAnimationFrame(animateFrame);
    }
  });
}
