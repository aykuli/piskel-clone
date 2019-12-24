import Pencil from '../tools/Pencil/Pencil';
import popupToggle from '../modal/modal';
import View from '../View/View';

import { toolsHandler } from '../tools/tools';

export default class Controller {
  constructor(view) {
    this.init();
    toolsHandler(view.canvas, new Pencil(view.canvas, view.ctx));
  }

  init() {
    console.log('init process');
    // if (localStorage.getItem('isImgLoaded') === null) {
    //   localStorage.setItem('isImgLoaded', 'false');
    // }
    // const generalSize = 512;
    // // Creating app
    // const app = new Picture(view.canvas, view.ctx, currentColor, generalSize, prevColor);
    // window.addEventListener('load', app.windowReload());
    // window.onbeforeunload = () => app.saveInLocalStorage('piskelCloneImg');
    // default tool, when user comes fisrt time on page
    // and his localStorage don't have 'piskelCloneImg' and 'piskelCloneResolution'
    // let targetTool = 'pencil';
    // app.pencilTool(targetTool);
    // color managing
    // const constColorPalette = ['#f74242', '#316cb9'];
    // colorRed.addEventListener('click', () => app.watchColor(constColorPalette[0]));
    // colorBlue.addEventListener('click', () => app.watchColor(constColorPalette[1]));
    // prevColor.addEventListener('click', () => app.watchColor(currentColor.value));
    // currentColor.addEventListener('change', () => app.watchColor(currentColor.value));
    // // saving image on hard drive
    // const save = document.querySelector('#save');
    // save.addEventListener('click', () => app.saveCanvas());
    // // keyboard shortcuts
    // window.addEventListener('keydown', e => {
    //   switch (e.code) {
    //     case 'KeyB':
    //       e.preventDefault();
    //       targetTool = 'bucket';
    //       break;
    //     case 'KeyP':
    //       e.preventDefault();
    //       targetTool = 'pencil';
    //       break;
    //     case 'KeyC':
    //       e.preventDefault();
    //       targetTool = 'picker';
    //       break;
    //     case 'Escape':
    //       popupToggle();
    //       break;
    //     default:
    //       return;
    //   }
    //   if (targetTool !== 'grayscale') {
    //     const targetToolEl = document.querySelector(`#${targetTool}`);
    //     const prevActiveTool = document.querySelector('.tool--active');
    //     prevActiveTool.classList.remove('tool--active');
    //     targetToolEl.classList.add('tool--active');
    //     app.tools(targetTool);
    //   }
    // });
    // // user changing canvas resolution
    // const handleOnload = ({ target: img }) => {
    //   let [currentWidth, currentHeight] = [canvas.width, canvas.height];
    //   let [x, y] = [0, 0];
    //   if (img.naturalWidth > img.naturalHeight) {
    //     const scaleImg = img.naturalWidth / canvas.width;
    //     currentWidth = canvas.width;
    //     currentHeight = img.naturalHeight / scaleImg;
    //     x = 0;
    //     y = (canvas.height - currentHeight) / 2;
    //   } else if (img.naturalWidth === img.naturalHeight) {
    //     currentWidth = canvas.width;
    //     currentHeight = canvas.height;
    //   } else {
    //     const scaleImg = img.naturalHeight / canvas.height;
    //     currentWidth = img.naturalWidth / scaleImg;
    //     currentHeight = canvas.height;
    //     x = (canvas.width - currentWidth) / 2;
    //     y = 0;
    //   }
    //   ctx.imageSmoothingEnabled = false;
    //   ctx.drawImage(img, x, y, currentWidth, currentHeight);
    // };
    // const canvasResolution = document.querySelector('.canvas__resolution');
    // canvasResolution.addEventListener('click', e => {
    //   localStorage.removeItem('piskelCloneResolution');
    //   const ratio = Number(e.target.dataset.ratio);
    //   app.size = generalSize / ratio;
    //   app.saveInLocalStorage('piskelCloneImg');
    //   localStorage.setItem('piskelCloneResolution', app.size);
    //   [canvas.width, canvas.height] = [app.size, app.size];
    //   const currentRes = document.querySelector('.res-active');
    //   currentRes.classList.remove('res-active');
    //   e.target.classList.add('res-active');
    //   const img = new Image();
    //   const dataURI = localStorage.getItem('piskelCloneImg');
    //   img.src = `data:image/png;base64,${dataURI}`;
    //   img.onload = handleOnload;
    // });
    // // user load image from unsplash
    // load.addEventListener('click', () => {
    //   const city = cityChoiseInpit.value;
    //   ctx.clearRect(0, 0, canvas.width, canvas.height);
    //   // app.getLinkToImage(city);
    //   // when limit on unsplash.com ends this block of code can help to view functionality
    //   const url =
    //     'https://image.shutterstock.com/z/stock-vector-vector-illustration-in-simple-flat-linear-style-with-smiling-cartoon-characters-teamwork-and-1369217765.jpg';
    //   app.downloadImage(url);
    //   localStorage.removeItem('isImgLoaded');
    //   localStorage.setItem('isImgLoaded', 'true');
    // });
  }
}
