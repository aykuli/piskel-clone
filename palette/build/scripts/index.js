// class Piskel {
//   constructor() {

//   }

//   window() {

//   }
// }
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const pane = document.querySelector('.pane');
const currentColor = document.querySelector('#currentColor');
const pencil = document.querySelector('#pencil');
const bucket = document.querySelector('#bucket');
const picker = document.getElementById('picker');
const prevColor = document.querySelector('.color--prev');
const colorRed = document.querySelector('.color--red');
const colorBlue = document.querySelector('.color--blue');

let targetToolEl = pencil;
let prevColorCache = '#ffffff';
let pickedColor = currentColor;

ctx.lineWidth = 4;
let scale = 4;
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
// localStorage.removeItem('userPaint');
window.onload = function() {
  if (localStorage.getItem('userPaint') === null) {
    localStorage.setItem('userPaint', ctxData);
  } else {
    ctxData = this.localStorage.getItem('userPaint');
  }
  console.log("BEFORE:    localStorage.getItem('userPaint')  ", localStorage.getItem('userPaint'));
};

window.unonload = function() {
  localStorage.removeItem('userPaint');
  localStorage.setItem('userPaint', ctxData);
  console.log("AFTER:    localStorage.getItem('userPaint')  ", localStorage.getItem('userPaint'));
};

function drawScale(e) {
  if (!isDrawing) return;
  isDrawing = true;
  ctx.fillStyle = pickedColor.value;
  [lastX, lastY] = [Math.ceil(e.offsetX / scale), Math.ceil(e.offsetY / scale)];
  ctx.fillRect((lastX - 1) * scale, (lastY - 1) * scale, scale, scale);
  ctxData[lastY - 1][lastX - 1] = ctx.fillStyle;
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
    canvas.addEventListener('mousemove', drawScale);
    canvas.addEventListener('mousedown', drawScaleIsTrue);
    canvas.addEventListener('mouseup', () => {
      isDrawing = false;
    });
    canvas.addEventListener('mouseout', () => {
      isDrawing = false;
    });
  } else {
    canvas.removeEventListener('mousemove', drawScale);
    canvas.removeEventListener('mousedown', drawScaleIsTrue);
  }
}

function bucketTool(targetTool) {
  if (targetTool === 'bucket') {
    canvas.addEventListener('mousedown', floodFill);
  } else {
    canvas.removeEventListener('mousedown', floodFill);
  }
}
function floodFill(e) {
  [lastX, lastY] = [Math.ceil(e.offsetX / scale), Math.ceil(e.offsetY / scale)];
  let colorPrev = ctxData[lastY - 1][lastX - 1];
  floodFillInner(lastX - 1, lastY - 1, colorPrev, currentColor.value);

  function floodFillInner(x, y, colorPrev, targetColor) {
    if (targetColor === colorPrev) return;
    if (ctxData[y][x] !== colorPrev) return;
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

function pickerTool(targetTool) {
  if ((targetTool = 'picker')) {
    canvas.addEventListener('click', colorPicker);
  } else {
    canvas.removeEventListener('click', colorPicker);
  }
}
function colorPicker(e) {
  [x, y] = [Math.ceil(e.offsetX / scale), Math.ceil(e.offsetY / scale)];
  console.log(`ctxData[${y}][${x}] = ${ctxData[y - 1][x - 1]}`);
  let choosedColor = ctxData[y - 1][x - 1];
  currentColor.value = choosedColor;
}
function highlightActiveTool(targetToolEl) {
  const prevActiveTool = document.querySelector('.tool--active');
  prevActiveTool.classList.remove('tool--active');
  targetToolEl.classList.add('tool--active');
  targetTool = targetToolEl.id;
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
  targetToolEl = e.target.closest('li');
  console.log(targetToolEl);
  if (targetToolEl === null) return;
  highlightActiveTool(targetToolEl);
  console.log('targetTool = ', targetTool);

  pencilTool(targetTool);
  bucketTool(targetTool);
  pickerTool(targetTool);
});

document.addEventListener('keydown', e => {
  console.log(e.code);
  switch (e.code) {
    case 'KeyB':
      console.log(targetTool);
      targetTool = 'bucket';
      highlightActiveTool(bucket);
      break;
    case 'KeyP':
      console.log(targetTool);
      targetTool = 'pencil';
      highlightActiveTool(pencil);
      break;
    case 'KeyC':
      console.log(targetTool);
      targetTool = 'picker';
      highlightActiveTool(picker);
      break;
  }
});
