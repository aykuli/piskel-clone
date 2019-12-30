function animate(draw, fpsInput, fpsDOM, piskelImg) {
  let start = performance.now();
  let i = 0;
  let timeFraction = 0;
  let prev = timeFraction;
  let animReqId = requestAnimationFrame(function animate(time) {
    let fps = localStorage.getItem('piskelFps');
    let duration;
    // debugger;
    fpsInput.addEventListener('change', () => {
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
          // console.log('animReqId in input chenge before: ', animReqId);
          cancelAnimationFrame(animReqId - 1);
          animReqId = requestAnimationFrame(animate);
          // console.log('animReqId in input chenge: ', animReqId);
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
        // console.log('animReqId in output chenge before: ', animReqId);
        cancelAnimationFrame(animReqId);
        animReqId = requestAnimationFrame(animate);
        // console.log('animReqId in output chenge: ', animReqId);
      }
    }
  });
}

export { animate };
