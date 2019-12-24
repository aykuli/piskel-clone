import { RGBToHex, getXYCoors } from './utils';

export default class Picker {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  handler(targetTool) {
    if (targetTool === 'picker') {
      console.log('picker');
      this.canvas.addEventListener('click', this.colorPicker);
    } else {
      this.canvas.removeEventListener('click', this.colorPicker);
    }
  }

  colorPicker = e => {
    const [x, y] = getXYCoors(e);
    const choosedColor = this.ctx.getImageData(x, y, 1, 1);
    const color = RGBToHex(choosedColor.data);

    this.ctx.fillStyle = color;
    return color;
  };
}
