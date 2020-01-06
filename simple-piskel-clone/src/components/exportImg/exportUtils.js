function saveHandler(e, canvas, gifSave, apngSave) {
  switch (e.target.dataset.save) {
    case 'gif':
      gifSave(canvas);
      break;
    case 'apng':
      apngSave(canvas);
      break;
    default:
      return;
  }
}

export { saveHandler };
