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
let scale = 16;
let row = canvas.width / scale;
let column = canvas.height / scale;
console.log('row: ', row, 'column: ', column);

let isDrawing = false;
let lastX = 0;
let lastY = 0;

let ctxData = [];

window.onload = function() {
  console.log('page refreshed');
  localStorage.removeItem('userPaint');
  if (localStorage.getItem('userPaint') === null) {
    console.log('We are inside localStorage.getItem(userPaint) === null');
    console.log('Before for ctxData: ', ctxData);

    for (let i = 0; i < row; i++) {
      ctxData.push([]);
      for (let j = 0; j < column; j++) {
        ctxData[i].push('#ffffff');
      }
    }
    console.log(ctxData[0][0]);
    console.log('after for ctxData: ', ctxData);
    console.log('after loadPrevImage()  ctxData: ', ctxData);
    let json = JSON.stringify(ctxData);

    localStorage.setItem('userPaint', json);
    ctxData = localStorage.getItem('userPaint');
    console.log('localStorage.getItem(userPaint): ', localStorage.getItem('userPaint'));
    console.log(ctxData[0][0]);
  } else {
    console.log('localStorage is not null');
    let json = localStorage.getItem('userPaint');
    ctxData = JSON.parse(json);
    console.log(' loading ctxData:', ctxData);
    console.log(ctxData[0][0]);
    loadPrevImage();
  }
};
window.onbeforeunload = function() {
  let json = localStorage.getItem('userPaint');
  localStorageSave();
};

function localStorageSave() {
  console.log('\nlocalStorage.removeItem(userPaint);');
  let json = JSON.stringify(ctxData);
  localStorage.removeItem('userPaint');
  localStorage.setItem('userPaint', json);
}

function loadPrevImage() {
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < column; j++) {
      ctx.fillStyle = ctxData[i][j];
      ctx.fillRect(i * scale, j * scale, scale, scale);
    }
  }
}

// function emptyCanvas(e) {
//   console.log('emptyCanvas');
//   for (let i = 0; i < row; i++) {
//     for (let j = 0; j < column; j++) {
//       ctxData[i][j] = '#ffffff';
//       ctx.fillStyle = ctxData[i][j];
//       ctx.fillRect(i * scale, j * scale, scale, scale);
//     }
//   }
// }

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
function pencilTool() {
  if (targetTool === 'pencil') {
    console.log('-------  pencil add ----------------');
    canvas.addEventListener('mousemove', drawScale);
    canvas.addEventListener('mousedown', drawScaleIsTrue);
    canvas.addEventListener('mouseup', () => {
      isDrawing = false;
      console.log('Pencil: ctxData = ', ctxData);
    });
    canvas.addEventListener('mouseout', () => {
      isDrawing = false;
    });
  } else {
    canvas.removeEventListener('mousemove', drawScale);
    canvas.removeEventListener('mousedown', drawScaleIsTrue);
    console.log('-------  pencil remove ----------------');
    console.log('AFTER pencil ctxData: ', ctxData);
  }
}

function bucketTool() {
  if (targetTool === 'bucket') {
    console.log('-------  bucket add ----------------');
    canvas.addEventListener('mousedown', floodFill);
  } else {
    canvas.removeEventListener('mousedown', floodFill);
    console.log('-------  bucket remove ----------------');
    console.log('AFTER Bucket ctxData: ', ctxData);
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
        try {
          floodFillInner(x + dx, y + dy, colorPrev, targetColor);
        } catch (err) {
          setTimeout(() => {
            floodFillInner(x + dx, y + dy, colorPrev, targetColor);
          }, 0);
        }
      }
    }
  }
}

function pickerTool() {
  if (targetTool === 'picker') {
    canvas.addEventListener('click', colorPicker);
  } else {
    canvas.removeEventListener('click', colorPicker);
  }
}
function colorPicker(e) {
  [x, y] = [Math.ceil(e.offsetX / scale), Math.ceil(e.offsetY / scale)];
  // console.log(`ctxData[${y}][${x}] = ${ctxData[y - 1][x - 1]}`);
  let choosedColor = ctxData[y - 1][x - 1];
  console.log('in colorPicker: choosedColor: ', choosedColor);
  currentColor.value = choosedColor;
  console.log();
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

function line(e) {}

function toolsWrapper() {
  pencilTool();
  bucketTool();
  pickerTool();

  // localStorageSave();
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
  toolsWrapper();
});

document.addEventListener('keydown', e => {
  console.log(e.code);
  switch (e.code) {
    case 'KeyB':
      targetTool = 'bucket';
      highlightActiveTool(bucket);
      toolsWrapper();
      console.log("document.addEventListener('keydown' targetTool:", targetTool);
      break;
    case 'KeyP':
      console.log("document.addEventListener('keydown'  targetTool:", targetTool);
      targetTool = 'pencil';
      highlightActiveTool(pencil);
      toolsWrapper();
      break;
    case 'KeyC':
      console.log("document.addEventListener('keydown'  targetTool:", targetTool);
      targetTool = 'picker';
      highlightActiveTool(picker);
      toolsWrapper();
      break;
  }
});

// let empty = document.getElementById('empty');
// empty.addEventListener('click', emptyCanvas);
