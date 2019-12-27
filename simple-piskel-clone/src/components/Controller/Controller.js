import Tools from '../tools/Tools';
import Frame from '../frames/Frame';
import { saveImgsInLocalStorage } from '../tools/utils';

export default class Controller {
  constructor(view, relativeSize) {
    this.view = view;
    this.size = relativeSize;
    this.currentCount = 0;
    this.piskelImg = [];

    this.tools = new Tools(this.view.canvas, this.view.ctx, this.view.primaryColor, this.size);

    this.init();
    this.paintTools();
    this.swapWatch();
    this.keyboardShortCutHandler();

    this.frameThumb = new Frame();
    // this.frameThumb.drawFrame(this.piskelImg, this.currentCount);

    this.view.canvas.addEventListener('mouseup', () => {
      saveImgsInLocalStorage(this.piskelImg, this.view.canvas, this.currentCount);
      this.frameThumb.drawFrame(this.piskelImg, this.currentCount);
    });

    this.frameChange();
    this.frameThumb.frameDndHandler(this.view.canvas);
  }

  init() {
    // get drawing tool from Local Storage if exists
    if (localStorage.getItem('piskelTool') === null) {
      this.targetTool = 'pencil';
      this.tools.pencilTool(this.targetTool);
    } else {
      this.targetTool = localStorage.getItem('piskelTool');
      this.tools.chosenToolHightlight(this.targetTool);
      this.tools.toolHandler(this.targetTool);
    }

    this.currentCount =
      localStorage.getItem('piskelCounter') !== null ? localStorage.getItem('piskelCounter') : this.currentCount;

    // get image from Local Storage if exists
    if (localStorage.getItem('piskelImg') !== null) {
      console.log(localStorage.getItem('piskelImg'));
      this.piskelImg = JSON.parse(localStorage.getItem('piskelImg'));
      this.view.renderFrames(this.piskelImg);

      for (let i = 0; i < this.piskelImg.length; i++) {
        const frame = this.view.framesList.children[i].children[0];
        const ctx = frame.getContext('2d');

        const img = new Image();
        img.src = this.piskelImg[i];
        img.addEventListener('load', () => ctx.drawImage(img, 0, 0, frame.width, frame.height));
      }

      const img = new Image();
      img.src = this.piskelImg[this.currentCount];
      img.addEventListener('load', () => this.view.ctx.drawImage(img, 0, 0));
    } else {
      const newFrame = document.createElement('LI');
      newFrame.className = 'frame__item frame__active';
      newFrame.innerHTML = `<canvas class="frame" data-count="${0}" width="100" height="100"></canvas><button class="frame__btn--delete tip" data-tooltip="Delete this frame"><span class="visually-hidden">Delete this canvas</span></button><span class="frame__number">${1}</span>`;
      this.view.framesList.append(newFrame);
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

    // console.log("localStorage.getItem('piskelCloneResolution'): ", localStorage.getItem('piskelCloneResolution'));
    // if (localStorage.getItem('piskelCloneResolution') !== null) {
    //   this.size = Number(localStorage.getItem('piskelCloneResolution'));
    //   [this.view.canvas.width, this.view.canvas.height] = [this.size, this.size];
    //   const currentRes = document.querySelector('.res-active');
    //   // console.log(currentRes);
    //   currentRes.classList.remove('res-active');

    //   const target = document.querySelector(`#res${this.size}`);
    //   target.classList.add('res-active');
    // }
  }

  frameChange() {
    this.view.framesList.addEventListener('click', e => {
      if (this.view.framesList.children.length === 1) return;
      const frameDelBtns = Array.from(document.querySelectorAll('.frame__btn--delete'));
      if (e.target.className === frameDelBtns[0].className) {
        const count = e.target.parentNode.children[0].dataset.count;

        this.piskelImg.splice(count, 1);

        e.target.parentNode.remove();

        localStorage.removeItem(`piskelImg`);
        localStorage.setItem(`piskelImg`, JSON.stringify(this.piskelImg));

        this.frameThumb.frameDatasetCountSet(this.view.framesList);

        const frameActive = document.querySelector('.frame__active');
        if (frameActive === null) {
          this.view.framesList.children[0].classList.add('frame__active');
        }
      } else {
        this.currentCount = this.frameThumb.frameHandler(e, this.view.canvas, this.piskelImg);
      }
    });
    this.view.frameAddBtn.addEventListener('click', () => {
      this.currentCount = this.frameThumb.frameAdd(this.view.framesList, this.view.canvas, this.piskelImg);
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
      // console.log('toolsHandler');
      const targetToolEl = e.target.closest('li');
      if (targetToolEl === null) return;
      this.targetTool = targetToolEl.id;

      switch (this.targetTool) {
        case 'empty':
          this.view.ctx.clearRect(0, 0, this.view.canvas.width, this.view.canvas.height);
          this.piskelImg[this.currentCount] = '';
          localStorage.removeItem(`piskelImg`);
          localStorage.setItem('piskelImg', JSON.stringify(this.piskelImg));
          this.frameThumb.drawFrame(this.piskelImg, this.currentCount);
          break;
        default:
          this.tools.chosenToolHightlight(this.targetTool);
          this.tools.toolHandler(this.targetTool);
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
          this.view.ctx.clearRect(0, 0, this.view.canvas.width, this.view.canvas.height);
          this.piskelImg[this.currentCount] = '';
          localStorage.removeItem(`piskelImg`);
          localStorage.setItem('piskelImg', JSON.stringify(this.piskelImg));
          this.frameThumb.drawFrame(this.piskelImg, this.currentCount);
          break;
        case 'KeyX':
          e.preventDefault();
          this.swapHandler();
          break;
        default:
          return;
      }

      if (this.targetTool !== 'empty') {
        this.tools.chosenToolHightlight(this.targetTool);
        this.tools.toolHandler(this.targetTool);
      }
    });
  }
}
