function animate(draw, fpsWatch, piskelImg, currentCount) {
  // console.log(currentCount);
  // let start = performance.now();
  // let i = 0;
  // let timeFraction = 0;
  // let prev = timeFraction;
  // requestAnimationFrame(function animate(time) {
  //   let fps = fpsWatch();
  //   console.log(fps);
  //   if (+fps === 0) {
  //     console.log('fps === 0');
  //     console.log(currentCount);
  //     draw(currentCount);
  //   } else {
  //     let duration = 1000 / fps;
  //     prev = timeFraction;
  //     timeFraction = Math.abs(Math.floor((time - start) / duration));
  //     if (timeFraction !== prev) {
  //       draw(i); // draw frame
  //       i++;
  //       i %= piskelImg.length;
  //     }
  //     if (timeFraction >= 0) {
  //       requestAnimationFrame(animate);
  //     }
  //   }
  // });
}

// fpsWatch(fpsInput,fpsOnPage) {
//   fpsInput.addEventListener('change', () => {
//     fpsOnPage.innerText = fpsInput.value;
//     return fpsInput.value;
//   });
//   return fps;
// }

export { animate };
