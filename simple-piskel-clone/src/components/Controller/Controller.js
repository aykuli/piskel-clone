import Tools from '../tools/Tools';
import Frame from '../frames/Frame';
import { frameProbe } from '../frames/frameProbe';

export default class Controller {
  constructor(view, relativeSize) {
    this.view = view;
    this.size = relativeSize;

    this.tools = new Tools(this.view.canvas, this.view.ctx, this.view.primaryColor, this.size);
    this.init();
    this.paintTools();
    this.swapWatch();
    this.keyboardShortCutHandler();
    this.frameThumb = new Frame();
    console.log(this.frameThumb);
    this.frameThumb.drawFrame();
    document.addEventListener('mouseup', () => this.frameThumb.drawFrame());
  }

  init() {
    console.log('init process');

    // get drawing tool from Local Storage if exists
    if (localStorage.getItem('piskelTool') === null) {
      this.targetTool = 'pencil';
      this.tools.pencilTool(this.targetTool);
    } else {
      this.targetTool = localStorage.getItem('piskelTool');
      this.tools.chosenToolHightlight(this.targetTool);
      this.tools.toolHandler(this.targetTool);
    }
    // get image from Local Storage if exists
    if (localStorage.getItem('piskelImg') !== null) {
      const img = new Image();
      const dataURI = localStorage.getItem('piskelImg');
      img.src = `data:image/png;base64,${dataURI}`;
      img.addEventListener('load', () => this.view.ctx.drawImage(img, 0, 0));
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
          localStorage.removeItem('piskelImg');
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
          localStorage.removeItem('piskelImg');
          // frameProbe();
          this.frameThumb.drawFrame();
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
