function getLandingElements() {
  const canvasMain = document.querySelector('.canvas-main');
  const gallery = document.querySelector('.gallery');
  const functionalityPreview = document.querySelector('.functionality__preview');
  return [canvasMain, gallery, functionalityPreview];
}

function renderGalleryItems(drawOnCanvas, animate, list, imgsArr) {
  for (let i = 0; i < imgsArr.length; i++) {
    const item = document.createElement('DIV');
    item.innerHTML = `<canvas class="gallery__canvas" width="200" height="200"></canvas>`;
    item.className = 'gallery__item';
    list.append(item);
    animate(j => {
      drawOnCanvas(item.children[0], imgsArr[i][j]);
    }, imgsArr[i]);
  }
}

export { getLandingElements, renderGalleryItems };
