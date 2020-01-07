import './auth.scss';

function loginGoogleAccount(firebase, authElements, createPopup) {
  const [authName, authPhoto, authLoginBtn, authLogoutBtn] = authElements;
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().useDeviceLanguage();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      // The signed-in user info.
      const user = result.user;

      authPhoto.setAttribute('src', user.providerData[0].photoURL);
      authName.innerText = user.providerData[0].displayName;
      authName.parentNode.title = user.email;
      authLoginBtn.style.display = 'none';
      authLogoutBtn.style.display = 'block';
      return result.user;
    })
    .catch(e => {
      createPopup(e.message);
    });
  return 'authentification passed';
}

function logoutGoogleAccount(firebase, authElements) {
  const [authName, authPhoto, authLoginBtn, authLogoutBtn] = authElements;
  firebase.auth().signOut();
  authPhoto.setAttribute('src', '');
  authName.innerText = '';

  authLoginBtn.style.display = 'block';
  authLogoutBtn.style.display = 'none';
  return 'user logged out';
}

export { loginGoogleAccount, logoutGoogleAccount };
