const canvas = document.getElementById('canvas');
const canvasWidth = canvas.getBoundingClientRect().width;
const canvasHeight = canvas.getBoundingClientRect().height;
const ctx = canvas.getContext('2d');

function drawPredefined(colors) {
  const rowLength = colors.length;
  const columnLength = colors[0].length;

  if (canvas.getContext) {
    colors.forEach((row, i) => {
      row.forEach((column, j) => {
        ctx.fillStyle = `#${column}`;
        ctx.fillRect(
          i * (canvasWidth / rowLength),
          j * (canvasHeight / columnLength),
          canvasWidth / rowLength,
          canvasHeight / columnLength,
        );
      });
    });
  }
}

function RGBToHex(data) {
  const dataHex = [];

  data.forEach((row, i) => {
    dataHex.push([]);
    row.forEach((column, j) => {
      const color = data[i][j];

      const colorHex = ((color[0] << 16) + (color[1] << 8) + color[2]).toString(16);
      dataHex[i].push(colorHex);
    });
  });
  return dataHex;
}

function drawImage(imageSrc) {
  if (canvas.getContext) {
    const pic = new Image();
    pic.src = imageSrc;
    pic.onload = () => ctx.drawImage(pic, 0, 0, canvasWidth, canvasHeight);
  }
}

ctx.strokeStyle = '#225522';
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 10;

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function draw(e) {
  if (!isDrawing) return;
  console.log(e);
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();

  [lastX, lastY] = [e.offsetX, e.offsetY];
}

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', e => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener('mouseup', () => (isDrawing = false));
canvas.addEventListener('mouseout', () => (isDrawing = false));

document.getElementById('draw').addEventListener('click', () => {
  const drawSelecterValue = document.forms.drawSelectorForm.elements.drawSelector.value;
  let myRequest;
  if (drawSelecterValue === 'draw32x32') {
    myRequest = new Request('../assets/data/32x32.json');
  } else if (drawSelecterValue === 'draw4x4') {
    myRequest = new Request('../assets/data/4x4.json');
  } else if (drawSelecterValue === 'RSSchoolIcon') {
    drawImage('../assets/data/image.png');
  }

  fetch(myRequest)
    .then(resp => resp.json())
    .then(data => {
      if (drawSelecterValue === 'draw32x32') {
        const dataForDraw = RGBToHex(data);
        drawPredefined(dataForDraw);
      } else if (drawSelecterValue === 'draw4x4') {
        drawPredefined(data);
      } else if (drawSelecterValue === 'RSSchoolIcon') {
        drawImage('./assets/data/image.png');
      }
    });
});
