import clearCanvas from './clearCanvas';

describe('logoutGoogleAccount for google authentification', () => {
  it('canvasResolutionHandler should return newpixelSize', () => {
    const canvas = {
      getContext: msg => {
        return {
          clearRect: (x0y0, width, height) => {},
        };
      },
    };
    const piskelImg = ['data0', 'data1', 'data2'];
    let currentCount = 0;
    localStorage.setItem('piskelImg', JSON.stringify(piskelImg));

    clearCanvas(canvas, piskelImg, currentCount);
    expect(JSON.parse(localStorage.getItem('piskelImg'))).toStrictEqual(['', 'data1', 'data2']);

    currentCount = 2;
    clearCanvas(canvas, piskelImg, currentCount);
    expect(JSON.parse(localStorage.getItem('piskelImg'))).toStrictEqual(['', 'data1', '']);
  });
});
