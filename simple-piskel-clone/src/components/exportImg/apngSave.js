import UPNG from 'upng-js';
import download from 'downloadjs';

export default function apngSave(canvas) {
  const framesData = JSON.parse(localStorage.getItem('piskelImg'));
  const fps = localStorage.getItem('piskelFps');
  const ctx = canvas.getContext('2d');

  const imgs = [];
  const delays = [];

  const scale = localStorage.getItem('piskelPixelSize');

  framesData.forEach((frame, index) => {
    const img = new Image();
    img.src = frame;
    img.addEventListener('load', () => {
      ctx.drawImage(img, 0, 0, canvas.width / scale, canvas.height / scale);
      imgs.push(ctx.getImageData(0, 0, canvas.width / scale, canvas.width / scale).data.buffer);
      delays.push(1000 / fps);

      if (index === framesData.length - 1) {
        const apngData = UPNG.encode(imgs, canvas.width / scale, canvas.width / scale, 0, delays);
        download(apngData, 'image.apng', 'apng');
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  });
  return 'image saved as .apng';
}
