import './landing.scss';
import { drawOnCanvas } from '../components/frames/frame';
// import { megaMan, snow, psycho, pikachu, face } from './dataURIs';
import { imagesArr } from './modules/dataURIs';
import animate from './modules/landingAnimate';
import { getLandingElements, renderGalleryItems, galleryItemsEdit } from './modules/landingView';

const [canvasMain, gallery, functionalityPreview] = getLandingElements();

// animate on screenshot of app
animate(i => {
  drawOnCanvas(canvasMain, imagesArr[0][i]);
}, imagesArr[0]);

// animate in functionality list
animate(i => {
  drawOnCanvas(functionalityPreview, imagesArr[1][i]);
}, imagesArr[1]);

// animate in example gallery
renderGalleryItems(drawOnCanvas, animate, gallery, imagesArr);

galleryItemsEdit(gallery, imagesArr);
