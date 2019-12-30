import './frames.scss';

function drawOnCanvas(canvas, dataURI) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const img = new Image();
  if (dataURI === '') return;
  img.src = dataURI;
  img.addEventListener('load', () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height));
}

function frameDraw(arrImgs, currentCount) {
  const frame = document.querySelectorAll('.frame');
  if (arrImgs.length === 0) return;
  const frameCtx = frame[currentCount].getContext('2d');
  const img = new Image();
  const dataURI = arrImgs[currentCount];

  const frameHandleOnload = ({ target: img }) => {
    const frame = document.querySelectorAll('.frame');

    let [currentWidth, currentHeight] = [frame[currentCount].width, frame[currentCount].height];

    currentWidth = frame[currentCount].width;
    currentHeight = frame[currentCount].height;
    const frameCtx = frame[currentCount].getContext('2d');
    frameCtx.drawImage(img, 0, 0, currentWidth, currentHeight);
  };

  if (dataURI === null || dataURI === '') {
    frameCtx.clearRect(0, 0, frame[currentCount].width, frame[currentCount].height);
  } else {
    img.src = arrImgs[currentCount];
    img.addEventListener('load', () => frameHandleOnload({ target: img }, currentCount));
  }
}

function frameHandler(e, canvas, arrImgs, drawOnCanvas, preview, fps) {
  // highlighting current frame
  if (e.target.classList.contains('frame')) {
    const frameActive = document.querySelector('.frame__active');
    frameActive.classList.remove('frame__active');
    e.target.parentNode.classList.add('frame__active');
  }

  const count = event.target.dataset.count;
  if (arrImgs[count] !== undefined) {
    drawOnCanvas(canvas, arrImgs[count]);
    if (+fps === 0) drawOnCanvas(preview, arrImgs[count]);
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
        }
      }
  });
}

function frameAdd(framesList, canvas, arrImgs) {
  const ctx = canvas.getContext('2d');
  const len = framesList.children.length;
  const frameActive = document.querySelector('.frame__active');
  frameActive.classList.remove('frame__active');
  const newFrame = document.createElement('LI');
  newFrame.className = 'frame__item frame__active';
  newFrame.innerHTML = `<canvas class="frame" data-count="${len}" width="100" height="100" draggable="true"></canvas><button class="frame__btn--delete tip" data-tooltip="Delete this frame"><span class="visually-hidden">Delete this canvas</span></button><span class="frame__number">${len +
    1}</span>`;
  framesList.append(newFrame);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  arrImgs.push('');
  console.log('arrImgs: ', arrImgs);
  localStorage.removeItem(`piskelImg`);
  localStorage.setItem('piskelImg', JSON.stringify(arrImgs));

  return len;
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

export { drawOnCanvas, frameDraw, frameHandler, frameDndHandler, frameAdd, frameDatasetCountSet };
