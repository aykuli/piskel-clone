import { frameDraw, frameHandler, frameDndHandler, frameAdd, frameDatasetCountSet, frameCopy, frameDel } from './frame';

require('@babel/register');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const options = {
  contentType: 'text/html',
  includeNodeLocations: true,
  storageQuota: 10000000,
  runScripts: 'outside-only',
};

// создаем виртуальный DOM в Node.js
const dom = new JSDOM(
  `<!DOCTYPE html>
<html lang="en">
<body>
  <div class="page__wrap"></div>
</body>
</html>
`,
  options
).window;

const page = dom.window.document.querySelector('.page__wrap');

describe('frame manipulation functions', () => {
  it('gifSave function should return answer with given mock parameters', () => {});
});
