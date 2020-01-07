import { drawOnCanvas, canvasResolutionHandler } from './drawCanvas';

describe('drawCanvas module functions', () => {
  it('canvasResolutionHandler should return newpixelSize', () => {
    const e = { target: { tagName: 'BUTTON', dataset: { size: 32 } } };
    const pixelSize = 1;
    const canvas = { width: 128, height: 128 };
    const currentCount = 0;
    const drawOnCanvas = (canvas, img) => {};
    const highlightTarget = (target, str) => {};

    localStorage.setItem('piskelPixelSize', 1);
    localStorage.setItem('piskelImg', JSON.stringify(['']));

    const res = canvasResolutionHandler(e, pixelSize, canvas, currentCount, drawOnCanvas, highlightTarget);
    expect(res).toBe(4);
  });
});
