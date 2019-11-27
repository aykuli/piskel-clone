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
let isImgLoaded;

if (localStorage.getItem('isImgLoaded') === null) {
  isImgLoaded = false;
} else {
  isImgLoaded = localStorage.getItem('isImgLoaded') === 'true';
}

const modalLoadImg = document.querySelector('.modal__no-image');
const modalOverlay = document.querySelector('.modal__overlay');

function popupToggle(isToAdd) {
  if (!isImgLoaded) {
    modalLoadImg.classList.remove('display-block');
    modalOverlay.classList.remove('display-block');
  }
  if (isToAdd) {
    modalLoadImg.classList.add('display-block');
    modalOverlay.classList.add('display-block');
  }
}

const generalSize = 512;
// Creating app
const app = new Picture(canvas, ctx, currentColor, generalSize, prevColor);

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
      localStorage.removeItem('isImgLoaded');
      localStorage.setItem('isImgLoaded', 'false');
      targetTool = 'pencil';
      break;
    case 'grayscale':
      isImgLoaded ? app.grayscale() : popupToggle(true);
      break;
    default:
      prevActiveTool.classList.remove('tool--active');
      targetToolEl.classList.add('tool--active');
      app.tools(targetTool);
  }
});

// modal popup appear when user click on grayscale but image of city doesn't loaded yet
modalOverlay.addEventListener('click', () => popupToggle(false));

// color managing
const constColorPalette = ['#f74242', '#316cb9'];

colorRed.addEventListener('click', () => app.watchColor(constColorPalette[0]));
colorBlue.addEventListener('click', () => app.watchColor(constColorPalette[1]));
prevColor.addEventListener('click', () => app.watchColor(currentColor.value));
currentColor.addEventListener('change', () => app.watchColor(currentColor.value));

// saving image on hard drive
const save = document.querySelector('#save');
save.addEventListener('click', () => app.saveCanvas());

// keyboard shortcuts
window.addEventListener('keydown', e => {
  switch (e.code) {
    case 'KeyB':
      e.preventDefault();
      targetTool = 'bucket';
      break;
    case 'KeyP':
      e.preventDefault();
      targetTool = 'pencil';
      break;
    case 'KeyC':
      e.preventDefault();
      targetTool = 'picker';
      break;
    case 'Escape':
      popupToggle(false);
      break;
    default:
      return;
  }
  if (targetTool !== 'grayscale') {
    const targetToolEl = document.querySelector(`#${targetTool}`);
    const prevActiveTool = document.querySelector('.tool--active');
    prevActiveTool.classList.remove('tool--active');
    targetToolEl.classList.add('tool--active');
    app.tools(targetTool);
  }
});

// user changing canvas resolution

const canvasResolution = document.querySelector('.canvas__resolution');
canvasResolution.addEventListener('click', e => app.canvasResolutionChanging(e, generalSize));

// user load image from unsplash
load.addEventListener('click', () => {
  const city = cityChoiseInpit.value;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  app.getLinkToImage(city);
  // when limit on unsplash.com ends this block of code can help to view functionality
  // const url =
  //   'https://image.shutterstock.com/z/stock-vector-vector-illustration-in-simple-flat-linear-style-with-smiling-cartoon-characters-teamwork-and-1369217765.jpg';

  // app.downloadImage(url);
  isImgLoaded = true;
  localStorage.removeItem('isImgLoaded');
  localStorage.setItem('isImgLoaded', 'true');
});
