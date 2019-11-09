const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const pane = document.querySelector('.pane');
const currentColor = document.querySelector('#currentColor');
const pencil = document.querySelector('#pencil');
const bucket = document.querySelector('#bucket');
const prevColor = document.querySelector('.color--prev');
const colorRed = document.querySelector('.color--red');
const colorBlue = document.querySelector('.color--blue');
let prevColorCache = '#ffffff';
let pickedColor = currentColor;
console.log(canvas.width);

ctx.lineWidth = 4;
let scale = 32;
let row = canvas.width / scale;
let column = canvas.height / scale;
console.log(row, column);

let isDrawing = false;
let lastX = 0;
let lastY = 0;

let ctxData = [];
for (let i = 0; i < row; i++) {
  ctxData.push([]);
  for (let j = 0; j < column; j++) {
    ctxData[i].push('#000000');
  }
}
console.log('ctxData', ctxData);

function drawScale(e) {
  if (!isDrawing) return;
  ctx.fillStyle = pickedColor.value;
  // ctx.fillStyle = '#ff0000';
  [lastX, lastY] = [Math.ceil(e.offsetX / scale), Math.ceil(e.offsetY / scale)];
  ctx.fillRect((lastX - 1) * scale, (lastY - 1) * scale, scale, scale);
  console.log('lastX =', lastX);
  console.log('lastY= ', lastY);
  ctxData[lastY - 1][lastX - 1] = ctx.fillStyle;
  console.log('ctxData =', ctxData);
}

function watchColorPicker() {
  prevColor.children[0].style.background = ctx.strokeStyle;
  prevColorCache = ctx.strokeStyle;
  ctx.strokeStyle = currentColor.value;
}
function pencilTool(targetTool) {
  if (targetTool === pencil) {
    console.log(pencil);
    canvas.addEventListener('mousemove', drawScale);
    canvas.addEventListener('mousedown', e => {
      isDrawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY];
    });
    canvas.addEventListener('mouseup', () => {
      isDrawing = false;
      myImageData2 = ctx.getImageData(0, 0, 5, 5);
    });
    canvas.addEventListener('mouseout', () => {
      isDrawing = false;
    });
  } else {
    canvas.removeEventListener('mousemove', drawScale);
  }
}
let currentImageData = ctx.getImageData(0, 0, 512, 512);

function bucketTool(targetTool) {
  if (targetTool === bucket) {
    console.log('bucket choosed');
    currentImageData = ctx.getImageData(0, 0, 512, 512);
    console.log(currentImageData);
  }
}
function colorChanging() {
  colorRed.addEventListener('click', () => {
    currentColor.value = '#f74242';
    watchColorPicker();
  });
  colorBlue.addEventListener('click', () => {
    currentColor.value = '#316cb9';
    watchColorPicker();
  });
  prevColor.addEventListener('click', () => {
    currentColor.value = prevColorCache;
    watchColorPicker();
  });
  currentColor.addEventListener('change', watchColorPicker, false);
}
let targetTool = pencil;
colorChanging();
pencilTool(targetTool);

pane.addEventListener('click', e => {
  targetTool = e.target.closest('li');
  if (targetTool === null) return;
  const prevActiveTool = document.querySelector('.tool--active');
  prevActiveTool.classList.remove('tool--active');
  targetTool.classList.add('tool--active');

  pencilTool(targetTool);
  bucketTool(targetTool);
});
