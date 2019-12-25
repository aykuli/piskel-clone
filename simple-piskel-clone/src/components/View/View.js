export default class View {
  constructor() {
    this.canvas = document.querySelector('#canvas');
    this.ctx = canvas.getContext('2d');

    this.tools = document.querySelector('.tools__container');

    this.primaryColor = document.querySelector('.tools__palette--primary');
    this.secondaryColor = document.querySelector('.tools__palette--secondary');
    this.swapColor = document.querySelector('.tools__palette--swapper');

    this.framesList = document.querySelector('.frames__list');
    const len = this.framesList.children.length;
    for (let i = 0; i < len; i++) {
      const countText = document.createElement('span');
      countText.className = 'frame__number';
      countText.innerText = i + 1;
      this.framesList.children[i].append(countText);
    }
  }
}
