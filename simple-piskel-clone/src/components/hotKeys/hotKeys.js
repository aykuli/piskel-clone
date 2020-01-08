import './hotKeys.scss';

function classToggler(toggledClass, isHotKeyOpen, ...args) {
  args.forEach(arg => {
    arg.classList.toggle(toggledClass);
  });
  return !isHotKeyOpen;
}

export { classToggler };
