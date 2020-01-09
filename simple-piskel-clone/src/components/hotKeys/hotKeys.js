import './hotKeys.scss';

function classToggler(toggledClass, isHotKeyOpen, ...args) {
  args.forEach(arg => {
    arg.classList.toggle(toggledClass);
  });
  return !isHotKeyOpen;
}

function setExistKeyInMap(code, toolToChange, map) {
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

  return buf; // eslint-disable-line
}

function manageStyleToolToChange(code, toolToChange, getDomElement) {
  const toolToChangeDom = getDomElement(`.hotKeys__item--${toolToChange}`);
  toolToChangeDom.children[1].innerText = code.slice(3);
  toolToChangeDom.children[1].classList.remove('hotKeys__ecode--unsetted');

  const highlighted = getDomElement('.hotKeys__ecode--highlight');
  if (highlighted !== null) highlighted.classList.remove('hotKeys__ecode--highlight');
}

function highlightUnsettedTool(el, getDomElement) {
  const elToHighlightAsWithoutKey = getDomElement(`.hotKeys__item--${el}`);
  if (elToHighlightAsWithoutKey !== null) {
    elToHighlightAsWithoutKey.children[1].classList.add('hotKeys__ecode--unsetted');
    elToHighlightAsWithoutKey.children[1].innerText = '???';
  }
}

function setKeyToolsMap(
  code,
  map,
  toolToChange,
  getDomElement,
  setExistKeyMap,
  refreshLocalStorageMap,
  manageStyleTool,
  highlightUnsetted
) {
  if (code === 'KeyX') return;

  if (map.has(code)) {
    const buf = setExistKeyMap(code, toolToChange, map);

    // old tool no more in map, highlight it in window
    highlightUnsetted(buf, getDomElement);
  } else {
    map.set(code, toolToChange);
  }
  manageStyleTool(code, toolToChange, getDomElement);
  refreshLocalStorageMap('piskelHotKeys', map);
}
export { classToggler, setExistKeyInMap, setKeyToolsMap, manageStyleToolToChange, highlightUnsettedTool };
