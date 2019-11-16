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
    if (canvas == null) {
      throw new Error('there is no canvas');
    }
  }

  localStorageSave() {
    console.log('saving in localStorage this.ctx.imageData');
    localStorage.removeItem('userPaint');

    const dataURI = this.canvas.toDataURL();
    localStorage.setItem('userPaint', JSON.stringify(dataURI));
  }

  plot(x, y) {
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.fillStyle = this.currentColor.value;
    this.ctx.fillRect(x, y, 1, 1);
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

  windowReload(ctx) {
    if (localStorage.getItem('userPaint') !== null) {
      const dataURI = localStorage.getItem('userPaint');
      const img = new Image();

      img.onload = () => {
        this.ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0);
      };
      img.src = JSON.parse(dataURI);
    }
    console.log('load:  ', localStorage.getItem('piskelCloneResolution'));
  }

  downloadImage(url, canvas) {
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    [canvas.width, canvas.height] = [512, 512];

    let [currentWidth, currentHeight] = [canvas.width, canvas.height];
    let [x, y] = [0, 0];
    img.onload = () => {
      if (img.naturalWidth > img.naturalHeight) {
        let scaleImg = img.naturalWidth / canvas.width;
        currentWidth = canvas.width;
        currentHeight = img.naturalHeight / scaleImg;
        x = 0;
        y = (canvas.height - currentHeight) / 2;
      } else if (img.naturalWidth === img.naturalHeight) {
        currentWidth = canvas.width;
        currentHeight = canvas.height;
      } else {
        let scaleImg = img.naturalHeight / canvas.height;
        currentWidth = img.naturalWidth / scaleImg;
        currentHeight = canvas.height;
        x = (canvas.width - currentWidth) / 2;
        y = 0;
      }
      this.ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, x, y, currentWidth, currentHeight);
      const dataURI = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
      localStorage.removeItem('piskelCloneImg');
      localStorage.setItem('piskelCloneImg', JSON.stringify(dataURI));
    };
  }

  saveCanvas(canvas) {
    function download(canvas, filename) {
      // create an "off-screen" anchor tag
      const lnk = document.createElement('a');
      // the key here is to set the download attribute of the a tag
      lnk.download = filename;
      // convert canvas content to data-uri for link. When download
      // attribute is set the content pointed to by link will be
      // pushed as "download" in HTML5 capable browsers
      lnk.href = canvas.toDataURL('image/png;base64');
      if (document.createEvent) {
        const e = document.createEvent('MouseEvents');
        e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

        lnk.dispatchEvent(e);
      } else if (lnk.fireEvent) {
        lnk.fireEvent('onclick');
      }
    }
    download(canvas, 'myimage.png');
  }

  highlightCurrentResolution(target) {
    const currentRes = document.querySelector('.res-active');
    currentRes.classList.remove('res-active');
    target.classList.add('res-active');
  }
}

function getLinkToImage(city) {
  let url = `https://api.unsplash.com/photos/random?query=town,${city}&client_id=e2077ad31a806c894c460aec8f81bc2af4d09c4f8104ae3177bb809faf0eac17`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data.urls.regular);
      app.drawImageOnCanvas(data.urls.regular, canvas, true);
      app.drawImageOnCanvas(data.urls.regular, canvas, false);
    })
    .catch(err => alert('Put down in input right city'));
}

// Start working with index.html
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const pane = document.querySelector('.pane');
const currentColor = document.getElementById('currentColor');
const prevColor = document.querySelector('.color--prev');
const colorRed = document.querySelector('.color--red');
const colorBlue = document.querySelector('.color--blue');
const empty = document.getElementById('empty');
const prevColorCache = '#ffffff';
prevColor.children[0].style.background = '#ffffff';
let dataURI = null;
let scale = 1;
let size = 512;
let cityChoiseInpit = document.getElementById('cityChoiseInpit');
let city = 'Almaty';
const load = document.getElementById('load');
ctx.imageSmoothingEnabled = false;

let app = new Picture(canvas, ctx, currentColor);
localStorage.removeItem('piskelCloneResolution');
if (localStorage.getItem('piskelCloneResolution')) {
  size = +localStorage.getItem('piskelCloneResolution');
  [canvas.width, canvas.height] = [size, size];

  const currentRes = document.querySelector('.res-active');
  currentRes.classList.remove('res-active');
  const target = document.getElementById('res' + size);
  target.classList.add('res-active');
  if (localStorage.getItem('piskelCloneResolution') === 128) scale = 4;
  if (localStorage.getItem('piskelCloneResolution') === 256) scale = 2;
}
// **********   INITIALIZATION    ************ */
// Initialization process, loading prev image

window.addEventListener('load', app.windowReload(ctx));

window.onbeforeunload = () => app.localStorageSave();
// **********   and of INITIALIZATION    ************ */

// ********************       TOOLS       *******************/
let targetTool = 'pencil';
app.pencilTool(targetTool);

pane.addEventListener('click', e => {
  const targetToolEl = e.target.closest('li');
  if (targetToolEl === null) return;
  targetTool = targetToolEl.id;

  if (targetTool === 'empty') {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    targetTool = 'pencil';
  } else {
    const prevActiveTool = document.querySelector('.tool--active');
    prevActiveTool.classList.remove('tool--active');
    targetToolEl.classList.add('tool--active');
    app.tools(targetTool);
  }
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

// ********************    SAVE IMAGE    *********************/
const save = document.getElementById('save');
save.addEventListener('click', () => {
  app.saveCanvas(canvas);
});
// *****************  end of  SAVE IMAGE    ******************/

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
  localStorage.removeItem('piskelCloneResolution');
  switch (e.target.id) {
    case 'res128':
      size = 128;
      scale = 4;
      break;

    case 'res256':
      size = 256;
      scale = 2;
      break;

    case 'res512':
      size = 512;
      scale = 1;
      break;
  }

  localStorage.setItem('piskelCloneResolution', size);
  canvas.width = size;
  canvas.height = size;
  app.highlightCurrentResolution(e.target);
  app = new Picture(canvas, ctx, currentColor);

  dataURI = localStorage.getItem('piskelCloneImg');
  let img = new Image();
  img.onload = () => {
    this.ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0);
  };
  img.src = 'data:image/png;base64,'.concat(JSON.parse(dataURI));
  let [currentWidth, currentHeight] = [canvas.width, canvas.height];
  let [x, y] = [0, 0];
  img.onload = function() {
    if (img.naturalWidth > img.naturalHeight) {
      let scaleImg = img.naturalWidth / canvas.width;
      currentWidth = canvas.width;
      currentHeight = img.naturalHeight / scaleImg;
      x = 0;
      y = (canvas.height - currentHeight) / 2;
    } else if (img.naturalWidth === img.naturalHeight) {
      currentWidth = canvas.width;
      currentHeight = canvas.height;
    } else {
      let scaleImg = img.naturalHeight / canvas.height;
      currentWidth = img.naturalWidth / scaleImg;
      currentHeight = canvas.height;
      x = (canvas.width - currentWidth) / 2;
      y = 0;
    }

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, x, y, currentWidth, currentHeight);
  };
});

load.addEventListener('click', () => {
  city = cityChoiseInpit.value;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // getLinkToImage(city);
  let url =
    'https://images.unsplash.com/photo-1573848700501-f909e91dbe13?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80';

  app.downloadImage(url, canvas);
  const currentRes = document.querySelector('.res-active');
  currentRes.classList.remove('res-active');
  const target = document.getElementById('res512');
  target.classList.add('res-active');
});
