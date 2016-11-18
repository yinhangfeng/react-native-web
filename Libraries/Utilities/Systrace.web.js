/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Systrace
 * @flow
 */
'use strict';

// web环境暂时不需要

// type RelayProfiler = {
//   attachProfileHandler(
//     name: string,
//     handler: (name: string, state?: any) => () => void
//   ): void,
//
//   attachAggregateHandler(
//     name: string,
//     handler: (name: string, callback: () => void) => void
//   ): void,
// };

// var GLOBAL = GLOBAL || this;
// var TRACE_TAG_REACT_APPS = 1 << 17;
// var TRACE_TAG_JSC_CALLS = 1 << 27;
//
// var _enabled = false;
// var _asyncCookie = 0;
// var _ReactPerf = null;
// function ReactPerf() {
//   if (!_ReactPerf) {
//     _ReactPerf = require('ReactPerf');
//   }
//   return _ReactPerf;
// }

var Systrace = {
  setEnabled(enabled: boolean) {

  },

  /**
   * beginEvent/endEvent for starting and then ending a profile within the same call stack frame
  **/
  beginEvent(profileName?: any) {

  },

  endEvent() {

  },

  /**
   * beginAsyncEvent/endAsyncEvent for starting and then ending a profile where the end can either
   * occur on another thread or out of the current stack frame, eg await
   * the returned cookie variable should be used as input into the endAsyncEvent call to end the profile
  **/
  beginAsyncEvent(profileName?: any): any {
    return 0;
  },

  endAsyncEvent(profileName?: any, cookie?: any) {

  },

  /**
   * counterEvent registers the value to the profileName on the systrace timeline
  **/
  counterEvent(profileName?: any, value?: any) {

  },

  reactPerfMeasure(objName: string, fnName: string, func: any): any {
    return func;
  },

  swizzleReactPerf() {

  },

  /**
   * Relay profiles use await calls, so likely occur out of current stack frame
   * therefore async variant of profiling is used
  **/
  attachToRelayProfiler(relayProfiler: RelayProfiler) {

  },

  /* This is not called by default due to perf overhead but it's useful
     if you want to find traces which spend too much time in JSON. */
  swizzleJSON() {

  },

 /**
  * Measures multiple methods of a class. For example, you can do:
  * Systrace.measureMethods(JSON, 'JSON', ['parse', 'stringify']);
  *
  * @param object
  * @param objectName
  * @param methodNames Map from method names to method display names.
  */
 measureMethods(object: any, objectName: string, methodNames: Array<string>): void {

 },

 /**
  * Returns an profiled version of the input function. For example, you can:
  * JSON.parse = Systrace.measure('JSON', 'parse', JSON.parse);
  *
  * @param objName
  * @param fnName
  * @param {function} func
  * @return {function} replacement function
  */
 measure(objName: string, fnName: string, func: any): any {
   return func;
 },
};

// Systrace.setEnabled(global.__RCTProfileIsProfiling || false);
//
// if (__DEV__) {
//   // This is needed, because require callis in polyfills are not processed as
//   // other files. Therefore, calls to `require('moduleId')` are not replaced
//   // with numeric IDs
//   // TODO(davidaurelio) Scan polyfills for dependencies, too (t9759686)
//   require.Systrace = Systrace;
// }

module.exports = Systrace;
