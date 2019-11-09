const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const pane = document.querySelector('.pane');
const currentColor = document.querySelector('#currentColor');
const pencil = document.querySelector('#pencil');
const prevColor = document.querySelector('.color--prev');
const colorRed = document.querySelector('.color--red');
const colorBlue = document.querySelector('.color--blue');
let prevColorCache = '#ffffff';
let pickedColor = currentColor;

ctx.lineWidth = 4;
let scale = 4;

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function draw(e) {
  if (!isDrawing) return;
  ctx.strokeStyle = pickedColor.value;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();

  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function watchColorPicker() {
  prevColor.children[0].style.background = ctx.strokeStyle;
  prevColorCache = ctx.strokeStyle;
  ctx.strokeStyle = currentColor.value;
}

function pencilTool(targetTool) {
  if (targetTool === pencil) {
    console.log(pencil);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mousedown', e => {
      isDrawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY];
    });
    canvas.addEventListener('mouseup', () => {
      isDrawing = false;
    });
    canvas.addEventListener('mouseout', () => {
      isDrawing = false;
    });
  } else {
    canvas.removeEventListener('mousemove', draw);
  }
}

let targetTool = pencil;
pencilTool(targetTool);

pane.addEventListener('click', e => {
  targetTool = e.target.closest('li');
  if (targetTool === null) return;
  const prevActiveTool = document.querySelector('.tool--active');
  prevActiveTool.classList.remove('tool--active');
  targetTool.classList.add('tool--active');

  pencilTool(targetTool);
});

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
