export default class View {
  constructor() {
    this.canvas = document.querySelector('#canvas');
    this.ctx = canvas.getContext('2d');
    this.paneTools = document.querySelector('.pane__tools');
    this.currentColor = document.querySelector('#currentColor');
    this.prevColor = document.querySelector('#prevColor');
    this.colorRed = document.querySelector('.color--red');
    this.colorBlue = document.querySelector('.color--blue');

    this.cityChoiseInpit = document.querySelector('#cityChoiseInpit');
    this.load = document.querySelector('#load');
  }
}
