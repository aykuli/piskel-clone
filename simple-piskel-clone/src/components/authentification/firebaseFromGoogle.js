import './auth.scss';
// Firebase App (the core Firebase SDK) for google authentification
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

function firebaseInit() {
  // Firebase project configuration from google-firebase
  const firebaseConfig = {
    apiKey: 'AIzaSyARJwn4pidGuuTH8d0Cwq6iKkofYZZzW3c',
    authDomain: 'aykuli-simple-piskel-clone.firebaseapp.com',
    databaseURL: 'https://aykuli-simple-piskel-clone.firebaseio.com',
    projectId: 'aykuli-simple-piskel-clone',
    storageBucket: 'aykuli-simple-piskel-clone.appspot.com',
    messagingSenderId: '958250490194',
    appId: '1:958250490194:web:ab19f66023057e3c7c828b',
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}

function loginGoogleAccount(authElements, createPopup) {
  const [authName, authPhoto, authLoginBtn, authLogoutBtn] = authElements;
  var provider = new firebase.auth.GoogleAuthProvider();
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
    })
    .catch(e => {
      createPopup(e.message);
    });
}

function logoutGoogleAccount(authElements) {
  const [authName, authPhoto, authLoginBtn, authLogoutBtn] = authElements;
  firebase.auth().signOut();
  authPhoto.setAttribute('src', '');
  authName.innerText = '';

  authLoginBtn.style.display = 'block';
  authLogoutBtn.style.display = 'none';
}

export { firebaseInit, loginGoogleAccount, logoutGoogleAccount };
