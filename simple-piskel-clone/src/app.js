import './sass/style.scss';
import './components/drawCanvas/drawCanvas';
import Controller from './Controller/Controller';
import View from './View/View';
import './components/authentification/firebaseFromGoogle';

// options = [pixelSize, currentCount, fps, penSize, piskelImg]
const options = [1, 0, 0, 1, []];
const app = new Controller(new View(), options);
