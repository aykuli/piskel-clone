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

    this.preview = document.querySelector('#preview');
    this.fps = document.querySelector('#fps');
    this.fpsValue = this.fps.parentNode.children[0].children[0];

    this.resBtns = document.querySelector('.canvas-resolutions__list');

    this.mainColumn = document.querySelector('.column--main');

    this.penSizes = document.querySelector('.pen-size__list');
    this.cursor = document.querySelector('.cursor');

    this.clearSessionBtn = document.querySelector('.session__clear');

    this.fullscreenBtn = document.querySelector('.animate__fullscreen');

    this.saveBtns = document.querySelector('.save');

    this.authLoginBtn = document.querySelector('.auth__login');
    this.authPhoto = document.querySelector('.auth__photo');
    this.authName = document.querySelector('.auth__name');
    this.authLogoutBtn = document.querySelector('.auth__logout');
  }
}
