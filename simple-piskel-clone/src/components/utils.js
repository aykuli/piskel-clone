function RGBToHex(data) {
  let dataHex = '#';
  for (let i = 0; i < 3; i += 1) {
    const color = data[i];
    const letter = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
    const firstLetter = letter[Math.floor(color / 16)];
    const secondLetter = letter[color % 16];
    dataHex = dataHex + firstLetter + secondLetter;
  }
  return dataHex;
}

function saveImgsInLocalStorage(arrImg, canvas, currentCount) {
  const dataURI = canvas.toDataURL();
  arrImg[currentCount] = dataURI;
  localStorage.removeItem('piskelImg');
  localStorage.setItem('piskelImg', JSON.stringify(arrImg));

  // const dataURI = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
  // localStorage.setItem(localStorageKey, dataURI);
}

export { RGBToHex, saveImgsInLocalStorage };