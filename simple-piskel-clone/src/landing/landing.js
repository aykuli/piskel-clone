import './landing.scss';
import { drawOnCanvas } from '../components/drawCanvas/drawCanvas';
import { imagesArr } from './modules/dataURIs';
import { animate } from '../components/animation/animate';
import { getLandingElements, renderGalleryItems, galleryItemsHandler } from './modules/landingDom';
import { getDomElement } from '../components/dom/domUtils';

function landing(
  imagesArray,
  getDomElem,
  getLandingDOMElements,
  drawCanvas,
  animation,
  renderGalleryElements,
  galleryElemsHandler
) {
  const [canvasMain, gallery, functionalityPreview] = getLandingDOMElements(getDomElem);
  // animate on screenshot of app
  animation(
    i => {
      drawCanvas(canvasMain, imagesArray[0][i]);
    },
    imagesArray[0],
    0,
    true
  );

  // animate in functionality list
  animation(
    i => {
      drawCanvas(functionalityPreview, imagesArray[1][i]);
    },
    imagesArray[1],
    0,
    true
  );

  // animate in example gallery
  renderGalleryElements(drawCanvas, animation, gallery, imagesArray, el => document.createElement(el));

  gallery.addEventListener('click', e => galleryElemsHandler(e, imagesArray));
  return 'landing page created';
}

landing(imagesArr, getDomElement, getLandingElements, drawOnCanvas, animate, renderGalleryItems, galleryItemsHandler);
