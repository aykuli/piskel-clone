import Pencil from '../tools/Pencil';
import Bucket from '../tools/Bucket';
import Picker from '../tools/Picker';

// import { toolsHandler } from '../tools/tools';

export default class Controller {
  constructor(view, canvasSize) {
    this.init();
    this.pencil = new Pencil(view.canvas, view.ctx, canvasSize, view.primaryColor.value);
    this.bucket = new Bucket(view.canvas, view.ctx, canvasSize, view.primaryColor.value);
    this.picker = new Picker(view.canvas, view.ctx);
    this.tool = [this.pencil, this.bucket, this.picker];
    this.toolsHandler(view.canvas, this.tool);
    this.swapHandler(view.swapColor, view.primaryColor, view.secondaryColor);
  }

  init() {
    console.log('init process');
  }

  swapHandler(swapColor, primaryColor, secondaryColor) {
    console.log(primaryColor.value);
    console.log('swap');
    swapColor.addEventListener('click', () => {
      const buf = primaryColor.value;
      primaryColor.value = secondaryColor.value;
      secondaryColor.value = buf;
    });
    console.log(primaryColor.value);
  }

  toolsHandler(canvas, tool) {
    const tools = document.querySelector('.tools__container');

    tools.addEventListener('click', e => {
      // console.log('toolsHandler');
      const targetToolEl = e.target.closest('li');
      if (targetToolEl === null) return;

      // highlighting choosed tool
      const prevActiveTool = document.querySelector('.tool--active');
      prevActiveTool.classList.remove('tool--active');
      targetToolEl.classList.add('tool--active');

      const targetTool = targetToolEl.id;
      for (let i = 0; i < tool.length; i++) {
        //   console.log(tool[i], targetTool);
        tool[i].handler(targetTool);
      }
    });
  }
}
