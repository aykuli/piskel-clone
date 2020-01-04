import './landing.scss';
import { drawOnCanvas } from '../components/frames/frame';
import { megaMan, snow, psycho, pikachu, face } from './dataURIs';

function animate(draw, imgDataURIArr) {
  if (imgDataURIArr.length === 0) return;
  let start = performance.now();
  let i = 0;
  let timeFraction = 0;
  let prev = timeFraction;
  requestAnimationFrame(function animateFrame(time) {
    let duration = 1000 / 4;
    prev = timeFraction;
    timeFraction = Math.abs(Math.floor((time - start) / duration));
    if (timeFraction !== prev) {
      draw(i); // draw frame
      i++;
      i %= imgDataURIArr.length;
    }
    if (timeFraction >= 0) {
      requestAnimationFrame(animateFrame);
    }
  });
}

function renderGalleryItems(list, ...args) {
  for (let i = 0; i < args.length; i++) {
    const item = document.createElement('DIV');
    item.innerHTML = `<canvas class="gallery__canvas" width="200" height="200"></canvas>`;
    item.className = 'gallery__item';
    list.append(item);
    animate(j => {
      drawOnCanvas(item.children[0], args[i][j]);
    }, args[i]);
  }
}

const canvasMain = document.querySelector('.canvas-main');
const gallery = document.querySelector('.gallery');
const functionalityPreview = document.querySelector('.functionality__preview');

animate(i => {
  drawOnCanvas(canvasMain, megaMan[i]);
}, megaMan);
animate(i => {
  drawOnCanvas(functionalityPreview, psycho[i]);
}, psycho);

renderGalleryItems(gallery, snow, pikachu, face);
