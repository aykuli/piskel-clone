import './animation.scss';

function animate(draw, piskelImg, fpsWatch = false, isForLanding = false) {
  if (piskelImg.length === 0) return;
  let start = performance.now();
  let i = 0;
  let timeFraction = 0;

  function animateFrame(time) {
    let fps = isForLanding ? 3 : localStorage.getItem('piskelFps');

    let duration = 1000 / fps;
    let prev = timeFraction;
    timeFraction = Math.abs(Math.floor((time - start) / duration));
    if (timeFraction !== prev) {
      draw(i); // draw frame
      i++;
      i %= piskelImg.length;
    }
    if (timeFraction >= 0) {
      requestAnimationFrame(animateFrame);
    }
  }

  if (fpsWatch) fpsWatch(draw, animateFrame);
  requestAnimationFrame(animateFrame);
}

function animationFullscreen(fullscreenBtn, previewCanvas) {
  fullscreenBtn.addEventListener('click', e => {
    previewCanvas.requestFullscreen();
  });
}

export { animate, animationFullscreen };
