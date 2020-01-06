import './sass/style.scss';
import './components/drawCanvas/drawCanvas';
import './components/appAction/appAction';
import Controller from './components/Controller/Controller';
import View from './components/View/View';
import './components/authentification/firebaseFromGoogle';

// optins = [pixelSize, currentCount, fps, penSize, piskelImg]
const options = [1, 0, 0, 1, []];
const app = new Controller(new View(), options);
