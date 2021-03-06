/**
 * RW SYNC react-native: 0.49
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

/* eslint-disable strict */
/* globals window: true */

/**
 * Sets up global variables typical in most JavaScript environments.
 *
 *   1. Global timers (via `setTimeout` etc).
 *   2. Global console object.
 *   3. Hooks for printing stack traces with source maps.
 *
 * Leaves enough room in the environment for implementing your own:
 *
 *   1. Require system.
 *   2. Bridged modules.
 *
 */
'use strict';

if (global.GLOBAL === undefined) {
  global.GLOBAL = global;
}

if (global.window === undefined) {
  global.window = global;
}

const defineLazyObjectProperty = require('react-native/Libraries/Utilities/defineLazyObjectProperty');

/**
 * Sets an object's property. If a property with the same name exists, this will
 * replace it but maintain its descriptor configuration. The property will be
 * replaced with a lazy getter.
 *
 * In DEV mode the original property value will be preserved as `original[PropertyName]`
 * so that, if necessary, it can be restored. For example, if you want to route
 * network requests through DevTools (to trace them):
 *
 *   global.XMLHttpRequest = global.originalXMLHttpRequest;
 *
 * @see https://github.com/facebook/react-native/issues/934
 */
function defineLazyProperty<T>(
  object: Object,
  name: string,
  getValue: () => T,
): void {
  const descriptor = Object.getOwnPropertyDescriptor(object, name);
  if (__DEV__ && descriptor) {
    const backupName = `original${name[0].toUpperCase()}${name.substr(1)}`;
    Object.defineProperty(object, backupName, {
      ...descriptor,
      value: object[name],
    });
  }

  const {enumerable, writable, configurable} = descriptor || {};
  if (descriptor && !configurable) {
    console.error('Failed to set polyfill. ' + name + ' is not configurable.');
    return;
  }

  defineLazyObjectProperty(object, name, {
    get: getValue,
    enumerable: enumerable !== false,
    writable: writable !== false,
  });
}

function polyfillGlobal<T>(name: string, getValue: () => T): void {
  defineLazyProperty(global, name, getValue);
}

// Set up process
global.process = global.process || {};
const env = global.process.env = global.process.env || {};
if (env == null) {
  env.NODE_ENV = __DEV__ ? 'development' : 'production';
}

// Setup the Systrace profiling hooks if necessary
// RW web 不需要
// if (global.__RCTProfileIsProfiling) {
//   const Systrace = require('react-native/Libraries/Performance/Systrace');
//   Systrace.setEnabled(true);
// }

// Set up console
// RW web 不需要
// const ExceptionsManager = require('react-native/Libraries/Core/ExceptionsManager');
// ExceptionsManager.installConsoleErrorReporter();

// Set up error handler
// RW web 不需要
// if (!global.__fbDisableExceptionsManager) {
//   const handleError = (e, isFatal) => {
//     try {
//       ExceptionsManager.handleException(e, isFatal);
//     } catch (ee) {
//       /* eslint-disable no-console-disallow */
//       console.log('Failed to print error: ', ee.message);
//       /* eslint-enable no-console-disallow */
//       throw e;
//     }
//   };

//   const ErrorUtils = require('react-native/Libraries/vendor/core/ErrorUtils');
//   ErrorUtils.setGlobalHandler(handleError);
// }

// const {PlatformConstants} = require('react-native/Libraries/BatchedBridge/NativeModules');
// if (PlatformConstants) {
//   const formatVersion = version =>
//     `${version.major}.${version.minor}.${version.patch}` +
//     (version.prerelease !== null ? `-${version.prerelease}` : '');

//   const ReactNativeVersion = require('react-native/Libraries/Core/ReactNativeVersion');
//   const nativeVersion = PlatformConstants.reactNativeVersion;
//   if (ReactNativeVersion.version.major !== nativeVersion.major ||
//       ReactNativeVersion.version.minor !== nativeVersion.minor) {
//     throw new Error(
//       `React Native version mismatch.\n\nJavaScript version: ${formatVersion(ReactNativeVersion.version)}\n` +
//       `Native version: ${formatVersion(nativeVersion)}\n\n` +
//       'Make sure that you have rebuilt the native code. If the problem persists ' +
//       'try clearing the watchman and packager caches with `watchman watch-del-all ' +
//       '&& react-native start --reset-cache`.'
//     );
//   }
// }

// Set up collections
// RW 没必要lazy
const _shouldPolyfillCollection = require('react-native/Libraries/vendor/core/_shouldPolyfillES6Collection');
if (_shouldPolyfillCollection('Map')) {
  // polyfillGlobal('Map', () => require('react-native/Libraries/vendor/core/Map'));
  global.Map = require('react-native/Libraries/vendor/core/Map');
}
if (_shouldPolyfillCollection('Set')) {
  // polyfillGlobal('Set', () => require('react-native/Libraries/vendor/core/Set'));
  global.Set = require('react-native/Libraries/vendor/core/Set');
}

// Set up regenerator.
// RW modify 使用rollup时 require 会替换为import 会被提前 所以加入判断
if (!global.regeneratorRuntime) {
  polyfillGlobal('regeneratorRuntime', () => {
    // The require just sets up the global, so make sure when we first
    // invoke it the global does not exist
    delete global.regeneratorRuntime;
    require('regenerator-runtime/runtime');
    return global.regeneratorRuntime;
  });
}

// Set up timers
// const defineLazyTimer = name => {
//   polyfillGlobal(name, () => require('react-native/Libraries/Core/Timers/JSTimers')[name]);
// };
// defineLazyTimer('setTimeout');
// defineLazyTimer('setInterval');
// defineLazyTimer('setImmediate');
// defineLazyTimer('clearTimeout');
// defineLazyTimer('clearInterval');
// defineLazyTimer('clearImmediate');
// defineLazyTimer('requestAnimationFrame');
// defineLazyTimer('cancelAnimationFrame');
// defineLazyTimer('requestIdleCallback');
// defineLazyTimer('cancelIdleCallback');

// Set up Promise
// The native Promise implementation throws the following error:
// ERROR: Event loop not supported.
// 使用bluebird
global.Promise = require('react-native/Libraries/Promise');

// 使用setTimeout 模拟setImmediate 放在Promise之后 不让其使用假的setImmediate
if (!global.setImmediate) {
  global.setImmediate = function(func, ...args) {
    return setTimeout(func, 0, ...args);
  };
  global.clearImmediate = clearTimeout;
}

// Set up XHR
// The native XMLHttpRequest in Chrome dev tools is CORS aware and won't
// let you fetch anything from the internet
// RW xhr 不需要
// polyfillGlobal('XMLHttpRequest', () => require('react-native/Libraries/Network/XMLHttpRequest'));
// polyfillGlobal('FormData', () => require('react-native/Libraries/Network/FormData'));

// RW modify
if (!global.fetch) {
  polyfillGlobal('fetch', () => require('react-native/Libraries/Network/fetch').fetch);
  polyfillGlobal('Headers', () => require('react-native/Libraries/Network/fetch').Headers);
  polyfillGlobal('Request', () => require('react-native/Libraries/Network/fetch').Request);
  polyfillGlobal('Response', () => require('react-native/Libraries/Network/fetch').Response);
}
// polyfillGlobal('WebSocket', () => require('react-native/Libraries/WebSocket/WebSocket'));
// polyfillGlobal('Blob', () => require('react-native/Libraries/Blob/Blob'));
// polyfillGlobal('URL', () => require('react-native/Libraries/Blob/URL'));

// Set up alert
// RW web 不需要
// if (!global.alert) {
//   global.alert = function(text) {
//     // Require Alert on demand. Requiring it too early can lead to issues
//     // with things like Platform not being fully initialized.
//     require('react-native/Libraries/Alert/Alert').alert('Alert', '' + text);
//   };
// }

// Set up Geolocation
// let navigator = global.navigator;
// if (navigator === undefined) {
//   global.navigator = navigator = {};
// }

// see https://github.com/facebook/react-native/issues/10881
// defineLazyProperty(navigator, 'product', () => 'ReactNative');
// defineLazyProperty(navigator, 'geolocation', () => require('react-native/Libraries/Geolocation/Geolocation'));

// Just to make sure the JS gets packaged up. Wait until the JS environment has
// been initialized before requiring them.
// const BatchedBridge = require('react-native/Libraries/BatchedBridge/BatchedBridge');
// BatchedBridge.registerLazyCallableModule('Systrace', () => require('react-native/Libraries/Performance/Systrace'));
// BatchedBridge.registerLazyCallableModule('JSTimers', () => require('react-native/Libraries/Core/Timers/JSTimers'));
// BatchedBridge.registerLazyCallableModule('HeapCapture', () => require('react-native/Libraries/Utilities/HeapCapture'));
// BatchedBridge.registerLazyCallableModule('SamplingProfiler', () => require('react-native/Libraries/Performance/SamplingProfiler'));
// BatchedBridge.registerLazyCallableModule('RCTLog', () => require('react-native/Libraries/Utilities/RCTLog'));
// BatchedBridge.registerLazyCallableModule('RCTDeviceEventEmitter', () => require('react-native/Libraries/EventEmitter/RCTDeviceEventEmitter'));
// BatchedBridge.registerLazyCallableModule('RCTNativeAppEventEmitter', () => require('react-native/Libraries/EventEmitter/RCTNativeAppEventEmitter'));
// BatchedBridge.registerLazyCallableModule('PerformanceLogger', () => require('react-native/Libraries/Utilities/PerformanceLogger'));

// Set up devtools
// if (__DEV__) {
//   if (!global.__RCTProfileIsProfiling) {
//     BatchedBridge.registerCallableModule('HMRClient', require('react-native/Libraries/Utilities/HMRClient'));

//     // not when debugging in chrome
//     // TODO(t12832058) This check is broken
//     if (!window.document) {
//       require('react-native/Libraries/Core/Devtools/setupDevtools');
//     }

//     // Set up inspector
//     const JSInspector = require('react-native/Libraries/JSInspector/JSInspector');
//     JSInspector.registerAgent(require('react-native/Libraries/JSInspector/NetworkAgent'));
//   }
// }

global.__lrnw_register_image = require('react-native/Libraries/Image/AssetRegistry').registerImage;
