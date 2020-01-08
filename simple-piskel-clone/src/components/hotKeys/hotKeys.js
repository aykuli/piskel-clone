import './hotKeys.scss';

function classToggler(toggledClass, isHotKeyOpen, ...args) {
  args.forEach(arg => {
    arg.classList.toggle(toggledClass);
  });
  return !isHotKeyOpen;
}

function setExistKeyInMap(code, toolToChange, map, getDomEl) {
  // if set the same value skip
  if (map.get(code) === toolToChange) return;

  // save tool that was on that key
  const buf = map.get(code);

  // delete old (key, value) of old tool
  map.delete(code);
  // delete old (key, value) of target tool
  map.forEach((val, key, mapInner) => {
    if (val === toolToChange) {
      mapInner.delete(key);
    }
  });
  map.delete(code);

  // set code new tool
  map.set(code, toolToChange);

  // old tool no more in map, highlight it in window
  const elToHighlightAsWithoutKey = getDomEl(`.hotKeys__item--${buf}`);

  elToHighlightAsWithoutKey.children[1].classList.add('hotKeys__ecode--unsetted');
  elToHighlightAsWithoutKey.children[1].innerText = '???';
}

export { classToggler, setExistKeyInMap };
