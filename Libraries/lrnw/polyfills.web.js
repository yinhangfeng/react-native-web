'use strict';

window.GLOBAL = global;

import './babelHelpers';
import '@babel/polyfill';
import Promise from 'bluebird/js/browser/bluebird.min';
window.oriPromise = window.Promise;
window.Promise = Promise;

// fetch() polyfill for making API calls.
import 'whatwg-fetch';