function clearSession() {
  localStorage.removeItem('piskelImg');
  localStorage.removeItem('piskelPrimaryColor');
  localStorage.removeItem('piskelSecondaryColor');
  localStorage.removeItem('piskelTool');
  localStorage.removeItem('piskelFps');
  localStorage.removeItem('piskelCounter');
  localStorage.removeItem('piskelHotKeys');
  location.reload(); // eslint-disable-line
}

function saveImgsInLocalStorage(piskelImg, canvas, currentCount) {
  const dataURI = canvas.toDataURL();
  piskelImg[currentCount] = dataURI; // eslint-disable-line

  localStorage.removeItem('piskelImg');
  localStorage.setItem('piskelImg', JSON.stringify(piskelImg));
  return piskelImg[currentCount];
}

function refreshLocalStorageValue(key, value) {
  localStorage.removeItem(key);
  localStorage.setItem(key, value);
  return localStorage.getItem(key);
}

export { clearSession, saveImgsInLocalStorage, refreshLocalStorageValue };
