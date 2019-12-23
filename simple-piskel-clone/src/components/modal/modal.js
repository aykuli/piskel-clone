export default function popupToggle(isToAdd = false) {
  console.log('popup toogle');
  const modalLoadImg = document.querySelector('.modal__no-image');
  const modalOverlay = document.querySelector('.modal__overlay');

  if (localStorage.getItem('isImgLoaded') === 'false') {
    modalLoadImg.classList.remove('display-block');
    modalOverlay.classList.remove('display-block');
  }
  if (isToAdd) {
    modalLoadImg.classList.add('display-block');
    modalOverlay.classList.add('display-block');
  }
}
