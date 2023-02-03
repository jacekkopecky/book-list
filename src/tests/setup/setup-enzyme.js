// setup enzyme adapter
import { configure } from 'enzyme';
import { JSDOM } from 'jsdom';

configure({});

// adapted from https://enzymejs.github.io/enzyme/docs/guides/jsdom.html
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
