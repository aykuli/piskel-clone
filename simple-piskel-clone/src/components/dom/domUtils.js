function renderFrameActive(i, piskelImg, framesList) {
  const newFrame = document.createElement('LI');
  newFrame.className = 'frame__item frame__active';
  newFrame.innerHTML = `<canvas class="frame" data-count="${i}" width="100" height="100" draggable="true"></canvas><button class="frame__btn frame__btn--delete tip" data-tooltip="Delete this frame"><button class="frame__btn frame__btn--copy tip" data-tooltip="Copy this frame"><span class="visually-hidden">Copy this canvas</span></button><span class="visually-hidden">Delete this canvas</span></button><span class="frame__number">${i +
    1}</span>`;
  framesList.append(newFrame);
  piskelImg.push('');
}

function highlightTarget(target, activeClassName) {
  const activeElement = document.querySelector(`.${activeClassName}`);
  activeElement.classList.remove(activeClassName);
  target.classList.add(activeClassName);
}

function setCanvasWrapSize(mainColumn, canvas) {
  const canvasWrapHeight = mainColumn.offsetHeight;
  const canvasWrapWidth = mainColumn.offsetWidth;
  const size = canvasWrapWidth < canvasWrapHeight ? canvasWrapWidth : canvasWrapHeight;
  canvas.parentNode.style.width = `${size}px`;
  canvas.parentNode.style.height = `${size}px`;
}

function renderFrames(piskelImg, currentCount, framesList) {
  const len = piskelImg.length;
  for (let i = 0; i < len; i++) {
    const newFrame = document.createElement('LI');
    newFrame.innerHTML = `<canvas class="frame" data-count="${i}" width="100" height="100" draggable="true"></canvas><button class="frame__btn frame__btn--delete tip" data-tooltip="Delete this frame"><button class="frame__btn frame__btn--copy tip" data-tooltip="Copy this frame"><span class="visually-hidden">Copy this canvas</span></button><span class="visually-hidden">Delete this canvas</span></button><span class="frame__number">${i +
      1}</span>`;
    // prettier-ignore
    newFrame.className = (i === +currentCount) ? 'frame__item frame__active' : 'frame__item';
    framesList.append(newFrame);
  }
}

function createPopup(msg) {
  const popup = document.querySelector('.popup');
  popup.classList.remove('visually-hidden');
  popup.innerText = msg;
  setTimeout(() => popup.classList.add('visually-hidden'), 2500);
}

export { setCanvasWrapSize, renderFrames, renderFrameActive, highlightTarget, createPopup };
