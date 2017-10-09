/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Object.es6
 * @polyfill
 * @nolint
 */

/* eslint-disable strict */

// WARNING: This is an optimized version that fails on hasOwnProperty checks
// and non objects. It's not spec-compliant. It's a perf optimization.
// This is only needed for iOS 8 and current Android JSC.

Object.assign = function(target, sources) {
  if (__DEV__) {
    if (target == null) {
      throw new TypeError('Object.assign target cannot be null or undefined');
    }
    if (typeof target !== 'object' && typeof target !== 'function') {
      throw new TypeError(
        'In this environment the target of assign MUST be an object. ' +
        'This error is a performance optimization and not spec compliant.'
      );
    }
  }

  for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
    var nextSource = arguments[nextIndex];
    if (nextSource == null) {
      continue;
    }

    if (__DEV__) {
      if (typeof nextSource !== 'object' &&
          typeof nextSource !== 'function') {
        throw new TypeError(
          'In this environment the sources for assign MUST be an object. ' +
          'This error is a performance optimization and not spec compliant.'
        );
      }
    }

    // We don't currently support accessors nor proxies. Therefore this
    // copy cannot throw. If we ever supported this then we must handle
    // exceptions and side-effects.

    for (var key in nextSource) {
      if (__DEV__) {
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        if (!hasOwnProperty.call(nextSource, key)) {
          throw new TypeError(
            'One of the sources for assign has an enumerable key on the ' +
            'prototype chain. Are you trying to assign a prototype property? ' +
            'We don\'t allow it, as this is an edge case that we do not support. ' +
            'This error is a performance optimization and not spec compliant.'
          );
        }
      }
      target[key] = nextSource[key];
    }
  }

  return target;
};

// LAB modify
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
if (!Object.is) {
  Object.is = function(x, y) {
    // SameValue algorithm
    if (x === y) { // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
     // Step 6.a: NaN == NaN
     return x !== x && y !== y;
    }
  };
}

// LAB modify 获取 require 得到的 esModule 的 default 导出
// XXX 放在这里不是很合适
global.__requireDefault = function (obj) {
  return obj && obj.__esModule ? obj.default : obj;
};
