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

function setKeyToolsMap(code, map, toolToChange, getDomElement, setExistKeyMap, refreshLocalStorageMap) {
  if (code === 'KeyX') return;

  if (map.has(code)) {
    setExistKeyMap(code, toolToChange, map, getDomElement);
  } else {
    map.set(code, toolToChange);
  }

  // remover unsetted if exist
  const unsetted = getDomElement(`.hotKeys__item--${toolToChange}`);
  if (unsetted !== null) unsetted.children[1].classList.remove('hotKeys__ecode--unsetted');

  const toolToChangeDom = getDomElement(`.hotKeys__item--${toolToChange}`);
  toolToChangeDom.children[1].innerText = code.slice(3);

  const highlighted = getDomElement('.hotKeys__ecode--highlight');
  if (highlighted !== null) highlighted.classList.remove('hotKeys__ecode--highlight');

  refreshLocalStorageMap('piskelHotKeys', map);
}

export { classToggler, setExistKeyInMap, setKeyToolsMap };
