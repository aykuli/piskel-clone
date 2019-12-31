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

    this.canvasResolutioWatch();
    this.canvasSizeWatch();
    this.tools = new Tools(this.view.canvas, this.view.ctx, this.view.primaryColor, this.pixelSize);

    this.init();

    this.paintTools(); // tools eventListener
    this.swapWatch(); // color swap eventListener
    this.keyboardShortCutHandler(); // keyboard eventListener
    this.frameWatch(); // frame active eventListener
    this.penSizes(); // pen size eventListener
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
      const newFrame = document.createElement('LI');
      newFrame.className = 'frame__item frame__active';
      newFrame.innerHTML = `<canvas class="frame" data-count="${0}" width="100" height="100" draggable="true"></canvas><button class="frame__btn--delete tip" data-tooltip="Delete this frame"><span class="visually-hidden">Delete this canvas</span></button><span class="frame__number">${1}</span>`;
      this.view.framesList.append(newFrame);
      this.piskelImg.push('');
    }

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

    if (localStorage.getItem('piskelPixelSize') !== null) {
      this.pixelSize = Number(localStorage.getItem('piskelPixelSize'));
      console.log('this.pixelSize: ', this.pixelSize);
      const target = document.querySelector(`.resolution--res${this.view.canvas.width / this.pixelSize}`);
      console.log(target);
      this.view.highlightTarget(target, 'resolution__btn--active');
    }
    // console.log(
    //   'состояние localStorage после инициализации:\n localStorage.getItem(piskelCounter): ',
    //   localStorage.getItem('piskelCounter'),
    //   '\nlocalStorage.getItem(piskelImg): ',
    //   localStorage.getItem('piskelImg'),
    //   '\nlocalStorage.getItem(piskelFps): ',
    //   localStorage.getItem('piskelFps')
    // );
    // console.log(
    //   'начальное состояние всех переменных:\n this.currentCount: ',
    //   this.currentCount,
    //   '\nthis.piskelImg: ',
    //   this.piskelImg,
    //   '\nthis.fps: ',
    //   this.fps
    // );
  }

  canvasSizeWatch() {
    this.view.setCanvasSize();
    window.addEventListener('resize', e => this.view.setCanvasSize());
  }

  canvasResolutioWatch() {
    this.view.resBtns.addEventListener('click', e => {
      if (e.target.tagName === 'BUTTON') {
        this.pixelSize = this.view.canvas.width / e.target.dataset.size;
        this.view.highlightTarget(e.target, 'resolution__btn--active');
        localStorage.removeItem('piskelPixelSize');
        localStorage.setItem('piskelPixelSize', this.pixelSize);

        console.log('canvasResolutioWatch this.pixelSize: ', this.pixelSize);
        // [this.view.canvas.width, this.view.canvas.height] = [e.target.dataset.size, e.target.dataset.size];
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
          console.log('this.fps in frameWatch: ', this.fps);
          this.currentCount = frameHandler(
            e,
            this.view.canvas,
            this.piskelImg,
            drawOnCanvas,
            this.view.preview,
            this.fps
          );
          console.log('this.currentCount in frameWatch: ', this.currentCount);
          localStorage.removeItem('piskelCounter');
          localStorage.setItem('piskelCounter', this.currentCount);
      }
    });

    this.view.frameAddBtn.addEventListener('click', () => {
      console.log('frameAdd');
      this.currentCount = frameAdd(this.view.framesList, this.view.canvas, this.piskelImg);
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
    this.view.penSizes.addEventListener('click', e => {
      if (e.target.tagName === 'LI') {
        this.view.highlightTarget(e.target, 'pen-size--active');
        localStorage.removeItem('piskelPenSize');
        localStorage.setItem('piskelPenSize', e.target.dataset.size);
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
        case 'KeyP':
          e.preventDefault();
          this.targetTool = 'pencil';
          break;
        case 'KeyC':
          e.preventDefault();
          this.targetTool = 'picker';
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
}
