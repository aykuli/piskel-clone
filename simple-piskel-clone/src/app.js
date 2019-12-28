import './sass/style.scss';
import './components/drawCanvas/drawCanvas';
import './components/preview/preview';
import './components/appAction/appAction';
import Controller from './components/Controller/Controller';
import View from './components/View/View';
// import Picture from './components/tools/Picture';

const options = { relativeSize: 1 };
const app = new Controller(new View(), options.relativeSize);
