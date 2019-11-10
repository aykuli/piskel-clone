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

ctx.lineWidth = 4;
let scale = 32;
let row = canvas.width / scale;
let column = canvas.height / scale;

let isDrawing = false;
let lastX = 0;
let lastY = 0;

let ctxData = [];
for (let i = 0; i < row; i++) {
  ctxData.push([]);
  for (let j = 0; j < column; j++) {
    ctxData[i].push('#ffffff');
  }
}

function drawScale(e) {
  if (!isDrawing) return;
  isDrawing = true;
  ctx.fillStyle = pickedColor.value;
  [lastX, lastY] = [Math.ceil(e.offsetX / scale), Math.ceil(e.offsetY / scale)];
  ctx.fillRect((lastX - 1) * scale, (lastY - 1) * scale, scale, scale);
  ctxData[lastY - 1][lastX - 1] = ctx.fillStyle;
  // console.log(ctxData);
}
function drawScaleIsTrue(e) {
  isDrawing = true;
  drawScale(e);
}

function watchColorPicker() {
  prevColor.children[0].style.background = ctx.strokeStyle;
  prevColorCache = ctx.strokeStyle;
  ctx.strokeStyle = currentColor.value;
}
function pencilTool(targetTool) {
  if (targetTool === 'pencil') {
    console.log('\n******************         pencil   active        **********************');
    canvas.addEventListener('mousemove', drawScale);
    canvas.addEventListener('mousedown', drawScaleIsTrue);
    canvas.addEventListener('mouseup', () => {
      isDrawing = false;
    });
    canvas.addEventListener('mouseout', () => {
      isDrawing = false;
    });
  } else {
    console.log('\n******************         pencil    remove       **********************');
    canvas.removeEventListener('mousemove', drawScale);
    canvas.removeEventListener('mousedown', drawScaleIsTrue);
  }
}

function bucketTool(targetTool) {
  if (targetTool === 'bucket') {
    console.log('\n******************         bucket     active      **********************');
    canvas.addEventListener('mousedown', floodFill);
  } else {
    canvas.removeEventListener('mousedown', floodFill);
    console.log('\n******************         bucket     remove      **********************');
  }
}
function floodFill(e) {
  [lastX, lastY] = [Math.ceil(e.offsetX / scale), Math.ceil(e.offsetY / scale)];
  let colorPrev = ctxData[lastY - 1][lastX - 1];
  console.log('colorPrev: ', colorPrev);
  console.log('targetColor: ', currentColor.value);
  floodFillInner(lastX - 1, lastY - 1, colorPrev, currentColor.value);

  function floodFillInner(x, y, colorPrev, targetColor) {
    if (targetColor === colorPrev) return;
    if (ctxData[y][x] !== colorPrev) return;
    console.log('floodFill works');
    console.log('targetColor: ', targetColor);
    ctxData[y][x] = targetColor;
    ctx.fillStyle = targetColor;
    ctx.fillRect(x * scale, y * scale, scale, scale);

    const around = [{ dx: 0, dy: -1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }, { dx: 0, dy: +1 }];

    for (let { dx, dy } of around) {
      if (
        x + dx >= 0 &&
        x + dx < canvas.width / scale &&
        (y + dy >= 0 && y + dy < canvas.height / scale)
      ) {
        floodFillInner(x + dx, y + dy, colorPrev, targetColor);
      }
    }
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
let targetTool = 'pencil';
colorChanging();
pencilTool(targetTool);

pane.addEventListener('click', e => {
  targetTool = e.target.closest('li');
  if (targetTool === null) return;
  const prevActiveTool = document.querySelector('.tool--active');
  prevActiveTool.classList.remove('tool--active');
  targetTool.classList.add('tool--active');
  targetTool = targetTool.id;

  pencilTool(targetTool);
  bucketTool(targetTool);
});
