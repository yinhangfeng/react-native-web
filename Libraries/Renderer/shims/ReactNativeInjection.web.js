/**
 * 参考 react/src/renders/native/ReactNativeInjection.js
 */
'use strict';

require('InitializeCore');

//兼容native touch机制
require('./injectResponderEventPlugin');
