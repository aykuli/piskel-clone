function frameProbe() {
  console.log('frame');
  const frame = document.querySelector('.frame__thumb');
  const frameCtx = frame.getContext('2d');
  const img = new Image();
  const dataURI = localStorage.getItem('piskelImg');
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

  if (dataURI === null) {
    frameCtx.clearRect(0, 0, frame.width, frame.height);
  } else {
    img.src = `data:image/png;base64,${dataURI}`;

    console.log('dataURI: ', dataURI);
    img.onload = handleOnload;
  }
}

export { frameProbe };
