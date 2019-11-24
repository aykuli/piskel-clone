const Picture = require('../scripts/Picture');

test('typeof Picture must be function', () => {
  expect(typeof Picture).toBe('function');
});

test('Picture.getXYCoors(e) must solve right coors from e event', () => {
  const app = new Picture(4, 0, '000000', 0, 0);
  const e = { offsetX: 100, offsetY: 400 };

  expect(app.getXYCoors(e)).toStrictEqual([25, 100]);
});
