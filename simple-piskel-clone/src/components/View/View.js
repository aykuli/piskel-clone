export default class View {
  constructor() {
    this.canvas = document.querySelector('#canvas');
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.canvasAbove = document.querySelector('.canvas--above');

    this.tools = document.querySelector('.tools__container');

    this.primaryColor = document.querySelector('.tools__palette--primary');
    this.secondaryColor = document.querySelector('.tools__palette--secondary');
    this.swapColor = document.querySelector('.tools__palette--swapper');

    this.framesList = document.querySelector('.frames__list');
    this.frameAddBtn = document.querySelector('.frames__btn--add');
    // this.frameCopyBtn = document.querySelector('.frame__btn--copy');

    this.preview = document.querySelector('#preview');
    this.fps = document.querySelector('#fps');
    this.fpsValue = this.fps.parentNode.children[0].children[0];

    this.resBtns = document.querySelector('.canvas-resolutions__list');

    this.mainColumn = document.querySelector('.column--main');

    this.penSizes = document.querySelector('.pen-size__list');
    this.cursor = document.querySelector('.cursor');

    this.clearSessionBtn = document.querySelector('.session__clear');
  }

  renderFrames(piskelImg, currentCount) {
    const len = piskelImg.length;
    for (let i = 0; i < len; i++) {
      const newFrame = document.createElement('LI');
      newFrame.innerHTML = `<canvas class="frame" data-count="${i}" width="100" height="100" draggable="true"></canvas><button class="frame__btn frame__btn--delete tip" data-tooltip="Delete this frame"><button class="frame__btn frame__btn--copy tip" data-tooltip="Copy this frame"><span class="visually-hidden">Copy this canvas</span></button><span class="visually-hidden">Delete this canvas</span></button><span class="frame__number">${i +
        1}</span>`;
      // prettier-ignore
      newFrame.className = (i === +currentCount) ? 'frame__item frame__active' : 'frame__item';
      this.framesList.append(newFrame);
    }
  }

  setCanvasWrapSize() {
    const canvasWrapHeight = this.mainColumn.offsetHeight;
    const canvasWrapWidth = this.mainColumn.offsetWidth;
    console.log(canvasWrapWidth, canvasWrapHeight);
    const size = canvasWrapWidth < canvasWrapHeight ? canvasWrapWidth : canvasWrapHeight;
    this.canvas.parentNode.style.width = `${size}px`;
    this.canvas.parentNode.style.height = `${size}px`;
  }

  highlightTarget(target, activeClassName) {
    const activeElement = document.querySelector(`.${activeClassName}`);
    activeElement.classList.remove(activeClassName);
    target.classList.add(activeClassName);
  }

  renderFrameActive(i, piskelImg, framesList) {
    const newFrame = document.createElement('LI');
    newFrame.className = 'frame__item frame__active';
    newFrame.innerHTML = `<canvas class="frame" data-count="${i}" width="100" height="100" draggable="true"></canvas><button class="frame__btn frame__btn--delete tip" data-tooltip="Delete this frame"><button class="frame__btn frame__btn--copy tip" data-tooltip="Copy this frame"><span class="visually-hidden">Copy this canvas</span></button><span class="visually-hidden">Delete this canvas</span></button><span class="frame__number">${i +
      1}</span>`;
    framesList.append(newFrame);
    piskelImg.push('');
  }
}
