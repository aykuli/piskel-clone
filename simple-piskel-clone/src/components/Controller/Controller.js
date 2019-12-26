import Tools from '../tools/Tools';
import Frame from '../frames/Frame';
import { saveInLocalStorage } from '../tools/utils';

export default class Controller {
  constructor(view, relativeSize) {
    this.view = view;
    this.size = relativeSize;
    this.currentCount = 0;

    this.tools = new Tools(this.view.canvas, this.view.ctx, this.view.primaryColor, this.size);
    this.init();
    this.paintTools();
    this.swapWatch();
    this.keyboardShortCutHandler();

    this.frameThumb = new Frame();
    this.frameThumb.drawFrame(this.currentCount);

    this.view.canvas.addEventListener('mouseup', () => {
      saveInLocalStorage(`piskelImg${this.currentCount}`, this.view.canvas);
      this.frameThumb.drawFrame(this.currentCount);
    });

    this.frameChange();
    this.frameDndHandler();
  }

  frameDndHandler() {
    let dragged;

    /* events fired on the draggable target */
    document.addEventListener(
      'drag',
      e => {
        // console.log(e);
      },
      false
    );

    document.addEventListener(
      'dragstart',
      e => {
        // console.log('dragStarted');
        dragged = e.target; // store a ref. on the dragged elem
        // console.log('dragged: ', dragged);
        dragged.style.opacity = 0.3; // make darker dragged canvas
      },
      false
    );
    // back dragged canvas opacity to 1 (by removing this style)
    document.addEventListener(
      'dragend',
      e => {
        e.target.style.opacity = '';
      },
      false
    );

    // events fired on the drop targets. Prevent default to allow drop
    document.addEventListener('dragover', e => e.preventDefault(), false);

    document.addEventListener(
      'dragenter',
      e => {
        // console.log(e.target);
        // highlight potential drop target when the draggable element enters it
        if (e.target.className == 'frame__item') {
          e.target.style.border = '3px dotted rgb(34, 192, 153)';
        }
      },
      false
    );

    // document.addEventListener(
    //   'dragleave',
    //   e => {
    //     // reset background of potential drop target when the draggable element leaves it
    //     if (e.target.className == 'frame__item') {
    //       e.target.style.border = '';
    //     }
    //   },
    //   false
    // );

    document.addEventListener(
      'drop',
      function(e) {
        // prevent default action (open as link for some elements)
        e.preventDefault();
        // move dragged elem to the selected drop target
        if (e.target.className == 'frame') {
          const targetNumb = e.target.dataset.count;
          const sourceNumb = dragged.children[0].dataset.count;

          e.target.parentNode.style.border = '';
          dragged.remove();

          if (targetNumb > sourceNumb) {
            e.target.parentNode.after(dragged);
          } else {
            e.target.parentNode.before(dragged);
          }
          const framesList = dragged.parentNode.children;
          for (let i = 0; i < framesList.length; i++) {
            sourceNumb = framesList[i].children[0].dataset.count;
            framesList[i].children[0].dataset.count = i;

            const bufSource = localStorage.getItem(`piskelImg${sourceNumb}`);
            const bufTarget = localStorage.getItem(`piskelImg${i}`);
            localStorage.removeItem(`piskelImg${sourceNumb}`);
            localStorage.removeItem(`piskelImg${i}`);
            localStorage.setItem(`piskelImg${sourceNumb}`, bufTarget);
            localStorage.setItem(`piskelImg${i}`, bufSource);
          }
        }
      },
      false
    );
  }

  frameChange() {
    this.view.framesList.addEventListener('click', e => this.frameHandler(e));
  }

  frameHandler(e) {
    console.log('frameHandler clicked');
    // highlighting current frame
    if (e.target.classList.contains('frame')) {
      const frameActive = document.querySelector('.frame__active');
      frameActive.classList.remove('frame__active');
      e.target.parentNode.classList.add('frame__active');
    }

    let count = event.target.dataset.count;
    this.currentCount = count;
    console.log('this.currentCount: ', this.currentCount);

    this.view.ctx.clearRect(0, 0, this.view.canvas.width, this.view.canvas.height);
    if (localStorage.getItem(`piskelImg${this.currentCount}`) !== null) {
      const img = new Image();
      const dataURI = localStorage.getItem(`piskelImg${this.currentCount}`);
      img.src = `data:image/png;base64,${dataURI}`;
      img.addEventListener('load', () => this.view.ctx.drawImage(img, 0, 0));
      // img.onload = this.view.ctx.drawImage(img, 0, 0);
    }
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
    if (localStorage.getItem('piskelImg0') !== null) {
      const img = new Image();
      const dataURI = localStorage.getItem('piskelImg0');
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
          localStorage.removeItem(`piskelImg${this.currentCount}`);
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
          localStorage.removeItem(`piskelImg${this.currentCount}`);
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
