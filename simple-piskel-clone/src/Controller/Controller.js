// TODO^ make scroller for the frames when frames list number become a lot
// TODO: pixel that tracks the cursor

// DOM elements changing functions
import {
  setCanvasWrapSize,
  renderFrames,
  renderFrameActive,
  highlightTarget,
  createPopup,
} from '../components/dom/domUtils';

// canvas draw function
import { drawOnCanvas, canvasResolutionHandler } from '../components/drawCanvas/drawCanvas';
import clearCanvas from '../components/drawCanvas/clearCanvas';

// tools
import Tools from '../components/tools/Tools';
import { toolsMap } from '../components/tools/toolsMap';
import { swapHandler } from '../components/tools/swapColors';
import { penSizeHandler } from '../components/tools/toolsUtils';

// work with frames
import {
  frameDraw,
  frameHandler,
  frameDndHandler,
  frameAdd,
  frameDatasetCountSet,
  frameCopy,
  frameDel,
} from '../components/frames/frame';

// animation functions
import { animate, animationFullscreen, fpsHandler } from '../components/animation/animate';

// export pictures
import gifSave from '../components/exportImg/gifSave';
import apngSave from '../components/exportImg/apngSave';
import { saveHandler } from '../components/exportImg/exportUtils';

// session
import {
  clearSession,
  saveImgsInLocalStorage,
  refreshLocalStorageValue,
} from '../components/sessionActions/sessionActions';

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
    this.tools = new Tools(this.dom.canvas, this.ctx, this.dom.primaryColor, this.pixelSize);

    this.init();

    this.paintTools(); // tools eventListener
    this.keyboardShortCutHandler(); // keyboard eventListener
    this.frameWatch(); // frame active eventListener
    this.penSizes(); // pen size eventListener
    frameDndHandler(this.dom.canvas, this.piskelImg, frameDatasetCountSet, drawOnCanvas); // frame drag and drop listener

    animate(
      i => {
        drawOnCanvas(this.dom.preview, this.piskelImg[i]);
      },
      this.piskelImg,
      this.fpsWatch,
      false
    );

    animationFullscreen(this.dom.fullscreenBtn, this.dom.preview);

    this.eventListeners();
  }

  init() {
    // init for authentification
    firebaseInit();

    // get current number of active frame
    const lSCount = localStorage.getItem('piskelCounter');
    this.currentCount = lSCount !== null && lSCount !== 'undefined' ? lSCount : this.currentCount;

    // get image from Local Storage if exists and draw accordingly frames
    if (localStorage.getItem('piskelImg') !== null) {
      this.piskelImg = JSON.parse(localStorage.getItem('piskelImg'));
      renderFrames(this.piskelImg, this.currentCount, this.dom.framesList);

      for (let i = 0; i < this.piskelImg.length; i++) {
        const frame = this.dom.framesList.children[i].children[0];
        drawOnCanvas(frame, this.piskelImg[i]);
      }
      drawOnCanvas(this.dom.canvas, this.piskelImg[this.currentCount]);
    } else {
      // if there is no image render one empty frame
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

    // set pixel size at app page loading
    if (localStorage.getItem('piskelPixelSize') !== null) {
      this.pixelSize = Number(localStorage.getItem('piskelPixelSize'));
      const target = document.querySelector(`.resolution--res${this.dom.canvas.width / this.pixelSize}`);
      console.log(target);
      highlightTarget(target, 'resolution__btn--active');
      console.log(target);
    }

    setCanvasWrapSize(this.dom.mainColumn, this.dom.canvas);

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
  }

  eventListeners() {
    // HEADER
    // AUTHORIZATION
    const authElements = [this.dom.authName, this.dom.authPhoto, this.dom.authLoginBtn, this.dom.authLogoutBtn];
    // Button "Login"
    this.dom.authLoginBtn.addEventListener('click', () => {
      loginGoogleAccount(authElements, createPopup);
    });

    // Button "Logout"
    this.dom.authLogoutBtn.addEventListener('click', () => {
      logoutGoogleAccount(authElements);
    });

    // LEFT SIDE COLUMN
    // PEN SIZE
    this.dom.penSizes.addEventListener('click', e => {
      this.penSize = penSizeHandler(e, this.penSize, highlightTarget, refreshLocalStorageValue);
    });

    // COLOR SWAPER
    this.dom.swapColor.addEventListener('click', () =>
      swapHandler(this.dom.primaryColor, this.dom.secondaryColor, this.ctx, refreshLocalStorageValue)
    );

    this.dom.primaryColor.addEventListener('change', () => {
      refreshLocalStorageValue('piskelPrimaryColor', this.dom.primaryColor.value);
    });

    this.dom.secondaryColor.addEventListener('change', () => {
      refreshLocalStorageValue('piskelSecondaryColor', this.dom.secondaryColor.value);
    });

    // MAIN COLUMN
    // MAIN CANVAS SIZES when window resizing
    window.addEventListener('resize', e => {
      setCanvasWrapSize(this.dom.mainColumn, this.dom.canvas);
    });

    // RIGHT SIDE COLUMN
    // RESOLUTION CHANGING
    this.dom.resBtns.addEventListener('click', e => {
      this.pixelSize = canvasResolutionHandler(
        e,
        this.pixelSize,
        this.dom.canvas,
        this.currentCount,
        drawOnCanvas,
        highlightTarget
      );
    });

    // BUTTON "Clear user session"
    this.dom.clearSessionBtn.addEventListener('click', () => clearSession());

    // EXPORT IMAGE
    this.dom.saveBtns.addEventListener('click', e => saveHandler(e, this.dom.canvas, gifSave, apngSave, GIFEncoder));
  }

  fpsWatch = (draw, animateFrame) => {
    this.dom.fps.addEventListener('input', () => fpsHandler(this.dom.fps, this.dom.fpsValue, animateFrame, draw));
  };

  frameWatch() {
    this.dom.framesList.addEventListener('click', e => {
      if (e.target.className.includes('frame__btn--delete')) {
        this.currentCount = frameDel(e.target, this.piskelImg, this.dom.canvas, this.dom.framesList, drawOnCanvas);
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
      frameDraw(this.piskelImg, this.currentCount, '.frame');
    });
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
      this.tools.toolHandler(this.targetTool, frameDraw, '.frame');
    }

    this.dom.tools.addEventListener('click', e => {
      const targetToolEl = e.target.closest('li');
      if (targetToolEl === null) return;
      this.targetTool = targetToolEl.id;

      switch (this.targetTool) {
        case 'empty':
          clearCanvas(this.dom.canvas, this.piskelImg, this.currentCount);
          frameDraw(this.piskelImg, this.currentCount, '.frame');
          break;
        default:
          highlightTarget(document.querySelector(`#${this.targetTool}`), 'tool--active');
          this.tools.toolHandler(this.targetTool, frameDraw, '.frame');
      }
    });
  }

  penSizes() {
    // get pen size from localStorage when app loaded
    if (localStorage.getItem('piskelPenSize') !== null) {
      this.pixelSize = Number(localStorage.getItem('piskelPenSize'));
      this.penSize = localStorage.getItem('piskelPenSize');
      for (let i = 0; i < this.dom.penSizes.children.length; i++) {
        if (this.dom.penSizes.children[i].dataset.size === this.penSize) {
          highlightTarget(this.dom.penSizes.children[i], 'pen-size--active');
        }
      }
    }
  }

  keyboardShortCutHandler() {
    document.addEventListener('keydown', e => {
      this.targetTool = toolsMap.has(e.code) ? toolsMap.get(e.code) : this.targetTool;

      if (e.code === 'KeyZ') {
        e.preventDefault();
        clearCanvas(this.dom.canvas, this.piskelImg, this.currentCount);
        frameDraw(this.piskelImg, this.currentCount, '.frame');
      } else if (e.code === 'KeyX') {
        e.preventDefault();
        swapHandler(this.dom.primaryColor, this.dom.secondaryColor, this.ctx, refreshLocalStorageValue);
      }

      if (this.targetTool !== 'empty') {
        highlightTarget(document.querySelector(`#${this.targetTool}`), 'tool--active');
        this.tools.toolHandler(this.targetTool, frameDraw, '.frame');
      }
    });
  }
}
