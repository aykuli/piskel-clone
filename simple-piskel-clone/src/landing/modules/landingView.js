function getLandingElements() {
  const canvasMain = document.querySelector('.canvas-main');
  const gallery = document.querySelector('.gallery');
  const functionalityPreview = document.querySelector('.functionality__preview');
  return [canvasMain, gallery, functionalityPreview];
}

function renderGalleryItems(drawOnCanvas, animate, list, imgsArr) {
  for (let i = 0; i < imgsArr.length; i++) {
    const item = document.createElement('A');
    item.innerHTML = `<canvas class="gallery__canvas" width="200" height="200"></canvas>`;
    item.className = 'gallery__item';
    item.setAttribute('href', 'app.html');
    item.dataset.count = i;
    list.append(item);
    animate(
      j => {
        drawOnCanvas(item.children[0], imgsArr[i][j]);
      },
      imgsArr[i],
      false,
      true
    );
  }
}

function galleryItemsEdit(gallery, imgArr) {
  gallery.addEventListener('click', e => {
    if (e.target.tagName === 'CANVAS') {
      const count = e.target.parentNode.dataset.count;
      localStorage.removeItem('piskelImg');
      localStorage.setItem('piskelImg', JSON.stringify(imgArr[count]));
      localStorage.removeItem('piskelCounter');
      localStorage.setItem('piskelCounter', 0);
      localStorage.removeItem('piskelFps');
      localStorage.setItem('piskelFps', 3);
    }
  });
}

export { getLandingElements, renderGalleryItems, galleryItemsEdit };
