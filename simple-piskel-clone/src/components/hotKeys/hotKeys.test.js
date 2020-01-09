import { classToggler, setExistKeyInMap, setKeyToolsMap } from './hotKeys';

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
const domVirt = new JSDOM(
  `<!DOCTYPE html>
<html lang="en">
<body>
    <div class="btns__container save">
        <button class="btn save--apng" data-save="apng">.apng</button>
        <button class="btn save--gif" data-save="gif">.gif</button>
    </div>
    <ul class="tools__container">
        <li id='pencil' class="tool tool--pen tool--active tip" data-tooltip="Pen tool(P)"><span class="visually-hidden">Pencil tool</span></li>
        <li id='stroke' class="tool tool--stroke tip" data-tooltip="Line tool(L)"><span class="visually-hidden">Line tool</span></li>
        <li id='bucket' class="tool tool--bucket tip" data-tooltip="Bucket tool(B)"><span class="visually-hidden">Bucket tool</span></li>
        <li id='bucketSamePixel' class="tool tool--bucket-same-pixel tip" data-tooltip="Paint all pixels of the same color tool(A)"><span class="visually-hidden">Paint all pixels of the same color tool</span></li>
        <li id='eraser' class="tool tool--eraser tip" data-tooltip="Eraser tool(E)"><span class="visually-hidden">Eraser tool</span></li>
        <li id='picker' class="tool tool--picker tip" data-tooltip="Picker tool(C)"><span class="visually-hidden">Picker tool</span></li>
        <li id='empty' class="tool tool--empty tip" data-tooltip="Clear canvas(Z)"><span class="visually-hidden">Clear canvas</span></li>
    </ul>

    <div class="hotKeys__wrap visually-hidden">
        <h3 class="hotKeys__header">
            <span class="hotKeys__title">Keyboard shortcuts</span>
            <span class="hotKeys__close">X</span>
        </h3>
        <ul class="hotKeys">
            <li class="hotKeys__item hotKeys__item--pencil" data-tool="pencil">
                <img src="./components/tools/img/pencil.svg" class="hotKeys__icon" width="20" height="20">
                <p class="hotKeys__ecode"></p>
                <span class="hotKeys__tool">Pencil</span>
            </li>
            <li class="hotKeys__item hotKeys__item--stroke" data-tool="stroke">
                <img src="./components/tools/img/stroke.svg" class="hotKeys__icon" width="20" height="20">
                <p class="hotKeys__ecode"></p>
                <span class="hotKeys__tool">Stroke</span>
            </li>
            <li class="hotKeys__item hotKeys__item--bucket" data-tool="bucket">
                <img src="./components/tools/img/bucket.svg" class="hotKeys__icon" width="20" height="20">
                <p class="hotKeys__ecode"></p>
                <span class="hotKeys__tool">Bucket</span>
            </li>
            <li class="hotKeys__item hotKeys__item--bucketAll" data-tool="bucketAll">
                <img src="./components/tools/img/bucket_same_pixels.svg" class="hotKeys__icon" width="20" height="20">
                <p class="hotKeys__ecode"></p>
                <span class="hotKeys__tool">Bucket all the same pixels</span>
            </li>
            <li class="hotKeys__item hotKeys__item--eraser" data-tool="eraser">
                <img src="./components/tools/img/eraser.svg" class="hotKeys__icon" width="20" height="20">
                <p class="hotKeys__ecode"></p>
                <span class="hotKeys__tool">Eraser</span>
            </li>
            <li class="hotKeys__item hotKeys__item--picker" data-tool="picker">
                <img src="./components/tools/img/picker.svg" class="hotKeys__icon" width="20" height="20">
                <p class="hotKeys__ecode"></p>
                <span class="hotKeys__tool">Picker</span>
            </li>
            <li class="hotKeys__item hotKeys__item--cleanCanvas" data-tool="cleanCanvas">
                <img src="./components/tools/img/blank.svg" class="hotKeys__icon" width="20" height="20">
                <p class="hotKeys__ecode"></p>
                <span class="hotKeys__tool">Clear canvas</span>
            </li>
        </ul>
    </div>
</body>
</html>
`,
  options
).window;

/* eslint-disable */
describe('hotKeys manipulating functions', () => {
  //   const getDomEl = selector => {
  //     let el = domVirt.window.document.querySelector(selector);
  //     let obj = Object.assign({}, el);
  //     Object.defineProperty(obj, 'children', {
  //       value: { '1': { classList: { add: str => str, toggle: str => str }, innerText: 'innerText of children[1]' } },
  //       enumerable: true,
  //       writable: true,
  //       configurable: true,
  //     });

  //     return obj;
  //   };

  const getDomEl = selector => domVirt.window.document.querySelector(selector);

  it('classToggler should toggle class and return inversed value of isHotKeyOpen', () => {
    const list = domVirt.window.document.querySelector('.tools__container');
    const btns = domVirt.window.document.querySelector('.btns__container');
    const toggledClass = 'toggler';
    let isHotKeyOpen = true;

    isHotKeyOpen = classToggler(toggledClass, isHotKeyOpen, list, btns);
    expect(isHotKeyOpen).toBeFalsy();
    expect(list.classList).toContain(toggledClass);
    expect(btns.className).toContain(toggledClass);

    isHotKeyOpen = classToggler(toggledClass, isHotKeyOpen, list, btns);
    expect(isHotKeyOpen).toBeTruthy();
    expect(list.classList).not.toContain(toggledClass);
    expect(btns.className).not.toContain(toggledClass);
  });

  it('setExistKeyInMap shoul refresh map', () => {
    const code = 'KeyA';
    let toolToChange = 'pencil';
    let map = new Map([
      ['KeyP', 'pencil'],
      ['KeyL', 'stroke'],
      ['KeyA', 'bucketAll'],
    ]);

    const res = setExistKeyInMap(code, toolToChange, map);

    expect(map.has(code)).toBeTruthy();
    expect(map.get(code)).toBe(toolToChange);
    expect(res).toBe('bucketAll');
  });

  it('setKeyToolsMap shoul refresh map', () => {
    const code = 'KeyA';
    let toolToChange = 'pencil';
    let map = new Map([
      ['KeyP', 'pencil'],
      ['KeyL', 'stroke'],
      ['KeyA', 'bucketAll'],
    ]);

    const res = setKeyToolsMap(code, map, toolToChange, getDomElement, setExistKeyMap, refreshLocalStorageMap);

    expect(map.has(code)).toBeTruthy();
    expect(map.get(code)).toBe(toolToChange);
    expect(res).toBe('bucketAll');
  });
});
