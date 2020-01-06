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

function saveImgsInLocalStorage(piskelImg, canvas, currentCount) {
  const dataURI = canvas.toDataURL();
  piskelImg[currentCount] = dataURI;

  // const ctx = canvas.getContext('2d');
  // const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // piskelImg[currentCount] = imgData;

  localStorage.removeItem('piskelImg');
  localStorage.setItem('piskelImg', JSON.stringify(piskelImg));
}

function createPopup(msg) {
  const popup = document.querySelector('.popup');
  popup.classList.remove('visually-hidden');
  popup.innerText = msg;
  setTimeout(() => popup.classList.add('visually-hidden'), 2500);
}

export { RGBToHex, saveImgsInLocalStorage, createPopup };
