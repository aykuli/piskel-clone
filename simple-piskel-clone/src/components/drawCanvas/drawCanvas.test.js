import { drawOnCanvas, canvasResolutionHandler } from './drawCanvas';

const canvas = {
  width: 128,
  height: 128,
  getContext: str => {
    return {
      clearRect: (x0, y0, width, height) => 'cleared',
      drawImage: (img, x0, y0, width, height) => {},
    };
  },
};

describe('drawCanvas module functions', () => {
  it('drawOnCanvas should return ctx Object', () => {
    const dataURI = 'data:image/png;base64,iVBORw0K...';
    const ctx = canvas.getContext('2d');
    const res = drawOnCanvas(canvas, dataURI);
    expect(res.clearRect(0, 0, canvas.width, canvas.height)).toBe('cleared');
  });

  it('canvasResolutionHandler should return newpixelSize', () => {
    const e = { target: { tagName: 'BUTTON', dataset: { size: 32 } } };
    const pixelSize = 1;
    const currentCount = 0;
    const drawOnCanvas = (canvas, img) => {};
    const highlightTarget = (target, str) => {};

    localStorage.setItem('piskelPixelSize', 1);
    localStorage.setItem('piskelImg', JSON.stringify(['']));

    const res = canvasResolutionHandler(e, pixelSize, canvas, currentCount, drawOnCanvas, highlightTarget);
    expect(res).toBe(4);
  });
});
