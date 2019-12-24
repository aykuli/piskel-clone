import './sass/style.scss';
import './components/frames/frames';
import './components/drawCanvas/drawCanvas';
import './components/preview/preview';
import './components/appAction/appAction';
import './components/tools/tools';
import Controller from './components/Controller/Controller.js';
import View from './components/View/View';

const options = { canvasSize: 1 };
const app = new Controller(new View(), options.canvasSize);
