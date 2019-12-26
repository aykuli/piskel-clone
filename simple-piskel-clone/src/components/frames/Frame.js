import './frames.scss';

export default class Frame {
  constructor() {
    this.frame = document.querySelectorAll('.frame');
    console.log(this.frame);
  }

  drawFrame(currentCount) {
    // console.log('frame');
    const frameCtx = this.frame[currentCount].getContext('2d');
    const img = new Image();
    const dataURI = localStorage.getItem(`piskelImg${currentCount}`);
    img.src = `data:image/png;base64,${dataURI}`;
    if (dataURI === null) {
      frameCtx.clearRect(0, 0, this.frame[currentCount].width, this.frame[currentCount].height);
    } else {
      img.src = `data:image/png;base64,${dataURI}`;
      img.addEventListener('load', () => this.handleOnload({ target: img }, currentCount));
    }
  }

  handleOnload = ({ target: img }, currentCount) => {
    let [currentWidth, currentHeight] = [this.frame[currentCount].width, this.frame[currentCount].height];
    let [x, y] = [0, 0];
    if (img.naturalWidth > img.naturalHeight) {
      const scaleImg = img.naturalWidth / canvas.width;
      currentWidth = this.frame[currentCount].width;
      currentHeight = img.naturalHeight / scaleImg;
      x = 0;
      y = (this.frame[currentCount].height - currentHeight) / 2;
    } else if (img.naturalWidth === img.naturalHeight) {
      currentWidth = this.frame[currentCount].width;
      currentHeight = this.frame[currentCount].height;
    } else {
      const scaleImg = img.naturalHeight / this.frame[currentCount].height;
      currentWidth = img.naturalWidth / scaleImg;
      currentHeight = this.frame[currentCount].height;
      x = (this.frame[currentCount].width - currentWidth) / 2;
      y = 0;
    }
    const frameCtx = this.frame[currentCount].getContext('2d');
    frameCtx.drawImage(img, x, y, currentWidth, currentHeight);
  };

  frameHandler(e, canvas) {
    const ctx = canvas.getContext('2d');
    // highlighting current frame
    if (e.target.classList.contains('frame')) {
      const frameActive = document.querySelector('.frame__active');
      frameActive.classList.remove('frame__active');
      e.target.parentNode.classList.add('frame__active');
    }

    let count = event.target.dataset.count;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (localStorage.getItem(`piskelImg${count}`) !== null) {
      const img = new Image();
      const dataURI = localStorage.getItem(`piskelImg${count}`);
      img.src = `data:image/png;base64,${dataURI}`;
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

          for (let i = 0; i < framesList.length; i++) {
            framesList[i].lastChild.innerText = i + 1;
            framesList[i].style.border = ''; 
          }

          const frameActive = document.querySelector('.frame__active');
          frameActive.classList.remove('frame__active');
          dragged.classList.add('frame__active');
          dragged.style.border = '';
          console.log(dragged.children[0].dataset.count);
          const canvasNumb = dragged.children[0].dataset.count;

          // get image from Local Storage if exists
          if (localStorage.getItem(`piskelImg${canvasNumb}`) !== null) {
            const ctx = canvas.getContext('2d');
            const img = new Image();
            const dataURI = localStorage.getItem(`piskelImg${canvasNumb}`);
            img.src = `data:image/png;base64,${dataURI}`;
            img.addEventListener('load', () => ctx.drawImage(img, 0, 0));
          }
        }
    });
  }

  frameAdd(framesList) {
    console.log('frameAdd');
    const len = framesList.children.length;
    const frameActive = document.querySelector('.frame__active');
    frameActive.classList.remove('frame__active');
    const newFrame = document.createElement('LI');
    newFrame.className = 'frame__item frame__active';
    newFrame.innerHTML = `<canvas class="frame" data-count="${len}" width="100" height="100"></canvas><button class="frame__btn--delete tip" data-tooltip="Delete this frame"><span class="visually-hidden">Delete this canvas</span></button><span class="frame__number">${len +
      1}</span>`;
    framesList.append(newFrame);
    return len;
  }

  frameDel() {
    console.log('frameDel');
  }
}
