function clearSession() {
  localStorage.removeItem('piskelImg');
  localStorage.removeItem('piskelPrimaryColor');
  localStorage.removeItem('piskelSecondaryColor');
  localStorage.removeItem('piskelTool');
  localStorage.removeItem('piskelFps');
  localStorage.removeItem('piskelCounter');
  location.reload();
}

function saveImgsInLocalStorage(piskelImg, canvas, currentCount) {
  const dataURI = canvas.toDataURL();
  piskelImg[currentCount] = dataURI;

  localStorage.removeItem('piskelImg');
  localStorage.setItem('piskelImg', JSON.stringify(piskelImg));
}

export { clearSession, saveImgsInLocalStorage };
