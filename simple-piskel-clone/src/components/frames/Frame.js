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
}
