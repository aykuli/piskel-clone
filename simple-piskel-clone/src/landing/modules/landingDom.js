function getLandingElements(getDomElement) {
  const canvasMain = getDomElement('.canvas-main');
  const gallery = getDomElement('.gallery');
  const functionalityPreview = getDomElement('.functionality__preview');
  return [canvasMain, gallery, functionalityPreview];
}

function renderGalleryItems(drawOnCanvas, animate, list, imgsArr, keysForLS, createDomElement) {
  for (let i = 0; i < imgsArr.length; i += 1) {
    const item = createDomElement('A');
    item.innerHTML = `<canvas class="gallery__canvas" width="200" height="200"></canvas>`;
    item.className = 'gallery__item';
    item.setAttribute('href', 'app.html');
    item.dataset.count = i;
    list.append(item);
    animate({
      draw: j => {
        drawOnCanvas(item.children[0], imgsArr[i][j]);
      },
      piskelImg: imgsArr[i],
      keys: keysForLS,
      isForLanding: true,
    });
  }
  return list;
}

function galleryItemsHandler(e, imgArr, LS_KEYS) {
  let count;
  if (e.target.tagName === 'CANVAS') {
    count = e.target.parentNode.dataset.count;
    localStorage.removeItem(LS_KEYS.piskelImg);
    localStorage.setItem(LS_KEYS.piskelImg, JSON.stringify(imgArr[count]));
    localStorage.removeItem(LS_KEYS.counter);
    localStorage.setItem(LS_KEYS.counter, 0);
    localStorage.removeItem(LS_KEYS.fps);
    localStorage.setItem(LS_KEYS.fps, 3);
  }
  return count;
}

export { getLandingElements, renderGalleryItems, galleryItemsHandler };
