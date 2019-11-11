class Picture {
  constructor(scale, canvas, ctx, currentColor) {
    let ctxData = [];
    this.scale = scale;
    this.canvas = canvas;
    this.ctx = ctx;
    this.row = this.canvas.width / this.scale;
    this.column = this.canvas.height / this.scale;
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;
    this.currentColor = currentColor;
    this.prevColorCache = '#ffffff';
  }
  emptyCanvas = () => {
    this.ctxData = [];
    for (let i = 0; i < this.row; i++) {
      this.ctxData.push([]);
      for (let j = 0; j < this.column; j++) {
        this.ctxData[i].push('#ffffff');
      }
    }
    this.loadPrevImage();
  };

  clearCanvas = () => {
    console.log('emptyCanvas');
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.column; j++) {
        this.ctxData[i][j] = '#ffffff';
        this.ctx.fillStyle = this.ctxData[i][j];
        this.ctx.fillRect(i * this.scale, j * this.scale, this.scale, this.scale);
      }
    }
  };

  loadPrevImage = () => {
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.column; j++) {
        this.ctx.fillStyle = this.ctxData[j][i];
        this.ctx.fillRect(i * this.scale, j * this.scale, this.scale, this.scale);
      }
    }
  };

  localStorageSave = () => {
    let json = JSON.stringify(this.ctxData);
    localStorage.removeItem('userPaint');
    localStorage.setItem('userPaint', json);
  };

  saveCanvas = () => {
    function download(canvas, filename) {
      /// create an "off-screen" anchor tag
      let lnk = document.createElement('a'),
        e;
      /// the key here is to set the download attribute of the a tag
      lnk.download = filename;
      /// convert canvas content to data-uri for link. When download
      /// attribute is set the content pointed to by link will be
      /// pushed as "download" in HTML5 capable browsers
      lnk.href = canvas.toDataURL('image/png;base64');
      /// create a "fake" click-event to trigger the download
      if (document.createEvent) {
        e = document.createEvent('MouseEvents');
        e.initMouseEvent(
          'click',
          true,
          true,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null,
        );

        lnk.dispatchEvent(e);
      } else if (lnk.fireEvent) {
        lnk.fireEvent('onclick');
      }
    }
    download(canvas, 'myimage.png');
  };

  highlightActiveTool = targetToolEl => {
    const prevActiveTool = document.querySelector('.tool--active');
    prevActiveTool.classList.remove('tool--active');
    targetToolEl.classList.add('tool--active');
  };

  draw = e => {
    if (!this.isDrawing) return;
    this.isDrawing = true;
    this.ctx.fillStyle = this.currentColor.value;

    [this.lastX, this.lastY] = [
      Math.ceil(e.offsetX / this.scale),
      Math.ceil(e.offsetY / this.scale),
    ];
    this.ctx.fillRect(
      (this.lastX - 1) * this.scale,
      (this.lastY - 1) * this.scale,
      this.scale,
      this.scale,
    );
    this.ctxData[this.lastY - 1][this.lastX - 1] = this.ctx.fillStyle;
  };

  drawIsTrue = e => {
    this.isDrawing = true;
    this.draw(e);
  };

  pencilTool = targetTool => {
    if (targetTool === 'pencil') {
      console.log('-------  pencil add ----------------');
      this.canvas.addEventListener('mousemove', this.draw);
      this.canvas.addEventListener('mousedown', this.drawIsTrue);
      this.canvas.addEventListener('mouseup', () => {
        this.isDrawing = false;
        this.localStorageSave();
      });
      this.canvas.addEventListener('mouseout', () => {
        this.isDrawing = false;
      });
    } else {
      this.canvas.removeEventListener('mousemove', this.draw);
      this.canvas.removeEventListener('mousedown', this.drawIsTrue);
    }
  };

  bucketTool = targetTool => {
    if (targetTool === 'bucket') {
      console.log('-------  bucket add ----------------');
      canvas.addEventListener('mousedown', this.floodFill);
    } else {
      canvas.removeEventListener('mousedown', this.floodFill);
      console.log('-------  bucket remove ----------------');
      console.log('AFTER Bucket ctxData: ', this.ctxData);
    }
  };

  floodFill = e => {
    console.log('ctxData = ', this.ctxData);
    [this.lastX, this.lastY] = [
      Math.ceil(e.offsetX / this.scale),
      Math.ceil(e.offsetY / this.scale),
    ];
    let colorPrev = this.ctxData[this.lastY - 1][this.lastX - 1];
    console.log('colorPrev =', colorPrev);
    floodFillInner(
      this.lastX - 1,
      this.lastY - 1,
      colorPrev,
      this.currentColor.value,
      this.scale,
      this.ctxData,
      this.canvas,
    );

    function floodFillInner(x, y, colorPrev, targetColor, scale, ctxData, canvas) {
      if (targetColor === colorPrev) return;
      if (ctxData[y][x] !== colorPrev) return;
      ctxData[y][x] = targetColor;
      ctx.fillStyle = targetColor;
      ctx.fillRect(x * scale, y * scale, scale, scale);

      const around = [{ dx: 0, dy: -1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }, { dx: 0, dy: +1 }];

      for (let { dx, dy } of around) {
        if (
          x + dx >= 0 &&
          x + dx < canvas.width / scale &&
          (y + dy >= 0 && y + dy < canvas.height / scale)
        ) {
          try {
            floodFillInner(x + dx, y + dy, colorPrev, targetColor, scale, ctxData, canvas);
            console.log('inside floodFillInner');
          } catch (err) {
            console.log('stak overload');
            setTimeout(() => {
              floodFillInner(x + dx, y + dy, colorPrev, targetColor, scale, ctxData, canvas);
            }, 0);
          }
        }
      }
    }
  };

  watchColor = (prevColor, newColor) => {
    prevColor.children[0].style.background = this.ctx.fillStyle;
    prevColorCache = this.ctx.fillStyle;
    this.ctx.fillStyle = newColor;
    this.currentColor.value = newColor;
  };

  pickerTool = targetTool => {
    if (targetTool === 'picker') {
      canvas.addEventListener('click', this.colorPicker);
    } else {
      canvas.removeEventListener('click', this.colorPicker);
    }
  };
  colorPicker = e => {
    let [x, y] = [Math.ceil(e.offsetX / this.scale), Math.ceil(e.offsetY / this.scale)];
    console.log(`ctxData[${y}][${x}] = ${this.ctxData[y - 1][x - 1]}`);
    let choosedColor = this.ctxData[y - 1][x - 1];
    console.log('in colorPicker: choosedColor: ', choosedColor);
    // this.watchColor(this.currentColor, choosedColor);
    this.ctx.fillStyle = choosedColor;

    currentColor.value = choosedColor;
  };

  tools = targetTool => {
    this.pencilTool(targetTool);
    this.bucketTool(targetTool);
    this.pickerTool(targetTool);
  };
}

// Start working with index.html step by step
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const pane = document.querySelector('.pane');
const currentColor = document.getElementById('currentColor');
const prevColor = document.querySelector('.color--prev');
const colorRed = document.querySelector('.color--red');
const colorBlue = document.querySelector('.color--blue');
let prevColorCache = '#ffffff';

let app = new Picture(32, canvas, ctx, currentColor);

/**********   INITIALIZATION    ************ */
// Initialization process, loading prev image
window.onload = function() {
  console.log('page refreshed');
  if (
    localStorage.getItem('userPaint') === null ||
    localStorage.getItem('userPaint') === undefined
  ) {
    app.emptyCanvas();
    let json = JSON.stringify(app.ctxData);

    localStorage.setItem('userPaint', app.ctxData);
  } else {
    let json = localStorage.getItem('userPaint');
    app.ctxData = JSON.parse(json);
    app.loadPrevImage();
  }
};

window.onbeforeunload = () => app.localStorageSave();
/**********   and of INITIALIZATION    ************ */

/********************    CLEAR CANVAS    *******************/
let empty = document.getElementById('empty');
empty.addEventListener('click', app.emptyCanvas);
/*****************  end of  CLEAR CANVAS    ****************/

/********************    SAVE IMAGE    *********************/
let save = document.getElementById('save');
save.addEventListener('click', app.saveCanvas);
/*****************  end of  SAVE IMAGE    ******************/

/********************       TOOLS       *******************/
let targetTool = 'pencil';
app.pencilTool(targetTool);

pane.addEventListener('click', e => {
  let targetToolEl = e.target.closest('li');
  if (targetToolEl === null) return;
  targetTool = targetToolEl.id;
  app.highlightActiveTool(targetToolEl);
  app.tools(targetTool);
});
/********************    end of TOOLS    *******************/

/******************    COLOR MANAGING    *******************/
colorRed.addEventListener('click', () => {
  currentColor.value = '#f74242';
  app.watchColor(prevColor, currentColor.value, false);
});
colorBlue.addEventListener('click', () => {
  currentColor.value = '#316cb9';
  app.watchColor(prevColor, currentColor.value, false);
});
prevColor.addEventListener('click', () => {
  currentColor.value = prevColorCache;
  app.watchColor(prevColor, currentColor.value, false);
});
currentColor.addEventListener('change', e => {
  app.watchColor(prevColor, currentColor.value, false);
});
/*************    end of  COLOR MANAGING      **************/

/****************    KEYBOARD SHORTCUTS     ****************/
document.addEventListener('keydown', e => {
  console.log(e.code);
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
  }
  let targetToolEl = document.getElementById(targetTool);
  app.highlightActiveTool(targetToolEl);
  app.tools(targetTool);
});
/****************    KEYBOARD SHORTCUTS     ****************/
