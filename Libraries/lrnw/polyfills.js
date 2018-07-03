'use strict';

window.GLOBAL = window;

// TODO 手动引入? preset-env useBuiltIns: 'entry' 会引入一些不必要的
require('@babel/polyfill');
require('./babelHelpers');

// fetch() polyfill for making API calls.
require('whatwg-fetch');