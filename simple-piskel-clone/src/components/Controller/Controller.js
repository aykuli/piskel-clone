import Tools from '../tools/Tools';

// import { toolsHandler } from '../tools/tools';

export default class Controller {
  constructor(view, relativeSize) {
    this.view = view;
    this.size = relativeSize;
    this.targetTool = 'pencil';

    this.tools = new Tools(this.view.canvas, this.view.ctx, this.view.primaryColor, this.size);
    this.init();
    this.windowReload();
    this.paintTools();
    this.swapHandler();
    this.keyboardShortCutHandler();
  }

  init() {
    console.log('init process');
    // let targetTool = 'pencil';
    this.tools.pencilTool(this.targetTool);
  }
  windowReload = () => {
    // console.log("localStorage.getItem('piskelCloneImg'): ", localStorage.getItem('piskelCloneImg'));
    if (localStorage.getItem('piskelImg') !== null) {
      const img = new Image();
      const dataURI = localStorage.getItem('piskelImg');
      img.src = `data:image/png;base64,${dataURI}`;
      img.addEventListener('load', () => this.view.ctx.drawImage(img, 0, 0));
    }

    if (localStorage.getItem('piskelPrimaryColor') !== null) {
      this.view.primaryColor.value = localStorage.getItem('piskelPrimaryColor');
    }
    if (localStorage.getItem('piskelSecondaryColor') !== null) {
      this.view.secondaryColor.value = localStorage.getItem('piskelSecondaryColor');
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
  };

  swapHandler() {
    // console.log(primaryColor.value);
    // console.log('swap');
    this.view.swapColor.addEventListener('click', () => {
      const buf = this.view.primaryColor.value;
      this.view.primaryColor.value = this.view.secondaryColor.value;
      this.view.secondaryColor.value = buf;
      this.view.ctx.fillStyle = this.view.primaryColor.value;
      localStorage.removeItem('piskelPrimaryColor');
      localStorage.setItem('piskelPrimaryColor', this.view.primaryColor.value);
      localStorage.removeItem('piskelSecondaryColor');
      localStorage.setItem('piskelSecondaryColor', this.view.secondaryColor.value);
      console.log();
    });
    // console.log(primaryColor.value);
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
          this.targetTool = 'pencil';
          break;
        default:
          this.tools.chosenToolHightlight(this.targetTool);
          this.tools.toolHandler(this.targetTool);
      }
    });
  }

  keyboardShortCutHandler() {
    window.addEventListener('keydown', e => {
      console.log(e.code);
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
          this.targetTool = 'pencil';
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
