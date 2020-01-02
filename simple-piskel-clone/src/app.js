import './sass/style.scss';
import './components/drawCanvas/drawCanvas';
import './components/appAction/appAction';
import Controller from './components/Controller/Controller';
import View from './components/View/View';

// optins = [pixelSize, currentCount, fps, penSize, piskelImg]
const options = [1, 0, 12, 1, []];
const app = new Controller(new View(), options);
