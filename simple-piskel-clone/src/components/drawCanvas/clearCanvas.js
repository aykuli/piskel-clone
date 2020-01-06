export default function clearCanvas(canvas, piskelImg, currentCount) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  piskelImg[currentCount] = '';
  localStorage.removeItem(`piskelImg`);
  localStorage.setItem('piskelImg', JSON.stringify(piskelImg));
}
