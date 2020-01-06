import Tools from '../tools/Tools';
import { toolsMap } from '../tools/toolsMap';
import { saveImgsInLocalStorage } from '../utils';
import {
  drawOnCanvas,
  frameDraw,
  frameHandler,
  frameDndHandler,
  frameAdd,
  frameDatasetCountSet,
  frameCopy,
  frameDel,
} from '../frames/frame';
import { animate, animationFullscreen } from '../animation/animate';
import gifSave from '../appAction/gifSave';
import apngSave from '../appAction/apngSave';

import { firebaseInit, authWithFirebase } from '../authentification/firebaseFromGoogle';

export default class Controller {
  constructor(view, options) {
    this.view = view;
    [this.pixelSize, this.currentCount, this.fps, this.penSize, this.piskelImg] = options;

    this.swapWatch(); // color swap eventListener
    this.canvasResolutioWatch();
    this.canvasSizeWatch();
    this.tools = new Tools(this.view.canvas, this.view.ctx, this.view.primaryColor, this.pixelSize);

    this.init();

    this.paintTools(); // tools eventListener

    this.keyboardShortCutHandler(); // keyboard eventListener
    this.frameWatch(); // frame active eventListener
    this.penSizes(); // pen size eventListener
    this.cursorOnCanvas();
    this.framesScroll();
    frameDndHandler(this.view.canvas, this.piskelImg, frameDatasetCountSet, drawOnCanvas); // frame drag and drop listener

    animate(
      i => {
        drawOnCanvas(this.view.preview, this.piskelImg[i]);
      },
      this.piskelImg,
      this.fpsWatch,
      false
    );

    this.clearSession();
    animationFullscreen(this.view.fullscreenBtn, this.view.preview);
    this.saveBtnsWatch();
    this.authWatch();
  }

  init() {
    const lSCount = localStorage.getItem('piskelCounter');
    this.currentCount = lSCount !== null && lSCount !== 'undefined' ? lSCount : this.currentCount;

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
      this.view.fps.value = this.fps;
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
        this.piskelImg,
        this.fpsWatch,
        false
      );
    }

    firebaseInit();
  }

  authWatch() {
    this.view.authLoginBtn.addEventListener('click', () => {
      authWithFirebase(this.view.authName, this.view.authPhoto, this.view.authLoginBtn, this.view.authLogoutBtn);
    });
  }

  fpsWatch = (draw, animateFrame) => {
    this.view.fps.addEventListener('input', () => {
      this.view.fpsValue.innerText = this.view.fps.value;
      let fps = this.view.fps.value;
      localStorage.removeItem('piskelFps');
      localStorage.setItem('piskelFps', fps);

      if (+fps !== 0) {
        requestAnimationFrame(animateFrame);
      } else {
        const currentCount = localStorage.getItem('piskelCounter');
        draw(currentCount);
      }
    });
  };

  saveBtnsWatch() {
    this.view.saveBtns.addEventListener('click', e => {
      switch (e.target.dataset.save) {
        case 'gif':
          gifSave(this.view.canvas);
          break;
        case 'apng':
          apngSave(this.view.canvas);
          break;
        default:
          return;
      }
    });
  }

  framesScroll() {
    // document.body.style.overflow = 'hidden';
    console.log(
      '\ndocument.body.scrollHeight: ',
      document.body.scrollHeight,
      '\ndocument.documentElement.scrollHeight: ',
      document.documentElement.scrollHeight,
      '\ndocument.body.offsetHeight: ',
      document.body.offsetHeight,
      '\ndocument.documentElement.offsetHeight: ',
      document.documentElement.offsetHeight,
      '\ndocument.body.clientHeight: ',
      document.body.clientHeight,
      '\ndocument.documentElement.clientHeight: ',
      document.documentElement.clientHeight
    );
    let sLeft = this.view.framesList.scrollBottom;
    if (this.view.framesList.clientHeight > document.body.clientHeight) {
      console.log('ono');
      this.view.framesList.style.overflowY = 'auto';
      this.view.framesList.style.overflowX = 'hidden';
    }
    // console.log(this.view.framesList.clientHeight);
  }

  canvasSizeWatch() {
    // set pixel size at app page loading
    if (localStorage.getItem('piskelPixelSize') !== null) {
      this.pixelSize = Number(localStorage.getItem('piskelPixelSize'));
      const target = document.querySelector(`.resolution--res${this.view.canvas.width / this.pixelSize}`);
      console.log(target);
      this.view.highlightTarget(target, 'resolution__btn--active');
      console.log(target);
    }

    this.view.setCanvasWrapSize();

    window.addEventListener('resize', e => {
      this.view.setCanvasWrapSize();
    });
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
      if (e.target.className.includes('frame__btn--delete')) {
        console.log('до this.currentCount: ', this.currentCount);
        this.currentCount = frameDel(e.target, this.piskelImg, this.view.canvas, this.view.framesList);
        console.log('после this.currentCount: ', this.currentCount);
      } else if (e.target.className.includes('frame__btn--copy')) {
        this.currentCount = frameCopy(
          e.target,
          this.piskelImg,
          this.view.canvas,
          this.view.highlightTarget,
          frameDatasetCountSet,
          drawOnCanvas
        );
      } else {
        this.currentCount = frameHandler(
          e,
          this.view.canvas,
          this.piskelImg,
          drawOnCanvas,
          this.view.preview,
          this.fps
        );
      }
      localStorage.removeItem('piskelImg');
      localStorage.setItem('piskelImg', JSON.stringify(this.piskelImg));
      localStorage.removeItem('piskelCounter');
      localStorage.setItem('piskelCounter', this.currentCount);
    });

    this.view.frameAddBtn.addEventListener('click', () => {
      frameAdd(this.view.renderFrameActive, this.view.framesList, this.view.canvas, this.piskelImg);
      this.currentCount = +localStorage.getItem('piskelCounter');
    });

    this.view.canvas.addEventListener('mouseup', () => {
      saveImgsInLocalStorage(this.piskelImg, this.view.canvas, this.currentCount);
      frameDraw(this.piskelImg, this.currentCount);
    });
  }

  swapWatch() {
    // set swaper color at app loading or
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
    this.view.primaryColor.addEventListener('change', () => {
      localStorage.removeItem('piskelPrimaryColor');
      localStorage.setItem('piskelPrimaryColor', this.view.primaryColor.value);
    });

    this.view.secondaryColor.addEventListener('change', () => {
      localStorage.removeItem('piskelSecondaryColor');
      localStorage.setItem('piskelSecondaryColor', this.view.secondaryColor.value);
    });
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
      this.tools.toolHandler(this.targetTool, frameDraw);
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
          this.tools.toolHandler(this.targetTool, frameDraw);
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
      this.targetTool = toolsMap.has(e.code) ? toolsMap.get(e.code) : this.targetTool;

      if (e.code === 'KeyZ') {
        e.preventDefault();
        this.tools.clearCanvas(this.piskelImg, this.currentCount);
        frameDraw(this.piskelImg, this.currentCount);
      } else if (e.code === 'KeyX') {
        e.preventDefault();
        this.swapHandler();
      }

      if (this.targetTool !== 'empty') {
        this.view.highlightTarget(document.querySelector(`#${this.targetTool}`), 'tool--active');
        this.tools.toolHandler(this.targetTool, frameDraw);
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

  clearSession() {
    this.view.clearSessionBtn.addEventListener('click', () => {
      localStorage.removeItem('piskelImg');
      localStorage.removeItem('piskelPrimaryColor');
      localStorage.removeItem('piskelSecondaryColor');
      localStorage.removeItem('piskelTool');
      localStorage.removeItem('piskelFps');
      localStorage.removeItem('piskelCounter');
      location.reload();
    });
  }
}
