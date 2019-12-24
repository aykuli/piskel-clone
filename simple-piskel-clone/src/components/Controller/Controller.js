import Pencil from '../tools/Pencil';
import Bucket from '../tools/Bucket';
import Picker from '../tools/Picker';

import { toolsHandler } from '../tools/tools';

export default class Controller {
  constructor(view, canvasSize) {
    this.init();
    this.tool = [
      new Pencil(view.canvas, view.ctx, canvasSize, '#ff0000'),
      new Bucket(view.canvas, view.ctx, canvasSize, '#ff0000'),
      new Picker(view.canvas, view.ctx),
    ];
    toolsHandler(view.canvas, this.tool);
  }

  init() {
    console.log('init process');
  }
}
