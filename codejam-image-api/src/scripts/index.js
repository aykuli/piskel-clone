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

  saveInLocalStorage(localStorageKey) {
    console.log('saving in localStorage ', localStorageKey);
    localStorage.removeItem(localStorageKey);

    const dataURI = this.canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
    localStorage.setItem(localStorageKey, JSON.stringify(dataURI));
  }

  insertFromLocalStorage(localStorageKey) {
    const dataURI = localStorage.getItem(localStorageKey);
    return 'data:image/png;base64,'.concat(JSON.parse(dataURI));
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
    this.saveInLocalStorage('piskelCloneImg');
  };

  pencilTool = targetTool => {
    if (targetTool === 'pencil') {
      console.log(targetTool);
      this.canvas.addEventListener('mousemove', this.draw);
      this.canvas.addEventListener('mousedown', this.drawOnMouseDown);
      this.canvas.addEventListener('mouseup', this.drawMouseUp);
      this.canvas.addEventListener('mouseout', () => {
        this.isDrawing = false;
      });
    } else {
      console.log(targetTool);
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

    let [x, y] = [Math.ceil(e.offsetX / scale), Math.ceil(e.offsetY / scale)];

    const targetColor = this.RGBToHex(this.ctx.getImageData(x, y, 1, 1).data);
    let replacementColor = this.currentColor.value;
    if (targetColor === replacementColor) return;
    this.ctx.fillStyle = replacementColor;
    this.ctx.fillRect(x, y, 1, 1);
    let Queue = [];

    let xy = [x, y];
    Queue.push(xy);
    let i = 0;
    while (Queue.length > 0) {
      i++;
      if (i === 100000) return;
      xy = [x, y];
      let xPlus1y = [x + 1, y];
      if (
        x + 1 > 0 &&
        x + 1 < this.canvas.width &&
        targetColor === this.RGBToHex(this.ctx.getImageData(x + 1, y, 1, 1).data)
      ) {
        Queue.push(xPlus1y);
        this.ctx.fillRect(x + 1, y, 1, 1);
      }

      if (
        x - 1 > 0 &&
        x - 1 < this.canvas.width &&
        targetColor === this.RGBToHex(this.ctx.getImageData(x - 1, y, 1, 1).data)
      ) {
        Queue.push([x - 1, y]);
        this.ctx.fillRect(x - 1, y, 1, 1);
      }

      if (
        y + 1 > 0 &&
        y + 1 < this.canvas.width &&
        targetColor === this.RGBToHex(this.ctx.getImageData(x, y + 1, 1, 1).data)
      ) {
        Queue.push([x, y + 1]);
        this.ctx.fillRect(x, y + 1, 1, 1);
      }

      if (
        y - 1 > 0 &&
        y - 1 < this.canvas.width &&
        targetColor === this.RGBToHex(this.ctx.getImageData(x, y - 1, 1, 1).data)
      ) {
        Queue.push([x, y - 1]);
        this.ctx.fillRect(x, y - 1, 1, 1);
      }

      Queue.shift(0);
      if (Queue.length > 0) {
        x = Queue[0][0];
        y = Queue[0][1];
      }
    }
    Queue = [];
  };

  watchColor(prevColor, newColor) {
    const prevChild = prevColor.children[0];
    prevChild.style.background = this.ctx.fillStyle;
    this.prevColorCache = this.ctx.fillStyle;
    this.ctx.fillStyle = newColor;
    this.currentColor.value = newColor;
  }

  pickerTool(targetTool) {
    console.log(targetTool);
    if (targetTool === 'picker') {
      this.canvas.addEventListener('click', this.colorPicker);
    } else {
      this.canvas.removeEventListener('click', this.colorPicker);
    }
  }

  RGBToHex(data) {
    let dataHex = '#';
    for (let i = 0; i < 3; i += 1) {
      let color = data[i];
      let letter = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
      let firstLetter = letter[Math.floor(color / 16)];
      let secondLetter = letter[color % 16];
      dataHex = dataHex + firstLetter + secondLetter;
    }
    return dataHex;
  }

  colorPicker = e => {
    const [x, y] = [Math.ceil(e.offsetX / scale), Math.ceil(e.offsetY / scale)];
    const choosedColor = this.ctx.getImageData(x, y, 1, 1);
    var data = choosedColor.data;
    var color = this.RGBToHex(data);

    this.ctx.fillStyle = color;
    this.currentColor.value = color;
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
      app.saveInLocalStorage('piskelCloneImg');
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

  grayscale() {
    var imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
      var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
    }
    this.ctx.putImageData(imageData, 0, 0);
  }
}

function getLinkToImage(city) {
  let url = `https://api.unsplash.com/photos/random?query=town,${city}&client_id=e2077ad31a806c894c460aec8f81bc2af4d09c4f8104ae3177bb809faf0eac17`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data.urls.regular);
      app.downloadImage(data.urls.regular, canvas);
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

const grayScaleBtn = document.getElementById('grayScale');

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

window.onbeforeunload = () => app.saveInLocalStorage('piskelCloneImg');
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
  } else if (targetTool === 'grayscale') {
    app.grayscale();
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
  app.saveInLocalStorage('piskelCloneImg');
  localStorage.setItem('piskelCloneResolution', size);
  canvas.width = size;
  canvas.height = size;
  app.highlightCurrentResolution(e.target);

  let img = new Image();
  img.onload = () => {
    this.ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0);
  };
  img.src = app.insertFromLocalStorage('piskelCloneImg');
  let [currentWidth, currentHeight] = [canvas.width, canvas.height];
  let [x, y] = [0, 0];
  img.onload = function () {
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
  console.log(city);
  getLinkToImage(city);

  // this block of code when unsplash limit of 50 downloads end
  // let url =
  //   'https://image.shutterstock.com/z/stock-vector-vector-illustration-in-simple-flat-linear-style-with-smiling-cartoon-characters-teamwork-and-1369217765.jpg';

  // app.downloadImage(url, canvas);
  // this block of code when unsplash limit of 50 downloads end

  const currentRes = document.querySelector('.res-active');
  currentRes.classList.remove('res-active');
  const target = document.getElementById('res512');
  target.classList.add('res-active');
  scale = 1;
  size = 512;
});
