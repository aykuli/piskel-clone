import './sass/style.scss';
import App from './App';
import domElements from './components/dom/dom';
import './components/hotKeys/hotKeys';

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

const app = new App(domElements, { firebaseConfig });

app.run();
