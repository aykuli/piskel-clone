export default class View {
  constructor() {
    this.canvas = document.querySelector('#canvas');
    this.ctx = canvas.getContext('2d');

    this.tools = document.querySelector('.tools__container');

    this.primaryColor = document.querySelector('.tools__palette--primary');
    this.secondaryColor = document.querySelector('.tools__palette--secondary');
    this.swapColor = document.querySelector('.tools__palette--swapper');
    // console.log(tools);
  }
}
