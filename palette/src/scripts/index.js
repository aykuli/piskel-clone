import Picture from './Picture.js';
// Start working with index.html
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const paneTools = document.querySelector('.pane__tools');
const currentColor = document.querySelector('#currentColor');
const prevColor = document.querySelector('#prevColor');
const colorRed = document.querySelector('.color--red');
const colorBlue = document.querySelector('.color--blue');

const app = new Picture(4, canvas, ctx, currentColor, prevColor);

// **********   INITIALIZATION    ************ */
// Initialization process, loading prev image
window.onload = () => {
  if (localStorage.getItem('userPaint') === null || localStorage.getItem('userPaint') === undefined) {
    app.emptyCanvas();
    localStorage.setItem('userPaint', app.ctxData);
  } else {
    const json = localStorage.getItem('userPaint');
    app.ctxData = JSON.parse(json);
    app.loadPrevImage();
  }
};

window.onbeforeunload = () => app.localStorageSave();
// **********   and of INITIALIZATION    ************ */

// ********************    CLEAR CANVAS    *******************/
const empty = document.getElementById('empty');
empty.addEventListener('click', app.emptyCanvas);
// *****************  end of  CLEAR CANVAS    ****************/

// ********************    SAVE IMAGE    *********************/
const save = document.getElementById('save');
save.addEventListener('click', app.saveCanvas);
// *****************  end of  SAVE IMAGE    ******************/

// ********************       TOOLS       *******************/
let targetTool = 'pencil';
app.pencilTool(targetTool);

paneTools.addEventListener('click', e => {
  const targetToolEl = e.target.closest('li');
  if (targetToolEl === null) return;
  targetTool = targetToolEl.id;
  const prevActiveToolEl = document.querySelector('.tool--active');
  prevActiveToolEl.classList.remove('tool--active');
  targetToolEl.classList.add('tool--active');
  app.tools(targetTool);
});
// ********************    end of TOOLS    *******************/

// ******************    COLOR MANAGING    *******************/
const constColorPalette = ['#f74242', '#316cb9'];

colorRed.addEventListener('click', () => app.watchColor(constColorPalette[0]));
colorBlue.addEventListener('click', () => app.watchColor(constColorPalette[1]));
prevColor.addEventListener('click', () => app.watchColor(currentColor.value));
currentColor.addEventListener('change', () => app.watchColor(currentColor.value));
// *************    end of  COLOR MANAGING      **************/

// ****************    KEYBOARD SHORTCUTS     ****************/
document.addEventListener('keydown', e => {
  switch (e.code) {
    case 'KeyB':
      targetTool = 'bucket';
      break;
    case 'KeyP':
      targetTool = 'pencil';
      break;
    case 'KeyC':
      targetTool = 'picker';
      break;
    default:
      return;
  }
  const targetToolEl = document.querySelector(`#${targetTool}`);
  const prevActiveToolEl = document.querySelector('.tool--active');
  prevActiveToolEl.classList.remove('tool--active');
  targetToolEl.classList.add('tool--active');
  app.tools(targetTool);
});
// ****************  end of  KEYBOARD SHORTCUTS     ****************/
