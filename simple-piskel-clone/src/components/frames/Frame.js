import './frames.scss';

function drawOnCanvas(canvas, dataURI) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const img = new Image();
  if (dataURI === '') return;
  img.src = dataURI;
  img.addEventListener('load', () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height));
}

function frameDraw(piskelImg, currentCount) {
  const frame = document.querySelectorAll('.frame');
  if (piskelImg.length === 0) return;
  const frameCtx = frame[currentCount].getContext('2d', { alpha: true });
  const img = new Image();
  const dataURI = piskelImg[currentCount];

  const frameHandleOnload = ({ target: img }) => {
    const frame = document.querySelectorAll('.frame');

    let [currentWidth, currentHeight] = [frame[currentCount].width, frame[currentCount].height];

    currentWidth = frame[currentCount].width;
    currentHeight = frame[currentCount].height;
    const frameCtx = frame[currentCount].getContext('2d', { alpha: true });
    frameCtx.drawImage(img, 0, 0, currentWidth, currentHeight);
  };

  if (dataURI === null || dataURI === '') {
    frameCtx.clearRect(0, 0, frame[currentCount].width, frame[currentCount].height);
  } else {
    img.src = piskelImg[currentCount];
    img.addEventListener('load', () => frameHandleOnload({ target: img }, currentCount));
  }
}

function frameHandler(e, canvas, piskelImg, drawOnCanvas, preview, fps) {
  // highlighting current frame
  if (e.target.classList.contains('frame')) {
    const frameActive = document.querySelector('.frame__active');
    frameActive.classList.remove('frame__active');
    e.target.parentNode.classList.add('frame__active');
  }

  const count = event.target.dataset.count;
  if (piskelImg[count] !== undefined) {
    drawOnCanvas(canvas, piskelImg[count]);
    if (+fps === 0) drawOnCanvas(preview, piskelImg[count]);
  }
  return count;
}

function frameDndHandler(canvas, piskelImg, frameDatasetCountSet, drawOnCanvas) {
  let dragged;

  document.addEventListener('dragstart', e => {
    dragged = e.target; // store a ref. on the dragged elem
    if (e.target.className.includes('frame')) {
      dragged = e.target.parentNode;
      dragged.style.opacity = 0.3; // make darker dragged frame
    }
  });
  // back dragged canvas opacity to 1 (by removing this style)
  document.addEventListener('dragend', e => {
    dragged.style.opacity = '';
    e.target.style.border = '';
    localStorage.removeItem('piskelImg');
    localStorage.setItem('piskelImg', JSON.stringify(piskelImg));
  });

  // events fired on the drop targets. Prevent default to allow drop
  document.addEventListener('dragover', e => {
    if (e.target.className === 'frame__item') {
      e.target.style.border = '3px dotted rgb(34, 192, 153)';
    }
    e.preventDefault();
  });

  document.addEventListener('dragenter', e => {
    // console.log(e.target);
    // highlight potential drop target when the draggable element enters it
    if (e.target.className === 'frame__item') {
      e.target.style.border = '3px dotted rgb(34, 192, 153)';
    }
  });

  document.addEventListener('dragleave', e => {
    // reset background of potential drop target when the draggable element leaves it
    if (e.target.className === 'frame__item') {
      // e.target.style.border = '';
      // console.log('dragleave');
    }
  });

  document.addEventListener('drop', e => {
    // prettier-ignore
    if ((e.target.className === 'frame') && (e.target.parentNode !== dragged)) {
        // main drag and drop logic
        const targetNumb =  e.target.dataset.count;
        const sourceNumb = dragged.children[0].dataset.count;

        e.target.parentNode.style.border = '';
        dragged.remove();

        if (targetNumb > sourceNumb) {
          e.target.parentNode.after(dragged);
        } else {
          e.target.parentNode.before(dragged);
        }

        // highlight dragged frame
        const frameActive = document.querySelector('.frame__active');
        frameActive.classList.remove('frame__active');
        dragged.classList.add('frame__active');
        dragged.style.border = '';

        // get image from Local Storage if exists
        if (localStorage.getItem(`piskelImg`) !== null) {
          // replace dragged frame in target place
          const removed = piskelImg.splice(sourceNumb,1);
          piskelImg.splice(targetNumb, 0, removed);

          // draw in main canvas target frame, that will be active after drag and drop
          drawOnCanvas(canvas, piskelImg[targetNumb]);
          
          // make dataset.count and visual count text of frames consecutive          
          frameDatasetCountSet();

          localStorage.removeItem('piskelCounter');
          localStorage.setItem('piskelCounter', targetNumb);
        }
      }
  });
}

function frameAdd(renderFrameActive, framesList, canvas, piskelImg) {
  const ctx = canvas.getContext('2d', { alpha: true });
  const len = framesList.children.length;
  const frameActive = document.querySelector('.frame__active');
  frameActive.classList.remove('frame__active');
  renderFrameActive(len, piskelImg, framesList);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  localStorage.removeItem(`piskelImg`);
  localStorage.setItem('piskelImg', JSON.stringify(piskelImg));
  localStorage.removeItem('piskelCounter');
  localStorage.setItem('piskelCounter', len);
}

function frameCopy(target, piskelImg, canvas, highlightTarget, frameDatasetCountSet, drawOnCanvas) {
  // get the count of copied frame
  const countFrom = +target.parentNode.children[0].dataset.count;

  // render new  frame right after copied frame
  const newFrame = document.createElement('LI');
  newFrame.className = 'frame__item';
  newFrame.innerHTML = `<canvas class="frame" data-count="${countFrom +
    1}" width="100" height="100" draggable="true"></canvas><button class="frame__btn frame__btn--delete tip" data-tooltip="Delete this frame"><button class="frame__btn frame__btn--copy tip" data-tooltip="Copy this frame"><span class="visually-hidden">Copy this canvas</span></button><span class="visually-hidden">Delete this canvas</span></button><span class="frame__number">${countFrom +
    2}</span>`;
  target.parentNode.after(newFrame);

  // highlightTarget new frame and set it as active
  highlightTarget(newFrame, 'frame__active');

  // set dataset.count and visual count text of frames consecutive
  frameDatasetCountSet();

  // draw on main canvas this.piskelImg[countFrom]
  drawOnCanvas(newFrame.children[0], piskelImg[countFrom]);

  // splice piskelImg to add new frame in frame appropriate place
  piskelImg.splice(countFrom, 0, piskelImg[countFrom]);

  // clear main canvas and draw current active frame
  drawOnCanvas(canvas, piskelImg[countFrom]);

  // return new currentCount
  return countFrom + 1;
}

function frameDel(target, piskelImg, canvas, framesList) {
  if (framesList.children.length === 1) return;
  console.log('delete');
  const count = target.parentNode.children[0].dataset.count;
  // remove LI of deleted frame and all of it's children
  target.parentNode.remove();

  // remove correspond img data in piskelImg array and refresh localStorage
  piskelImg.splice(count, 1);
  localStorage.removeItem(`piskelImg`);
  localStorage.setItem(`piskelImg`, JSON.stringify(piskelImg));

  // refresh frames count
  frameDatasetCountSet();

  //set active frame if it was deleted
  const frameActive = document.querySelector('.frame__active');
  if (frameActive === null) {
    drawOnCanvas(canvas, piskelImg[0]);
    framesList.children[0].classList.add('frame__active');
  }
}

// make dataset.count and visual count text of frames consecutive
function frameDatasetCountSet() {
  const framesList = document.querySelector('.frames__list');
  const len = framesList.children.length;
  for (let i = 0; i < len; i++) {
    framesList.children[i].children[0].dataset.count = i;
    framesList.children[i].lastChild.innerText = i + 1;
  }
}

export { drawOnCanvas, frameDraw, frameHandler, frameDndHandler, frameAdd, frameDatasetCountSet, frameCopy, frameDel };
