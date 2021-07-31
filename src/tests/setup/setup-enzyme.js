// setup enzyme adapter
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
import { JSDOM } from 'jsdom';

configure({ adapter: new Adapter() });

// adapted from https://enzymejs.github.io/enzyme/docs/guides/jsdom.html
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
