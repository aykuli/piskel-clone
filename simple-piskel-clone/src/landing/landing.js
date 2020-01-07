import './landing.scss';
import { drawOnCanvas } from '../components/drawCanvas/drawCanvas';
import { imagesArr } from './modules/dataURIs';
import { animate } from '../components/animation/animate';
import { getLandingElements, renderGalleryItems, galleryItemsHandler } from './modules/landingDom';
import { getDomElement } from '../components/dom/domUtils';

function landing(
  imagesArr,
  getDomElement,
  getLandingElements,
  drawOnCanvas,
  animate,
  renderGalleryItems,
  galleryItemsHandler
) {
  const [canvasMain, gallery, functionalityPreview] = getLandingElements(getDomElement);
  // animate on screenshot of app
  animate(
    i => {
      drawOnCanvas(canvasMain, imagesArr[0][i]);
    },
    imagesArr[0],
    false,
    true
  );

  // animate in functionality list
  animate(
    i => {
      drawOnCanvas(functionalityPreview, imagesArr[1][i]);
    },
    imagesArr[1],
    false,
    true
  );

  // animate in example gallery
  renderGalleryItems(drawOnCanvas, animate, gallery, imagesArr, el => document.createElement(el));

  gallery.addEventListener('click', e => galleryItemsHandler(e, imagesArr));
  return 'landing page created';
}

landing(imagesArr, getDomElement, getLandingElements, drawOnCanvas, animate, renderGalleryItems, galleryItemsHandler);
