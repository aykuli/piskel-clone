import Tools from '../tools/Tools';
import { saveImgsInLocalStorage } from '../utils';
import {
  drawOnCanvas,
  frameDraw,
  frameHandler,
  frameDndHandler,
  frameAdd,
  frameDatasetCountSet,
} from '../frames/frame';
import { animate } from '../animation/animate';

export default class Controller {
  constructor(view, initPixelSize) {
    this.view = view;
    this.pixelSize = initPixelSize;
    this.currentCount = 0;
    this.piskelImg = [];
    this.fps = 0;
    this.penSize = 1;

    this.canvasResolutioWatch();
    this.canvasSizeWatch();
    this.tools = new Tools(this.view.canvas, this.view.ctx, this.view.primaryColor, this.pixelSize);

    this.init();

    this.paintTools(); // tools eventListener
    this.swapWatch(); // color swap eventListener
    this.keyboardShortCutHandler(); // keyboard eventListener
    this.frameWatch(); // frame active eventListener
    this.penSizes(); // pen size eventListener
    this.cursorOnCanvas();
    frameDndHandler(this.view.canvas, this.piskelImg, frameDatasetCountSet, drawOnCanvas); // frame drag and drop listener

    animate(
      i => {
        drawOnCanvas(this.view.preview, this.piskelImg[i]);
      },
      this.view.fps,
      this.view.fpsValue,
      this.piskelImg
    );
  }

  init() {
    this.currentCount =
      localStorage.getItem('piskelCounter') !== null ? localStorage.getItem('piskelCounter') : this.currentCount;

    // get image from Local Storage if exists
    if (localStorage.getItem('piskelImg') !== null) {
      this.piskelImg = JSON.parse(localStorage.getItem('piskelImg'));
      this.view.renderFrames(this.piskelImg, this.currentCount);

      for (let i = 0; i < this.piskelImg.length; i++) {
        const frame = this.view.framesList.children[i].children[0];
        drawOnCanvas(frame, this.piskelImg[i]);
      }
      drawOnCanvas(this.view.canvas, this.piskelImg[this.currentCount]);
    } else {
      this.view.renderFrameActive(0, this.piskelImg, this.view.framesList);
    }

    // get user fps from localStorage
    if (localStorage.getItem('piskelFps') !== null) {
      this.fps = localStorage.getItem('piskelFps');
      this.view.fps.value = +localStorage.getItem('piskelFps');
    } else {
      this.fps = this.view.fps.value;
      localStorage.setItem('piskelFps', this.fps);
    }
    this.view.fpsValue.innerText = localStorage.getItem('piskelFps');
    if (+this.fps === 0 || this.piskelImg.length !== 0) {
      drawOnCanvas(this.view.preview, this.piskelImg[this.currentCount]);
    } else {
      animate(
        i => {
          drawOnCanvas(this.view.preview, this.piskelImg[i]);
        },
        this.view.fps,
        this.view.fpsValue,
        this.piskelImg
      );
    }
  }

  canvasSizeWatch() {
    // set pixel size at app page loading
    if (localStorage.getItem('piskelPixelSize') !== null) {
      this.pixelSize = Number(localStorage.getItem('piskelPixelSize'));
      const target = document.querySelector(`.resolution--res${this.view.canvas.width / this.pixelSize}`);
      this.view.highlightTarget(target, 'resolution__btn--active');
    }

    this.view.setCanvasWrapSize();

    window.addEventListener('resize', e => this.view.setCanvasWrapSize());
  }

  canvasResolutioWatch() {
    this.view.resBtns.addEventListener('click', e => {
      if (e.target.tagName === 'BUTTON') {
        this.pixelSize = this.view.canvas.width / e.target.dataset.size;
        this.view.highlightTarget(e.target, 'resolution__btn--active');
        localStorage.removeItem('piskelPixelSize');
        localStorage.setItem('piskelPixelSize', this.pixelSize);

        drawOnCanvas(this.view.canvas, this.piskelImg[this.currentCount]);
      }
    });
  }

  frameWatch() {
    this.view.framesList.addEventListener('click', e => {
      if (this.view.framesList.children.length === 1) return;
      const frameDelBtns = Array.from(document.querySelectorAll('.frame__btn--delete'));

      switch (e.target.className) {
        case frameDelBtns[0].className:
          const count = e.target.parentNode.children[0].dataset.count;

          // remove LI of deleted frame and all of it's children
          e.target.parentNode.remove();

          // remove correspond img data in piskelImg array and refresh localStorage
          this.piskelImg.splice(count, 1);
          localStorage.removeItem(`piskelImg`);
          localStorage.setItem(`piskelImg`, JSON.stringify(this.piskelImg));

          // refresh frames count
          frameDatasetCountSet();

          //set active frame if it was deleted
          const frameActive = document.querySelector('.frame__active');
          if (frameActive === null) {
            drawOnCanvas(this.view.canvas, this.piskelImg[0]);
            this.view.framesList.children[0].classList.add('frame__active');
          }
          break;
        default:
          this.currentCount = frameHandler(
            e,
            this.view.canvas,
            this.piskelImg,
            drawOnCanvas,
            this.view.preview,
            this.fps
          );
          localStorage.removeItem('piskelCounter');
          localStorage.setItem('piskelCounter', this.currentCount);
      }
    });

    this.view.frameAddBtn.addEventListener('click', () => {
      this.currentCount = frameAdd(this.view.renderFrameActive, this.view.framesList, this.view.canvas, this.piskelImg);
    });

    this.view.canvas.addEventListener('mouseup', () => {
      saveImgsInLocalStorage(this.piskelImg, this.view.canvas, this.currentCount);
      frameDraw(this.piskelImg, this.currentCount);
    });

    this.view.canvas.addEventListener('mouseleave', () => {
      saveImgsInLocalStorage(this.piskelImg, this.view.canvas, this.currentCount);
      frameDraw(this.piskelImg, this.currentCount);
    });
  }

  swapWatch() {
    // set swaper color at app loading
    // get user colors from Local Storage if exists
    if (localStorage.getItem('piskelPrimaryColor') !== null) {
      this.view.primaryColor.value = localStorage.getItem('piskelPrimaryColor');
    } else {
      localStorage.setItem('piskelPrimaryColor', this.view.primaryColor.value);
    }
    if (localStorage.getItem('piskelSecondaryColor') !== null) {
      this.view.secondaryColor.value = localStorage.getItem('piskelSecondaryColor');
    } else {
      localStorage.setItem('piskelSecondaryColor', this.view.secondaryColor.value);
    }

    this.view.swapColor.addEventListener('click', this.swapHandler.bind(this));
  }

  swapHandler() {
    const buf = this.view.primaryColor.value;
    this.view.primaryColor.value = this.view.secondaryColor.value;

    this.view.secondaryColor.value = buf;
    this.view.ctx.fillStyle = this.view.primaryColor.value;
    localStorage.removeItem('piskelPrimaryColor');
    localStorage.setItem('piskelPrimaryColor', this.view.primaryColor.value);
    localStorage.removeItem('piskelSecondaryColor');
    localStorage.setItem('piskelSecondaryColor', this.view.secondaryColor.value);
  }

  paintTools() {
    // get drawing tool from Local Storage if exists
    if (localStorage.getItem('piskelTool') === null) {
      this.targetTool = 'pencil';
      this.tools.pencilTool(this.targetTool);
      localStorage.setItem('piskelTool', this.targetTool);
    } else {
      this.targetTool = localStorage.getItem('piskelTool');
      this.view.highlightTarget(document.querySelector(`#${this.targetTool}`), 'tool--active');
      this.tools.toolHandler(this.targetTool);
    }

    this.view.tools.addEventListener('click', e => {
      const targetToolEl = e.target.closest('li');
      if (targetToolEl === null) return;
      this.targetTool = targetToolEl.id;

      switch (this.targetTool) {
        case 'empty':
          this.tools.clearCanvas(this.piskelImg, this.currentCount);
          frameDraw(this.piskelImg, this.currentCount);
          break;
        default:
          this.view.highlightTarget(document.querySelector(`#${this.targetTool}`), 'tool--active');
          this.tools.toolHandler(this.targetTool);
      }
    });
  }

  penSizes() {
    // get pen size from local|Storage when app loaded
    if (localStorage.getItem('piskelPenSize') !== null) {
      this.pixelSize = Number(localStorage.getItem('piskelPenSize'));
      this.penSize = localStorage.getItem('piskelPenSize');
      for (let i = 0; i < this.view.penSizes.children.length; i++) {
        if (this.view.penSizes.children[i].dataset.size === this.penSize) {
          this.view.highlightTarget(this.view.penSizes.children[i], 'pen-size--active');
        }
      }
    }

    this.view.penSizes.addEventListener('click', e => {
      if (e.target.tagName === 'LI') {
        this.view.highlightTarget(e.target, 'pen-size--active');
        this.penSize = e.target.dataset.size;
        localStorage.removeItem('piskelPenSize');
        localStorage.setItem('piskelPenSize', this.penSize);
      }
    });
  }

  keyboardShortCutHandler() {
    document.addEventListener('keydown', e => {
      switch (e.code) {
        case 'KeyB':
          e.preventDefault();
          this.targetTool = 'bucket';
          break;
        case 'KeyC':
          e.preventDefault();
          this.targetTool = 'picker';
          break;
        case 'KeyE':
          e.preventDefault();
          this.targetTool = 'eraser';
          break;
        case 'KeyP':
          e.preventDefault();
          this.targetTool = 'pencil';
          break;

        case 'KeyZ':
          e.preventDefault();
          this.tools.clearCanvas(this.piskelImg, this.currentCount);
          frameDraw(this.piskelImg, this.currentCount);
          break;
        case 'KeyX':
          e.preventDefault();
          this.swapHandler();
          break;
        default:
          return;
      }

      if (this.targetTool !== 'empty') {
        this.view.highlightTarget(document.querySelector(`#${this.targetTool}`), 'tool--active');
        this.tools.toolHandler(this.targetTool);
      }
    });
  }

  cursorOnCanvas() {
    // this.view.canvas.addEventListener('mousemove', e => {
    //   if (!this.tools.isDrawing) {
    //     // console.log(this.tools.isDrawing);
    //     // console.log('this.view.canvas.addEventListener(mousemove)');
    //     // console.log(e.offsetX);
    //     // console.log(this.view.canvas.parentNode.style.width);
    //     const penSize = localStorage.getItem('piskelPenSize') !== null ? +localStorage.getItem('piskelPenSize') : 1;
    //     const pixelSize =
    //       localStorage.getItem('piskelPixelSize') !== null ? +localStorage.getItem('piskelPixelSize') : 1;
    //     const scale = this.view.canvas.parentNode.style.width.slice(0, -2) / this.view.canvas.width;
    //     console.log('scale: ', scale);
    //     this.view.cursor.style.width = `${penSize * pixelSize * scale}px`;
    //     this.view.cursor.style.height = `${penSize * pixelSize * scale}px`;
    //     const x = Math.round(e.offsetX / pixelSize) * pixelSize;
    //     const y = Math.round(e.offsetY / pixelSize) * pixelSize;
    //     this.view.cursor.style.top = `${y - (penSize * pixelSize * scale) / 2}px`;
    //     this.view.cursor.style.left = `${x - (penSize * pixelSize * scale) / 2}px`;
    //   }
    // });
    // this.view.cursor.addEventListener('click', () => {
    //   console.log('click on cursor');
    //   this.tools.isDrawing = true;
    //   this.view.cursor.style.width = 0;
    //   this.view.cursor.style.height = 0;
    // });
  }
}
