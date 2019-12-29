export default class View {
  constructor() {
    this.canvas = document.querySelector('#canvas');
    this.ctx = canvas.getContext('2d');

    this.tools = document.querySelector('.tools__container');

    this.primaryColor = document.querySelector('.tools__palette--primary');
    this.secondaryColor = document.querySelector('.tools__palette--secondary');
    this.swapColor = document.querySelector('.tools__palette--swapper');

    this.framesList = document.querySelector('.frames__list');
    this.frameAddBtn = document.querySelector('.frames__btn--add');
    this.preview = document.querySelector('#preview');
    this.fps = document.querySelector('#fps');
    this.fpsValue = this.fps.parentNode.children[0].children[0];
    console.log(this.fpsValue);
  }

  renderFrames(arrImg) {
    const len = arrImg.length;
    for (let i = 0; i < len; i++) {
      const newFrame = document.createElement('LI');
      newFrame.className = i === 0 ? 'frame__item frame__active' : 'frame__item';
      newFrame.innerHTML = `<canvas class="frame" data-count="${i}" width="100" height="100" draggable="true"></canvas><button class="frame__btn--delete tip" data-tooltip="Delete this frame"><span class="visually-hidden">Delete this canvas</span></button><span class="frame__number">${i +
        1}</span>`;
      this.framesList.append(newFrame);
    }
  }
}
