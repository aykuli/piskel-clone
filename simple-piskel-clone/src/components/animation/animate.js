import './animation.scss';

function animate(draw, piskelImg, fpsWatch, isForLanding = false) {
  if (piskelImg.length === 0) return;
  const start = performance.now();
  let i = 0;
  let timeFraction = 0;

  function animateFrame(time) {
    const fps = isForLanding ? 3 : localStorage.getItem('piskelFps');

    const duration = 1000 / fps;
    const prev = timeFraction;
    timeFraction = Math.abs(Math.floor((time - start) / duration));
    if (timeFraction !== prev) {
      draw(i); // draw frame
      i += 1;
      i %= piskelImg.length;

      if (+fps === 0) {
        const currentCount = localStorage.getItem('piskelCounter');
        draw(currentCount);
      }
    }
    if (timeFraction >= 0) {
      requestAnimationFrame(animateFrame);
    }
  }

  if (!isForLanding) fpsWatch(animateFrame);
  requestAnimationFrame(animateFrame);
}

function animationFullscreen(fullscreenBtn, previewCanvas) {
  fullscreenBtn.addEventListener('click', () => {
    previewCanvas.requestFullscreen();
  });
}
// fpsHandler for fps input changing
function fpsHandler(input, animateFrame) {
  input.parentNode.children[0].innerText = input.value; // eslint-disable-line

  localStorage.removeItem('piskelFps');
  localStorage.setItem('piskelFps', input.value);

  if (+input.value !== 0) {
    requestAnimationFrame(animateFrame);
  }
}

export { animate, animationFullscreen, fpsHandler };
