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

export { drawOnCanvas };
