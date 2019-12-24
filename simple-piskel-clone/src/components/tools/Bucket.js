import { RGBToHex, getXYCoors } from './utils';

export default class Bucket {
  constructor(canvas, ctx, size, currentColor) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.size = size;
    this.currentColor = currentColor;
  }

  handler(targetTool) {
    if (targetTool === 'bucket') {
      this.canvas.addEventListener('mousedown', this.floodFill);
    } else {
      this.canvas.removeEventListener('mousedown', this.floodFill);
    }
  }

  floodFill = e => {
    let [x, y] = getXYCoors(e, this.size);

    const targetColor = RGBToHex(this.ctx.getImageData(x, y, 1, 1).data);
    const replacementColor = this.currentColor;
    if (targetColor === replacementColor) return;
    this.ctx.fillStyle = replacementColor;
    this.ctx.fillRect(x, y, 1, 1);
    let Queue = [];

    Queue.push([x, y]);
    while (Queue.length > 0) {
      if (
        x + 1 > 0 &&
        x + 1 < this.canvas.width &&
        targetColor === RGBToHex(this.ctx.getImageData(x + 1, y, 1, 1).data)
      ) {
        Queue.push([x + 1, y]);
        this.ctx.fillRect(x + 1, y, 1, 1);
      }

      if (
        x - 1 >= 0 &&
        x - 1 < this.canvas.width &&
        targetColor === RGBToHex(this.ctx.getImageData(x - 1, y, 1, 1).data)
      ) {
        Queue.push([x - 1, y]);
        this.ctx.fillRect(x - 1, y, 1, 1);
      }

      if (
        y + 1 > 0 &&
        y + 1 < this.canvas.width &&
        targetColor === RGBToHex(this.ctx.getImageData(x, y + 1, 1, 1).data)
      ) {
        Queue.push([x, y + 1]);
        this.ctx.fillRect(x, y + 1, 1, 1);
      }

      if (
        y - 1 >= 0 &&
        y - 1 < this.canvas.width &&
        targetColor === RGBToHex(this.ctx.getImageData(x, y - 1, 1, 1).data)
      ) {
        Queue.push([x, y - 1]);
        this.ctx.fillRect(x, y - 1, 1, 1);
      }

      Queue.shift(0);
      if (Queue.length > 0) {
        [x, y] = [Queue[0][0], Queue[0][1]];
      }
    }
    Queue = [];
  };
}
