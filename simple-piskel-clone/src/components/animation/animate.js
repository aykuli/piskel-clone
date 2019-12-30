function animate(draw, fpsInput, fpsDOM, piskelImg) {
  if (piskelImg.length === 0) return;
  let start = performance.now();
  let i = 0;
  let timeFraction = 0;
  let prev = timeFraction;
  let animReqId = requestAnimationFrame(function animate(time) {
    let fps = localStorage.getItem('piskelFps');
    let duration;
    fpsInput.addEventListener('input', () => {
      fpsDOM.innerText = fpsInput.value;
      fps = fpsInput.value;
      localStorage.removeItem('piskelFps');
      localStorage.setItem('piskelFps', fps);

      if (+fps !== 0) {
        duration = 1000 / fps;
        prev = timeFraction;
        timeFraction = Math.abs(Math.floor((time - start) / duration));
        if (timeFraction !== prev) {
          draw(i); // draw frame
          i++;
          i %= piskelImg.length;
        }
        if (timeFraction >= 0) {
          cancelAnimationFrame(animReqId - 1);
          animReqId = requestAnimationFrame(animate);
        }
      } else {
        cancelAnimationFrame(animReqId);
        const currentCount = localStorage.getItem('piskelCounter');
        draw(currentCount);
      }
    });

    if (+fps !== 0) {
      duration = 1000 / fps;
      prev = timeFraction;
      timeFraction = Math.abs(Math.floor((time - start) / duration));
      if (timeFraction !== prev) {
        draw(i); // draw frame
        i++;
        i %= piskelImg.length;
      }
      if (timeFraction >= 0) {
        cancelAnimationFrame(animReqId);
        animReqId = requestAnimationFrame(animate);
      }
    }
  });
}

export { animate };
