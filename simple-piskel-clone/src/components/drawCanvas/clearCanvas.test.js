import clearCanvas from './clearCanvas';

require('@babel/register');
const jsdom = require('jsdom');
const getType = require('jest-get-type');

const { JSDOM } = jsdom;

const options = {
  contentType: 'text/html',
  includeNodeLocations: true,
  storageQuota: 10000000,
  runScripts: 'outside-only',
};

// создаем виртуальный DOM в Node.js
const domVirt = new JSDOM(
  `<!DOCTYPE html>
<html lang="en">
<body>
    <nav class="nav">
        <div class="nav__user" title="aynurshauerman2019@gmail.com">
            <img src="#" alt="" class="auth__photo" width="28" height="28">
            <span class="auth__name">aynur shauerman</span>
        </div>
        <button class="btn auth__login" style="display: none;">Sign in</button>
        <button class="btn auth__logout" style="display: block;">Sign out</button>
    </nav>
</body>
</html>
`,
  options
).window;

describe('logoutGoogleAccount for google authentification', () => {
  it('canvasResolutionHandler should return newpixelSize', () => {});
});
