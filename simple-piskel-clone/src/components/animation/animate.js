function animate(draw, fpsWatch, piskelImg, currentCount) {
  console.log(currentCount);
  let start = performance.now();
  let i = 0;
  let timeFraction = 0;
  let prev = timeFraction;
  // requestAnimationFrame(function animate(time) {
  //   console.log('fpsWatch: ', fpsWatch());
  //   let fps = fpsWatch();
  //   if (+fps === 0) {
  //     console.log('fps === 0');
  //     console.log(currentCount);
  //     i = currentCount;
  //     // requestAnimationFrame(animate);
  //     draw(i);
  //     fps = fpsWatch();
  //   } else {
  //     let duration = 1000 / fps;
  //     prev = timeFraction;
  //     timeFraction = Math.abs(Math.floor((time - start) / duration));
  //     if (timeFraction !== prev) {
  //       draw(i); // draw frame
  //       i++;
  //       i %= piskelImg.length;
  //     }
  //   }
  //   if (timeFraction >= 0 && +fps > 0) {
  //     console.log(fps);
  //     requestAnimationFrame(animate);
  //   }
  // });
}

export { animate };
