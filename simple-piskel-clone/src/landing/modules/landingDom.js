function getLandingElements(getDomElement) {
  const canvasMain = getDomElement('.canvas-main');
  const gallery = getDomElement('.gallery');
  const functionalityPreview = getDomElement('.functionality__preview');
  return [canvasMain, gallery, functionalityPreview];
}

function renderGalleryItems(drawOnCanvas, animate, list, imgsArr, createDomElement) {
  for (let i = 0; i < imgsArr.length; i++) {
    const item = createDomElement('A');
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
  return list;
}

function galleryItemsHandler(e, imgArr) {
  let count;
  if (e.target.tagName === 'CANVAS') {
    count = e.target.parentNode.dataset.count;
    localStorage.removeItem('piskelImg');
    localStorage.setItem('piskelImg', JSON.stringify(imgArr[count]));
    localStorage.removeItem('piskelCounter');
    localStorage.setItem('piskelCounter', 0);
    localStorage.removeItem('piskelFps');
    localStorage.setItem('piskelFps', 3);
  }
  return count;
}

export { getLandingElements, renderGalleryItems, galleryItemsHandler };
