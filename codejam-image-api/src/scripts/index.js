import Picture from './Picture';

// Taking elements from index.html
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const paneTools = document.querySelector('.pane__tools');
const currentColor = document.querySelector('#currentColor');
const prevColor = document.querySelector('#prevColor');
const colorRed = document.querySelector('.color--red');
const colorBlue = document.querySelector('.color--blue');

const cityChoiseInpit = document.querySelector('#cityChoiseInpit');
const load = document.querySelector('#load');

ctx.imageSmoothingEnabled = false;
let isImgLoaded = false;

const modalLoadImg = document.querySelector('.modal__no-image');
const modalOverlay = document.querySelector('.modal__overlay');

function removePopup() {
  if (!isImgLoaded) {
    modalLoadImg.classList.remove('display-block');
    modalOverlay.classList.remove('display-block');
  }
}

const sizes = [512, 256, 128];
// Creating app
const app = new Picture(canvas, ctx, currentColor, sizes[0], prevColor);

window.addEventListener('load', app.windowReload());

window.onbeforeunload = () => app.saveInLocalStorage('piskelCloneImg');

// default tool, when user comes fisrt time on page
// and his localStorage don't have 'piskelCloneImg' and 'piskelCloneResolution'
let targetTool = 'pencil';
app.pencilTool(targetTool);

// pane tools
paneTools.addEventListener('click', e => {
  const targetToolEl = e.target.closest('li');

  if (targetToolEl === null) return;
  targetTool = targetToolEl.id;
  const prevActiveTool = document.querySelector('.tool--active');

  switch (targetTool) {
    case 'empty':
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      isImgLoaded = false;
      targetTool = 'pencil';
      break;
    case 'grayscale':
      if (isImgLoaded) app.grayscale();
      else {
        modalLoadImg.classList.add('display-block');
        modalOverlay.classList.add('display-block');
      }
      break;
    default:
      prevActiveTool.classList.remove('tool--active');
      targetToolEl.classList.add('tool--active');
      app.tools(targetTool);
  }
});

// modal popup appear when user click on grayscale but image of city doesn't loaded yet
modalOverlay.addEventListener('click', removePopup);

// color managing
const constColorPalette = ['#f74242', '#316cb9'];

colorRed.addEventListener('click', () => app.watchColor(constColorPalette[0]));
colorBlue.addEventListener('click', () => app.watchColor(constColorPalette[1]));
prevColor.addEventListener('click', () => app.watchColor(currentColor.value));
currentColor.addEventListener('change', () => app.watchColor(currentColor.value));

// saving image on hard drive
const save = document.querySelector('#save');
save.addEventListener('click', app.saveCanvas);

// keyboard shortcuts
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
      removePopup();
      break;
    default:
      return;
  }
  const targetToolEl = document.querySelector(`#${targetTool}`);
  const prevActiveTool = document.querySelector('.tool--active');
  prevActiveTool.classList.remove('tool--active');
  targetToolEl.classList.add('tool--active');
  app.tools(targetTool);
});

// user changing canvas resolution
const canvasResolution = document.querySelector('.canvas__resolution');
canvasResolution.addEventListener('click', e => {
  localStorage.removeItem('piskelCloneResolution');
  switch (e.target.id) {
    case 'res128':
      [, , app.size] = sizes;
      break;

    case 'res256':
      [, app.size] = sizes;
      break;

    default:
      [app.size] = sizes;
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
  img.addEventListener('load', () => {
    this.ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0);
  });

  const dataURI = localStorage.getItem('piskelCloneImg');
  img.src = 'data:image/png;base64,'.concat(JSON.parse(dataURI));

  let [currentWidth, currentHeight] = [canvas.width, canvas.height];
  let [x, y] = [0, 0];
  img.addEventListener('load', () => {
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
  });
});

// user load image from unsplash
load.addEventListener('click', () => {
  const city = cityChoiseInpit.value;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // app.getLinkToImage(city);
  // when limit on unsplash.com ends this block of code can help to view functionality
  const url =
    'https://image.shutterstock.com/z/stock-vector-vector-illustration-in-simple-flat-linear-style-with-smiling-cartoon-characters-teamwork-and-1369217765.jpg';

  app.downloadImage(url);

  isImgLoaded = true;
});
