import Picture from './Picture.js';
// Taking elements from index.html
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const pane = document.querySelector('.pane');
const currentColor = document.getElementById('currentColor');
const prevColor = document.querySelector('.color--prev');
const colorRed = document.querySelector('.color--red');
const colorBlue = document.querySelector('.color--blue');
const prevColorCache = '#ffffff';
prevColor.children[0].style.background = '#ffffff';
const cityChoiseInpit = document.getElementById('cityChoiseInpit');
const load = document.getElementById('load');
ctx.imageSmoothingEnabled = false;
let isImgLoaded = false;
const modalLoadImg = document.querySelector('.modal__no-image');
const modalOverlay = document.querySelector('.modal__overlay');

// Creating app
const app = new Picture(canvas, ctx, currentColor, 1, 512);

window.addEventListener('load', app.windowReload());

window.onbeforeunload = () => app.saveInLocalStorage('piskelCloneImg');

let targetTool = 'pencil';
app.pencilTool(targetTool);

pane.addEventListener('click', e => {
  const targetToolEl = e.target.closest('li');
  if (targetToolEl === null) return;
  targetTool = targetToolEl.id;

  if (targetTool === 'empty') {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    isImgLoaded = false;
    targetTool = 'pencil';
  } else if (targetTool === 'grayscale') {
    if (isImgLoaded) {
      app.grayscale();
    } else {
      modalLoadImg.classList.add('display-block');
      modalOverlay.classList.add('display-block');
    }
  } else {
    const prevActiveTool = document.querySelector('.tool--active');
    prevActiveTool.classList.remove('tool--active');
    targetToolEl.classList.add('tool--active');
    app.tools(targetTool);
  }
});

modalOverlay.addEventListener('click', () => {
  modalLoadImg.classList.remove('display-block');
  modalOverlay.classList.remove('display-block');
});

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

const save = document.getElementById('save');
save.addEventListener('click', () => {
  app.saveCanvas();
});

window.addEventListener('keydown', e => {
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
    case 'Escape':
      if (!isImgLoaded) {
        modalLoadImg.classList.remove('display-block');
        modalOverlay.classList.remove('display-block');
      }
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

const canvasResolution = document.querySelector('.canvas__resolution');
canvasResolution.addEventListener('click', e => {
  localStorage.removeItem('piskelCloneResolution');
  switch (e.target.id) {
    case 'res128':
      app.size = 128;
      app.scale = 4;
      break;

    case 'res256':
      app.size = 256;
      app.scale = 2;
      break;

    default:
      app.size = 512;
      app.scale = 1;
      break;
  }
  app.saveInLocalStorage('piskelCloneImg');
  localStorage.setItem('piskelCloneResolution', app.size);
  canvas.width = app.size;
  canvas.height = app.size;
  const currentRes = document.querySelector('.res-active');
  currentRes.classList.remove('res-active');
  e.target.classList.add('res-active');

  const img = new Image();
  img.onload = () => {
    this.ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0);
  };

  const dataURI = localStorage.getItem('piskelCloneImg');
  img.src = 'data:image/png;base64,'.concat(JSON.parse(dataURI));

  let [currentWidth, currentHeight] = [canvas.width, canvas.height];
  let [x, y] = [0, 0];
  img.onload = () => {
    if (img.naturalWidth > img.naturalHeight) {
      const scaleImg = img.naturalWidth / canvas.width;
      currentWidth = canvas.width;
      currentHeight = img.naturalHeight / scaleImg;
      x = 0;
      y = (canvas.height - currentHeight) / 2;
    } else if (img.naturalWidth === img.naturalHeight) {
      currentWidth = canvas.width;
      currentHeight = canvas.height;
    } else {
      const scaleImg = img.naturalHeight / canvas.height;
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
  const city = cityChoiseInpit.value;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  app.getLinkToImage(city);
  // when limit on unsplash.com ends this block of code can help to view functionality
  // let url =
  //   'https://image.shutterstock.com/z/stock-vector-vector-illustration-in-simple-flat-linear-style-with-smiling-cartoon-characters-teamwork-and-1369217765.jpg';

  // app.downloadImage(url);

  const currentRes = document.querySelector('.res-active');
  currentRes.classList.remove('res-active');
  const target = document.getElementById('res512');
  target.classList.add('res-active');
  app.scale = 1;
  app.size = 512;
  isImgLoaded = true;
});
