/**
 * @providesModule ReactNative
 */
'use strict';

const ReactNativeDefaultInjection = require('./ReactNativeDefaultInjection');
const ReactDOM = require('react-dom');

const ReactNative = {
  findNodeHandle: ReactDOM.findDOMNode,
  render: ReactDOM.render,
  unmountComponentAtNode: ReactDOM.unmountComponentAtNode,
};

module.exports = ReactNative;
