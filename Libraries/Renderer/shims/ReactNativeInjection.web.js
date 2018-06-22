/**
 * 参考 react/src/renders/native/ReactNativeInjection.js
 */
'use strict';

require('react-native/Libraries/Core/InitializeCore');

//兼容native touch机制
require('./injectResponderEventPlugin');
