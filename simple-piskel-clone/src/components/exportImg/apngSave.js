import UPNG from 'upng-js';
import download from 'downloadjs';

export default function apngSave(canvas) {
  const framesData = JSON.parse(localStorage.getItem('piskelImg'));
  const fps = localStorage.getItem('piskelFps');
  const ctx = canvas.getContext('2d');

  const imgs = [];
  const delays = [];

  framesData.forEach((frame, index) => {
    const img = new Image();
    img.src = frame;
    img.addEventListener('load', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      imgs.push(ctx.getImageData(0, 0, canvas.width, canvas.width).data.buffer);
      delays.push(1000 / fps);

      if (index === framesData.length - 1) {
        const apngData = UPNG.encode(imgs, canvas.width, canvas.width, 0, delays);
        download(apngData, 'image.apng', 'apng');
      }
    });
  });
  return 'image saved as .apng';
}
