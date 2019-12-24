import './tools.scss';
function toolsHandler(canvas, tool) {
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

export { toolsHandler };
