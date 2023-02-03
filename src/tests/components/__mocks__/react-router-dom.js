// from https://medium.com/@antonybudianto/react-router-testing-with-jest-and-enzyme-17294fefd303

// eslint-disable-next-line
import React from 'react';

const rrd = require('react-router-dom');

// Just render plain div with its children
rrd.BrowserRouter = function BrowserRouter({ children }) {
  return <div>{ children }</div>;
};

module.exports = rrd;
