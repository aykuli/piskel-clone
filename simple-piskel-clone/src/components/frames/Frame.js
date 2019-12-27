import './frames.scss';

export default class Frame {
  constructor() {
    this.frame = document.querySelectorAll('.frame');
  }

  drawFrame(arrImgs, currentCount) {
    const frame = document.querySelectorAll('.frame');
    if (arrImgs.length === 0) return;
    const frameCtx = frame[currentCount].getContext('2d');
    const img = new Image();

    const dataURI = arrImgs[currentCount];
    if (dataURI === null || dataURI === '') {
      frameCtx.clearRect(0, 0, frame[currentCount].width, frame[currentCount].height);
    } else {
      img.src = arrImgs[currentCount];
      img.addEventListener('load', () => this.handleOnload({ target: img }, currentCount));
    }
  }

  handleOnload = ({ target: img }, currentCount) => {
    const frame = document.querySelectorAll('.frame');

    let [currentWidth, currentHeight] = [frame[currentCount].width, frame[currentCount].height];

    currentWidth = frame[currentCount].width;
    currentHeight = frame[currentCount].height;
    const frameCtx = frame[currentCount].getContext('2d');
    frameCtx.drawImage(img, 0, 0, currentWidth, currentHeight);
  };

  frameHandler(e, canvas, arrImgs) {
    const ctx = canvas.getContext('2d');
    // highlighting current frame
    if (e.target.classList.contains('frame')) {
      const frameActive = document.querySelector('.frame__active');
      frameActive.classList.remove('frame__active');
      e.target.parentNode.classList.add('frame__active');
    }

    let count = event.target.dataset.count;

    console.log('count: ', count);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (arrImgs[count]) {
      const img = new Image();
      img.src = arrImgs[count];
      img.addEventListener('load', () => ctx.drawImage(img, 0, 0));
    }
    return count;
  }

  frameDndHandler(canvas) {
    let dragged;

    /* events fired on the draggable target */
    document.addEventListener('drag', e => {
      // console.log(e);
    });

    document.addEventListener('dragstart', e => {
      // console.log('dragStarted');
      dragged = e.target; // store a ref. on the dragged elem
      // console.log('dragged: ', dragged);
      dragged.style.opacity = 0.3; // make darker dragged canvas
    });
    // back dragged canvas opacity to 1 (by removing this style)
    document.addEventListener('dragend', e => {
      e.target.style.opacity = '';
    });

    // events fired on the drop targets. Prevent default to allow drop
    document.addEventListener('dragover', e => e.preventDefault(), false);

    document.addEventListener('dragenter', e => {
      // console.log(e.target);
      // highlight potential drop target when the draggable element enters it
      if (e.target.className == 'frame__item') {
        e.target.style.border = '3px dotted rgb(34, 192, 153)';
      }
    });

    document.addEventListener('dragleave', e => {
      // reset background of potential drop target when the draggable element leaves it
      if (e.target.className == 'frame__item') {
        e.target.style.border = '';
        // console.log('dragleave');
      }
    });

    document.addEventListener('drop', e => {
      // prettier-ignore
      if ((e.target.className == 'frame') && (e.target.parentNode !== dragged)) {
          const framesList = dragged.parentNode.children;
          const targetNumb = e.target.parentNode.lastChild.innerText;
          const sourceNumb = dragged.lastChild.innerText;

          e.target.parentNode.style.border = '';
          dragged.remove();

          if (targetNumb > sourceNumb) {
            e.target.parentNode.after(dragged);
          } else {
            e.target.parentNode.before(dragged);
          }

          const frameActive = document.querySelector('.frame__active');
          frameActive.classList.remove('frame__active');
          dragged.classList.add('frame__active');
          dragged.style.border = '';


          
          const canvasNumb = dragged.children[0].dataset.count;

          // get image from Local Storage if exists
          if (localStorage.getItem(`piskelImg${canvasNumb}`) !== null) {
            const ctx = canvas.getContext('2d');
            const img = new Image();
            const dataURI = localStorage.getItem(`piskelImg${canvasNumb}`);
            img.src = `data:image/png;base64,${dataURI}`;
            img.addEventListener('load', () => ctx.drawImage(img, 0, 0));
          }
          
          for (let i = 0; i < framesList.length; i++) {
            framesList[i].lastChild.innerText = i + 1;
            framesList[i].style.border = '';
            console.log(`framesList[${i}].dataset.count`, framesList[i].children[0].dataset.count)
          }
        }
    });
  }

  frameAdd(framesList, canvas, arrImgs) {
    const ctx = canvas.getContext('2d');
    console.log('frameAdd');
    const len = framesList.children.length;
    const frameActive = document.querySelector('.frame__active');
    frameActive.classList.remove('frame__active');
    const newFrame = document.createElement('LI');
    newFrame.className = 'frame__item frame__active';
    newFrame.innerHTML = `<canvas class="frame" data-count="${len}" width="100" height="100"></canvas><button class="frame__btn--delete tip" data-tooltip="Delete this frame"><span class="visually-hidden">Delete this canvas</span></button><span class="frame__number">${len +
      1}</span>`;
    framesList.append(newFrame);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    arrImgs.push('');
    localStorage.removeItem(`piskelImg`);
    localStorage.setItem('piskelImg', JSON.stringify(arrImgs));

    return len;
  }

  frameDatasetCountSet(framesList) {
    const len = framesList.children.length;
    for (let i = 0; i < len; i++) {
      framesList.children[i].children[0].dataset.count = i;
      framesList.children[i].lastChild.innerText = i + 1;
    }
  }
}
