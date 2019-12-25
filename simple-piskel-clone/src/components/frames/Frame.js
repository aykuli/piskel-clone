import './frames.scss';

export default class Frame {
  constructor() {
    this.frame = document.querySelector('.frame');
    this.frameCtx = this.frame.getContext('2d');
  }

  drawFrame(currentCount) {
    // console.log('frame');
    const img = new Image();
    const dataURI = localStorage.getItem(`piskelImg${currentCount}`);
    img.src = `data:image/png;base64,${dataURI}`;
    if (dataURI === null) {
      this.frameCtx.clearRect(0, 0, this.frame.width, this.frame.height);
    } else {
      img.src = `data:image/png;base64,${dataURI}`;
      img.onload = this.handleOnload;
    }
  }

  handleOnload = ({ target: img }) => {
    let [currentWidth, currentHeight] = [this.frame.width, this.frame.height];
    let [x, y] = [0, 0];
    if (img.naturalWidth > img.naturalHeight) {
      const scaleImg = img.naturalWidth / canvas.width;
      currentWidth = this.frame.width;
      currentHeight = img.naturalHeight / scaleImg;
      x = 0;
      y = (this.frame.height - currentHeight) / 2;
    } else if (img.naturalWidth === img.naturalHeight) {
      currentWidth = this.frame.width;
      currentHeight = this.frame.height;
    } else {
      const scaleImg = img.naturalHeight / this.frame.height;
      currentWidth = img.naturalWidth / scaleImg;
      currentHeight = this.frame.height;
      x = (this.frame.width - currentWidth) / 2;
      y = 0;
    }
    this.frameCtx.drawImage(img, x, y, currentWidth, currentHeight);
  };
}
