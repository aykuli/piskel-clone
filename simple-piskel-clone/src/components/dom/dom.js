const domElements = {
  canvas: document.querySelector('#canvas'),
  canvasAbove: document.querySelector('.canvas--above'),
  tools: document.querySelector('.tools__container'),

  primaryColor: document.querySelector('.tools__palette--primary'),
  secondaryColor: document.querySelector('.tools__palette--secondary'),
  swapColor: document.querySelector('.tools__palette--swapper'),

  framesList: document.querySelector('.frames__list'),
  frameAddBtn: document.querySelector('.frames__btn--add'),

  preview: document.querySelector('#preview'),

  fps: document.querySelector('#fps'),
  fpsValue: document.querySelector('.fps__value'),

  resBtns: document.querySelector('.canvas-resolutions__list'),

  mainColumn: document.querySelector('.column--main'),

  penSizes: document.querySelector('.pen-size__list'),

  clearSessionBtn: document.querySelector('.session__clear'),

  fullscreenBtn: document.querySelector('.animate__fullscreen'),

  saveBtns: document.querySelector('.save'),

  authLoginBtn: document.querySelector('.auth__login'),
  authPhoto: document.querySelector('.auth__photo'),
  authName: document.querySelector('.auth__name'),
  authLogoutBtn: document.querySelector('.auth__logout'),
};

export { domElements };
