class Picture {
  constructor(canvas, ctx, currentColor) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.row = this.canvas.width / scale;
    this.column = this.canvas.height / scale;
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;
    this.currentColor = currentColor;
    this.prevColorCache = '#ffffff';
    this.dataURI = null;
    if (canvas == null) {
      throw new Error('there is no canvas');
    }
  }

  loadingWindow() {
    console.log('starting load');
    window.onload = () => {
      console.log('Hello!');
      console.log('window onloaded');
      console.log('localStorage.getItem(userPaint) = ', localStorage.getItem('userPaint'));
      if (localStorage.getItem('userPaint') !== null) {
        console.log('inside localStorage.getItem(userPaint !== null');
        this.dataURI = localStorage.getItem('userPaint');
        console.log('localStorage.getItem(userPaint): ', this.dataURI);
        let img = new Image();
        img.onload = () => {
          this.ctx.drawImage(img, 0, 0);
        };
        img.src = localStorage.getItem('userPaint');
      }
    };
  }

  localStorageSave() {
    console.log('saving in localStorage this.ctx.imageData');
    localStorage.removeItem('userPaint');

    this.dataURI = this.canvas.toDataURL();
    localStorage.setItem('userPaint', JSON.stringify(this.dataURI));
    // console.log('localStorage.getItem(userPaint) = ', localStorage.getItem('userPaint'));
  }

  plot(x, y) {
    this.ctx.fillStyle = this.currentColor.value;
    this.ctx.fillRect((x - 1) * scale, (y - 1) * scale, scale, scale);
  }

  // Bresenham algorithm
  bresenham = (x1, x2, y1, y2) => {
    let [innerX1, innerY1] = [x1, y1];
    const [innerX2, innerY2] = [x2, y2];
    if (!this.isDrawing) return;
    this.isDrawing = true;

    const deltaX = Math.abs(x2 - x1);
    const deltaY = Math.abs(y2 - y1);
    const signX = x1 < x2 ? 1 : -1;
    const signY = y1 < y2 ? 1 : -1;
    let err = deltaX - deltaY;

    this.plot(innerX2, innerY2);
    while (innerX1 !== innerX2 || innerY1 !== innerY2) {
      this.plot(innerX1, innerY1);
      const err2 = err * 2;
      if (err2 > -deltaY) {
        err -= deltaY;
        innerX1 += signX;
      }
      if (err2 < deltaX) {
        err += deltaX;
        innerY1 += signY;
      }
    }
  };

  draw = e => {
    [this.x2, this.y2] = [Math.ceil(e.offsetX / scale), Math.ceil(e.offsetY / scale)];
    this.bresenham(this.x1, this.x2, this.y1, this.y2);
    [this.x1, this.y1] = [this.x2, this.y2];
  };

  drawOnMouseDown = e => {
    this.isDrawing = true;
    [this.x1, this.y1] = [Math.ceil(e.offsetX / scale), Math.ceil(e.offsetY / scale)];
    this.plot(this.x1, this.y1);
  };

  drawMouseUp = e => {
    [this.x2, this.y2] = [Math.ceil(e.offsetX / scale), Math.ceil(e.offsetY / scale)];
    this.bresenham(this.x1, this.x2, this.y1, this.y2);
    this.isDrawing = false;
    this.localStorageSave();
  };

  pencilTool = targetTool => {
    if (targetTool === 'pencil') {
      this.canvas.addEventListener('mousemove', this.draw);
      this.canvas.addEventListener('mousedown', this.drawOnMouseDown);
      this.canvas.addEventListener('mouseup', this.drawMouseUp);
      this.canvas.addEventListener('mouseout', () => {
        this.isDrawing = false;
      });
    } else {
      this.canvas.removeEventListener('mousemove', this.draw);
      this.canvas.removeEventListener('mousedown', this.drawOnMouseDown);
      this.canvas.removeEventListener('mouseup', this.drawMouseUp);
    }
  };

  bucketTool(targetTool) {
    if (targetTool === 'bucket') {
      console.log('bucket tool choosed');
      this.canvas.addEventListener('mousedown', this.floodFill);
    } else {
      this.canvas.removeEventListener('mousedown', this.floodFill);
    }
  }

  floodFill = e => {
    console.log('inside floodFill');

    [this.lastX, this.lastY] = [Math.ceil(e.offsetX / scale), Math.ceil(e.offsetY / scale)];
    console.log(this.lastX);
    const colorPrev = this.ctxData[this.lastY - 1][this.lastX - 1];
    const floodFillInner = (x, y, targetColor, scale, canvas) => {
      if (targetColor === colorPrev) return;

      this.ctx.fillStyle = targetColor;
      this.ctx.fillRect(x * scale, y * scale, scale, scale);

      const around = [
        { dx: 0, dy: -1 },
        { dx: -1, dy: 0 },
        { dx: 1, dy: 0 },
        { dx: 0, dy: +1 },
      ];

      for (const { dx, dy } of around) {
        if (x + dx >= 0 && x + dx < canvas.width / scale && y + dy >= 0 && y + dy < canvas.height / scale) {
          try {
            floodFillInner(x + dx, y + dy, targetColor, scale, canvas);
          } catch (err) {
            setTimeout(() => {
              floodFillInner(x + dx, y + dy, targetColor, scale, canvas);
            }, 0);
          }
        }
      }
    };
    floodFillInner(this.lastX - 1, this.lastY - 1, this.currentColor.value, scale, this.canvas);
  };

  watchColor(prevColor, newColor) {
    const prevChild = prevColor.children[0];
    prevChild.style.background = this.ctx.fillStyle;
    this.prevColorCache = this.ctx.fillStyle;
    this.ctx.fillStyle = newColor;
    this.currentColor.value = newColor;
  }

  pickerTool(targetTool) {
    if (targetTool === 'picker') {
      this.canvas.addEventListener('click', this.colorPicker);
    } else {
      this.canvas.removeEventListener('click', this.colorPicker);
    }
  }

  colorPicker = e => {
    const [x, y] = [Math.ceil(e.offsetX / scale), Math.ceil(e.offsetY / scale)];
    const choosedColor = this.ctx.getImageData(x, y, 1, 1);
    console.log('choosedColor =', choosedColor);
    this.ctx.fillStyle = choosedColor;
    this.currentColor.value = choosedColor;
  };

  tools = targetTool => {
    this.pencilTool(targetTool);
    this.bucketTool(targetTool);
    this.pickerTool(targetTool);
  };
}

function getLinkToImage() {
  const url =
    'https://api.unsplash.com/photos/random?query=town,Minsk&client_id=e2077ad31a806c894c460aec8f81bc2af4d09c4f8104ae3177bb809faf0eac17';
  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data.urls.regular);
    });
}
// getLinkToImage();
function drawImage() {}

// Start working with index.html
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const pane = document.querySelector('.pane');
const currentColor = document.getElementById('currentColor');
const prevColor = document.querySelector('.color--prev');
const colorRed = document.querySelector('.color--red');
const colorBlue = document.querySelector('.color--blue');
const prevColorCache = '#ffffff';
prevColor.children[0].style.background = '#ffffff';
let dataURI = null;
let scale = 4;
console.log(scale);
let app = new Picture(canvas, ctx, currentColor);

// **********   INITIALIZATION    ************ */
// Initialization process, loading prev image

const img = new Image();

window.addEventListener('load', () => {
  if (localStorage.getItem('userPaint') !== null) {
    dataURI = localStorage.getItem('userPaint');
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    };
    img.src = JSON.parse(dataURI);
  }
});

// const image = new Image(60, 45);
// image.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
// image.onload = () => ctx.drawImage(image, 100, 100, canvas.width, canvas.height);

window.onbeforeunload = () => app.localStorageSave();
// **********   and of INITIALIZATION    ************ */

// ********************       TOOLS       *******************/
let targetTool = 'pencil';
app.pencilTool(targetTool);

pane.addEventListener('click', e => {
  const targetToolEl = e.target.closest('li');
  if (targetToolEl === null) return;
  targetTool = targetToolEl.id;
  const prevActiveTool = document.querySelector('.tool--active');
  prevActiveTool.classList.remove('tool--active');
  targetToolEl.classList.add('tool--active');
  app.tools(targetTool);
});
// ********************    end of TOOLS    *******************/

// ******************    COLOR MANAGING    *******************/
colorRed.addEventListener('click', () => {
  currentColor.value = '#f74242';
  app.watchColor(prevColor, currentColor.value, false);
});
colorBlue.addEventListener('click', () => {
  currentColor.value = '#316cb9';
  app.watchColor(prevColor, currentColor.value, false);
});
prevColor.addEventListener('click', () => {
  currentColor.value = prevColorCache;
  app.watchColor(prevColor, currentColor.value, false);
});
currentColor.addEventListener('change', app.watchColor(prevColor, currentColor.value, false));
// *************    end of  COLOR MANAGING      **************/

// ****************    KEYBOARD SHORTCUTS     ****************/
document.addEventListener('keydown', e => {
  switch (e.code) {
    case 'KeyB':
      targetTool = 'bucket';
      break;
    case 'KeyP':
      targetTool = 'pencil';
      break;
    case 'KeyC':
      targetTool = 'picker';
      break;
    default:
      targetTool = 'pencil';
  }
  const targetToolEl = document.getElementById(targetTool);
  const prevActiveTool = document.querySelector('.tool--active');
  prevActiveTool.classList.remove('tool--active');
  targetToolEl.classList.add('tool--active');
  app.tools(targetTool);
});
// ****************  end of  KEYBOARD SHORTCUTS     ****************/

const canvasResolution = document.querySelector('.canvas__resolution');
canvasResolution.addEventListener('click', e => {
  switch (e.target.id) {
    case 'res128':
      scale = 4;
      app = new Picture(scale, canvas, ctx, currentColor);
      break;
    case 'res256':
      scale = 2;
      app = new Picture(scale, canvas, ctx, currentColor);
      break;
    case 'res512':
      scale = 1;
      app = new Picture(scale, canvas, ctx, currentColor);
      break;
  }
});
