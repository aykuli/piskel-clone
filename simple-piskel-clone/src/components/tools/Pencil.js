import { getXYCoors } from './utils';

export default class Pencil {
  constructor(canvas, ctx, size, currentColor) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.isDrawing = false;
    this.currentColor = currentColor;
    [this.x1, this.y1, this.x2, this.y2] = new Array(4).fill(0);
    this.size = size;
  }

  plot(x, y) {
    this.ctx.fillStyle = this.currentColor;
    this.ctx.fillRect(x, y, 1, 1);
  }

  // Bresenham algorithm
  bresenham = (x1, x2, y1, y2) => {
    if (!this.isDrawing) return;
    this.isDrawing = true;
    let [innerX1, innerY1] = [x1, y1];
    const [innerX2, innerY2] = [x2, y2];

    const deltaX = Math.abs(x2 - x1);
    const deltaY = Math.abs(y2 - y1);
    const signX = x1 < x2 ? 1 : -1;
    const signY = y1 < y2 ? 1 : -1;
    let err = deltaX - deltaY;

    this.plot(innerX2, innerY2);
    while (innerX1 !== innerX2 || innerY1 !== innerY2) {
      this.plot(innerX1, innerY1);
      const err2 = err * 2;
      if (err2 > -deltaY) {
        err -= deltaY;
        innerX1 += signX;
      }
      if (err2 < deltaX) {
        err += deltaX;
        innerY1 += signY;
      }
    }
  };

  draw = e => {
    if (this.isDrawing) {
      [this.x2, this.y2] = getXYCoors(e, this.size);

      this.bresenham(this.x1, this.x2, this.y1, this.y2);

      [this.x1, this.y1] = [this.x2, this.y2];
    }
  };

  drawOnMouseDown = e => {
    this.isDrawing = true;

    [this.x1, this.y1] = getXYCoors(e, this.size);
    this.plot(this.x1, this.y1);
  };

  drawMouseUp = e => {
    [this.x2, this.y2] = getXYCoors(e, this.size);
    this.bresenham(this.x1, this.x2, this.y1, this.y2);
    this.isDrawing = false;
    // this.saveInLocalStorage('piskelCloneImg');
  };

  handler = targetTool => {
    if (targetTool === 'pencil') {
      console.log('pencil handler');
      this.canvas.addEventListener('mousedown', this.drawOnMouseDown);
      this.canvas.addEventListener('mousemove', this.draw);
      this.canvas.addEventListener('mouseup', this.drawMouseUp);
      this.canvas.addEventListener('mouseout', () => {
        this.isDrawing = false;
      });
    } else {
      this.canvas.removeEventListener('mousemove', this.draw);
      this.canvas.removeEventListener('mousedown', this.drawOnMouseDown);
      this.canvas.removeEventListener('mouseup', this.drawMouseUp);
    }
  };
}
