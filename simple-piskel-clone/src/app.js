import './sass/style.scss';
import './components/drawCanvas/drawCanvas';
import Controller from './Controller/Controller';
import domElements from './components/dom/dom';

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

// options = [pixelSize, currentCount, fps, penSize, piskelImg]
const options = [1, 0, 0, 1, []];
const app = new Controller(domElements, options, firebaseConfig); // eslint-disable-line
