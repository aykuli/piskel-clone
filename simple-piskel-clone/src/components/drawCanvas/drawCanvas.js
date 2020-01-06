import './drawCanvas.scss';

function drawOnCanvas(canvas, dataURI) {
  const ctx = canvas.getContext('2d');
  const img = new Image();
  if (dataURI === '') return;
  img.src = dataURI;
  img.addEventListener('load', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  });
}

function canvasResolutionHandler(e, pixelSize, canvas, currentCount, drawOnCanvas, highlightTarget) {
  if (e.target.tagName === 'BUTTON') {
    pixelSize = canvas.width / e.target.dataset.size;
    highlightTarget(e.target, 'resolution__btn--active');
    localStorage.removeItem('piskelPixelSize');
    localStorage.setItem('piskelPixelSize', pixelSize);
    const piskelImg = JSON.parse(localStorage.getItem('piskelImg'));
    drawOnCanvas(canvas, piskelImg[currentCount]);
  }
  return pixelSize;
}

export { drawOnCanvas, canvasResolutionHandler };
