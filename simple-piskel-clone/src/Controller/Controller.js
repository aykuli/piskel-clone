// DOM elements changing functions
import { setCanvasWrapSize, renderFrames, renderFrameActive, highlightTarget } from '../components/dom/domUtils';

// tools
import Tools from '../components/tools/Tools';
import { toolsMap } from '../components/tools/toolsMap';

import { saveImgsInLocalStorage } from '../components/utils';

// work with frames
import {
  drawOnCanvas,
  frameDraw,
  frameHandler,
  frameDndHandler,
  frameAdd,
  frameDatasetCountSet,
  frameCopy,
  frameDel,
} from '../components/frames/frame';

// animation functions
import { animate, animationFullscreen } from '../components/animation/animate';

// export pictures
import gifSave from '../components/appAction/gifSave';
import apngSave from '../components/appAction/apngSave';

// session
import clearSession from '../components/sessionActions/sessionClear';

// auth
import {
  firebaseInit,
  loginGoogleAccount,
  logoutGoogleAccount,
} from '../components/authentification/firebaseFromGoogle';

export default class Controller {
  constructor(dom, options) {
    this.dom = dom;
    this.ctx = this.dom.canvas.getContext('2d');
    [this.pixelSize, this.currentCount, this.fps, this.penSize, this.piskelImg] = options;

    this.swapWatch(); // color swap eventListener
    this.canvasResolutionWatch(); // canvas resolution eventListener
    this.canvasSizeWatch();

    this.tools = new Tools(this.dom.canvas, this.ctx, this.dom.primaryColor, this.pixelSize);

    this.init();

    this.paintTools(); // tools eventListener
    this.keyboardShortCutHandler(); // keyboard eventListener
    this.frameWatch(); // frame active eventListener
    this.penSizes(); // pen size eventListener
    this.framesScroll();
    frameDndHandler(this.dom.canvas, this.piskelImg, frameDatasetCountSet, drawOnCanvas); // frame drag and drop listener

    animate(
      i => {
        drawOnCanvas(this.dom.preview, this.piskelImg[i]);
      },
      this.piskelImg,
      this.fpsWatch,
      false
    );

    this.eventListeners();
    animationFullscreen(this.dom.fullscreenBtn, this.dom.preview);
    this.saveBtnsWatch();

    // TODO: pixel that tracks the cursor
    // this.cursorOnCanvas();
  }

  init() {
    const lSCount = localStorage.getItem('piskelCounter');
    this.currentCount = lSCount !== null && lSCount !== 'undefined' ? lSCount : this.currentCount;

    // get image from Local Storage if exists
    if (localStorage.getItem('piskelImg') !== null) {
      this.piskelImg = JSON.parse(localStorage.getItem('piskelImg'));
      renderFrames(this.piskelImg, this.currentCount, this.dom.framesList);

      for (let i = 0; i < this.piskelImg.length; i++) {
        const frame = this.dom.framesList.children[i].children[0];
        drawOnCanvas(frame, this.piskelImg[i]);
      }
      drawOnCanvas(this.dom.canvas, this.piskelImg[this.currentCount]);
    } else {
      renderFrameActive(0, this.piskelImg, this.dom.framesList);
    }

    // get user fps from localStorage
    if (localStorage.getItem('piskelFps') !== null) {
      this.fps = localStorage.getItem('piskelFps');
      this.dom.fps.value = +localStorage.getItem('piskelFps');
    } else {
      this.dom.fps.value = this.fps;
      localStorage.setItem('piskelFps', this.fps);
    }
    this.dom.fpsValue.innerText = localStorage.getItem('piskelFps');
    if (+this.fps === 0 || this.piskelImg.length !== 0) {
      drawOnCanvas(this.dom.preview, this.piskelImg[this.currentCount]);
    } else {
      animate(
        i => {
          drawOnCanvas(this.dom.preview, this.piskelImg[i]);
        },
        this.piskelImg,
        this.fpsWatch,
        false
      );
    }

    firebaseInit();
  }

  fpsWatch = (draw, animateFrame) => {
    this.dom.fps.addEventListener('input', () => {
      this.dom.fpsValue.innerText = this.dom.fps.value;
      let fps = this.dom.fps.value;
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
    this.dom.saveBtns.addEventListener('click', e => {
      switch (e.target.dataset.save) {
        case 'gif':
          gifSave(this.dom.canvas);
          break;
        case 'apng':
          apngSave(this.dom.canvas);
          break;
        default:
          return;
      }
    });
  }

  // TODO make scroller for the frames when frames list number become a lot
  framesScroll() {
    // document.body.style.overflow = 'hidden';
    // console.log(
    //   '\ndocument.body.scrollHeight: ',
    //   document.body.scrollHeight,
    //   '\ndocument.documentElement.scrollHeight: ',
    //   document.documentElement.scrollHeight,
    //   '\ndocument.body.offsetHeight: ',
    //   document.body.offsetHeight,
    //   '\ndocument.documentElement.offsetHeight: ',
    //   document.documentElement.offsetHeight,
    //   '\ndocument.body.clientHeight: ',
    //   document.body.clientHeight,
    //   '\ndocument.documentElement.clientHeight: ',
    //   document.documentElement.clientHeight
    // );
    // let sLeft = this.dom.framesList.scrollBottom;
    // if (this.dom.framesList.clientHeight > document.body.clientHeight) {
    //   console.log('ono');
    //   this.dom.framesList.style.overflowY = 'auto';
    //   this.dom.framesList.style.overflowX = 'hidden';
    // }
    // console.log(this.dom.framesList.clientHeight);
  }

  canvasSizeWatch() {
    // set pixel size at app page loading
    if (localStorage.getItem('piskelPixelSize') !== null) {
      this.pixelSize = Number(localStorage.getItem('piskelPixelSize'));
      const target = document.querySelector(`.resolution--res${this.dom.canvas.width / this.pixelSize}`);
      console.log(target);
      highlightTarget(target, 'resolution__btn--active');
      console.log(target);
    }

    setCanvasWrapSize(this.dom.mainColumn, this.dom.canvas);

    window.addEventListener('resize', e => {
      setCanvasWrapSize(this.dom.mainColumn, this.dom.canvas);
    });
  }

  canvasResolutionWatch() {
    this.dom.resBtns.addEventListener('click', e => {
      if (e.target.tagName === 'BUTTON') {
        this.pixelSize = this.dom.canvas.width / e.target.dataset.size;
        highlightTarget(e.target, 'resolution__btn--active');
        localStorage.removeItem('piskelPixelSize');
        localStorage.setItem('piskelPixelSize', this.pixelSize);

        drawOnCanvas(this.dom.canvas, this.piskelImg[this.currentCount]);
      }
    });
  }

  frameWatch() {
    this.dom.framesList.addEventListener('click', e => {
      if (e.target.className.includes('frame__btn--delete')) {
        console.log('до this.currentCount: ', this.currentCount);
        this.currentCount = frameDel(e.target, this.piskelImg, this.dom.canvas, this.dom.framesList);
        console.log('после this.currentCount: ', this.currentCount);
      } else if (e.target.className.includes('frame__btn--copy')) {
        this.currentCount = frameCopy(
          e.target,
          this.piskelImg,
          this.dom.canvas,
          highlightTarget,
          frameDatasetCountSet,
          drawOnCanvas
        );
      } else {
        this.currentCount = frameHandler(e, this.dom.canvas, this.piskelImg, drawOnCanvas, this.dom.preview, this.fps);
      }
      localStorage.removeItem('piskelImg');
      localStorage.setItem('piskelImg', JSON.stringify(this.piskelImg));
      localStorage.removeItem('piskelCounter');
      localStorage.setItem('piskelCounter', this.currentCount);
    });

    this.dom.frameAddBtn.addEventListener('click', () => {
      frameAdd(renderFrameActive, this.dom.framesList, this.dom.canvas, this.piskelImg);
      this.currentCount = +localStorage.getItem('piskelCounter');
    });

    this.dom.canvas.addEventListener('mouseup', () => {
      saveImgsInLocalStorage(this.piskelImg, this.dom.canvas, this.currentCount);
      frameDraw(this.piskelImg, this.currentCount);
    });
  }

  swapWatch() {
    // set swaper color at app loading or
    // get user colors from Local Storage if exists
    if (localStorage.getItem('piskelPrimaryColor') !== null) {
      this.dom.primaryColor.value = localStorage.getItem('piskelPrimaryColor');
    } else {
      localStorage.setItem('piskelPrimaryColor', this.dom.primaryColor.value);
    }
    if (localStorage.getItem('piskelSecondaryColor') !== null) {
      this.dom.secondaryColor.value = localStorage.getItem('piskelSecondaryColor');
    } else {
      localStorage.setItem('piskelSecondaryColor', this.dom.secondaryColor.value);
    }

    this.dom.swapColor.addEventListener('click', this.swapHandler.bind(this));
    this.dom.primaryColor.addEventListener('change', () => {
      localStorage.removeItem('piskelPrimaryColor');
      localStorage.setItem('piskelPrimaryColor', this.dom.primaryColor.value);
    });

    this.dom.secondaryColor.addEventListener('change', () => {
      localStorage.removeItem('piskelSecondaryColor');
      localStorage.setItem('piskelSecondaryColor', this.dom.secondaryColor.value);
    });
  }

  swapHandler() {
    const buf = this.dom.primaryColor.value;
    this.dom.primaryColor.value = this.dom.secondaryColor.value;

    this.dom.secondaryColor.value = buf;
    this.ctx.fillStyle = this.dom.primaryColor.value;
    localStorage.removeItem('piskelPrimaryColor');
    localStorage.setItem('piskelPrimaryColor', this.dom.primaryColor.value);
    localStorage.removeItem('piskelSecondaryColor');
    localStorage.setItem('piskelSecondaryColor', this.dom.secondaryColor.value);
  }

  paintTools() {
    // get drawing tool from Local Storage if exists
    if (localStorage.getItem('piskelTool') === null) {
      this.targetTool = 'pencil';
      this.tools.pencilTool(this.targetTool);
      localStorage.setItem('piskelTool', this.targetTool);
    } else {
      this.targetTool = localStorage.getItem('piskelTool');
      highlightTarget(document.querySelector(`#${this.targetTool}`), 'tool--active');
      this.tools.toolHandler(this.targetTool, frameDraw);
    }

    this.dom.tools.addEventListener('click', e => {
      const targetToolEl = e.target.closest('li');
      if (targetToolEl === null) return;
      this.targetTool = targetToolEl.id;

      switch (this.targetTool) {
        case 'empty':
          this.tools.clearCanvas(this.piskelImg, this.currentCount);
          frameDraw(this.piskelImg, this.currentCount);
          break;
        default:
          highlightTarget(document.querySelector(`#${this.targetTool}`), 'tool--active');
          this.tools.toolHandler(this.targetTool, frameDraw);
      }
    });
  }

  penSizes() {
    // get pen size from local|Storage when app loaded
    if (localStorage.getItem('piskelPenSize') !== null) {
      this.pixelSize = Number(localStorage.getItem('piskelPenSize'));
      this.penSize = localStorage.getItem('piskelPenSize');
      for (let i = 0; i < this.dom.penSizes.children.length; i++) {
        if (this.dom.penSizes.children[i].dataset.size === this.penSize) {
          highlightTarget(this.dom.penSizes.children[i], 'pen-size--active');
        }
      }
    }

    this.dom.penSizes.addEventListener('click', e => {
      if (e.target.tagName === 'LI') {
        highlightTarget(e.target, 'pen-size--active');
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
        highlightTarget(document.querySelector(`#${this.targetTool}`), 'tool--active');
        this.tools.toolHandler(this.targetTool, frameDraw);
      }
    });
  }

  eventListeners() {
    // Button "Login"
    this.dom.authLoginBtn.addEventListener('click', () => {
      loginGoogleAccount(this.dom.authName, this.dom.authPhoto, this.dom.authLoginBtn, this.dom.authLogoutBtn);
    });

    // Button "Logout"
    this.dom.authLogoutBtn.addEventListener('click', () => {
      logoutGoogleAccount(this.dom.authName, this.dom.authPhoto, this.dom.authLoginBtn, this.dom.authLogoutBtn);
    });

    // Button "Clear user session"
    this.dom.clearSessionBtn.addEventListener('click', () => clearSession());
  }

  // TODO: pixel that tracks the cursor
  cursorOnCanvas() {
    // this.dom.canvas.addEventListener('mousemove', e => {
    //   if (!this.tools.isDrawing) {
    //     // console.log(this.tools.isDrawing);
    //     // console.log('this.dom.canvas.addEventListener(mousemove)');
    //     // console.log(e.offsetX);
    //     // console.log(this.dom.canvas.parentNode.style.width);
    //     const penSize = localStorage.getItem('piskelPenSize') !== null ? +localStorage.getItem('piskelPenSize') : 1;
    //     const pixelSize =
    //       localStorage.getItem('piskelPixelSize') !== null ? +localStorage.getItem('piskelPixelSize') : 1;
    //     const scale = this.dom.canvas.parentNode.style.width.slice(0, -2) / this.dom.canvas.width;
    //     console.log('scale: ', scale);
    //     this.dom.cursor.style.width = `${penSize * pixelSize * scale}px`;
    //     this.dom.cursor.style.height = `${penSize * pixelSize * scale}px`;
    //     const x = Math.round(e.offsetX / pixelSize) * pixelSize;
    //     const y = Math.round(e.offsetY / pixelSize) * pixelSize;
    //     this.dom.cursor.style.top = `${y - (penSize * pixelSize * scale) / 2}px`;
    //     this.dom.cursor.style.left = `${x - (penSize * pixelSize * scale) / 2}px`;
    //   }
    // });
    // this.dom.cursor.addEventListener('click', () => {
    //   console.log('click on cursor');
    //   this.tools.isDrawing = true;
    //   this.dom.cursor.style.width = 0;
    //   this.dom.cursor.style.height = 0;
    // });
  }
}
