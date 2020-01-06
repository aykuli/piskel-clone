// Firebase App (the core Firebase SDK) for google authentification
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export default function authWithFirebase(authPhoto, authName) {
  // Firebase project configuration from google-firebase
  const firebaseConfig = {
    apiKey: 'AIzaSyARJwn4pidGuuTH8d0Cwq6iKkofYZZzW3c',
    authDomain: 'aykuli-simple-piskel-clone.firebaseapp.com',
    //   authDomain: 'http://localhost:3000/app.html',
    databaseURL: 'https://aykuli-simple-piskel-clone.firebaseio.com',
    projectId: 'aykuli-simple-piskel-clone',
    storageBucket: 'aykuli-simple-piskel-clone.appspot.com',
    messagingSenderId: '958250490194',
    appId: '1:958250490194:web:ab19f66023057e3c7c828b',
  };

  // Initialize Firebase
  const myproj = firebase.initializeApp(firebaseConfig);
  console.log('initAuth = ', myproj);

  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().useDeviceLanguage();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      console.log('inside firebase auth');
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log('user: ', user.providerData[0]);
      console.log(authName);
      authPhoto.setAttribute('src', user.providerData[0].photoURL);
      authPhoto.setAttribute('aria-label', user.providerData[0].displayName);
      authName.innerText = user.providerData[0].displayName;
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });

  // realtime authentification listener
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      console.log('firebaseUser: ', firebaseUser);
    }
  });
}
