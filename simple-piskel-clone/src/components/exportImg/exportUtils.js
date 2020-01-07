function saveHandler(e, canvas, gifSave, apngSave, GIFEncoder) {
  let res;
  switch (e.target.dataset.save) {
    case 'gif':
      res = gifSave(canvas, GIFEncoder);
      break;
    case 'apng':
      res = apngSave(canvas);
      break;
    default:
      res = "image haven't saved";
      return res;
  }
  return res;
}

export { saveHandler };
