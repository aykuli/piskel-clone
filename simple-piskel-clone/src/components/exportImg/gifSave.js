export default function gifSave(canvas, GIFEncoder) {
  const fps = localStorage.getItem('piskelFps');
  const framesData = JSON.parse(localStorage.getItem('piskelImg'));
  const ctx = canvas.getContext('2d');

  const encoder = new GIFEncoder();
  encoder.setRepeat(0);
  encoder.setDelay(1000 / fps);
  encoder.start();

  framesData.forEach((frame, index) => {
    const img = new Image();
    img.src = frame;
    img.addEventListener('load', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.width);
      encoder.setSize(canvas.width, canvas.height);
      encoder.addFrame(imageData.data, true);

      if (index === framesData.length - 1) {
        encoder.finish();
        encoder.download('download.gif');
      }
    });
  });
  return 'image saved as .gif';
}
