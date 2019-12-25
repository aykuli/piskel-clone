import './frames.scss';

function frame() {
  console.log('frame');
  const frame = document.querySelector('.frame__thumb');
  const frameCtx = frame.getContext('2d');
  const img = new Image();
  const dataURI = localStorage.getItem('piskelImg');
  img.src = `data:image/png;base64,${dataURI}`;

  const handleOnload = ({ target: img }) => {
    let [currentWidth, currentHeight] = [frame.width, frame.height];
    let [x, y] = [0, 0];
    if (img.naturalWidth > img.naturalHeight) {
      const scaleImg = img.naturalWidth / canvas.width;
      currentWidth = frame.width;
      currentHeight = img.naturalHeight / scaleImg;
      x = 0;
      y = (frame.height - currentHeight) / 2;
    } else if (img.naturalWidth === img.naturalHeight) {
      currentWidth = frame.width;
      currentHeight = frame.height;
    } else {
      const scaleImg = img.naturalHeight / frame.height;
      currentWidth = img.naturalWidth / scaleImg;
      currentHeight = frame.height;
      x = (frame.width - currentWidth) / 2;
      y = 0;
    }
    frameCtx.drawImage(img, x, y, currentWidth, currentHeight);
  };

  img.onload = handleOnload;
  frameCtx.drawImage(img, 0, 0, 100, 100);
}

// changing canvas resolution

export { frame };
