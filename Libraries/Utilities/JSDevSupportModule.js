/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

'use strict';

const JSDevSupport = require('react-native/Libraries/BatchedBridge/NativeModules').JSDevSupport;
const ReactNative = require('react-native/Libraries/Renderer/shims/ReactNative');

const JSDevSupportModule = {
  getJSHierarchy: function(tag: number) {
    try {
      const {
        computeComponentStackForErrorReporting,
      } = ReactNative.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      const componentStack = computeComponentStackForErrorReporting(tag);
      if (!componentStack) {
        JSDevSupport.onFailure(
          JSDevSupport.ERROR_CODE_VIEW_NOT_FOUND,
          "Component stack doesn't exist for tag " + tag,
        );
      } else {
        JSDevSupport.onSuccess(componentStack);
      }
    } catch (e) {
      JSDevSupport.onFailure(JSDevSupport.ERROR_CODE_EXCEPTION, e.message);
    }
  },
};

module.exports = JSDevSupportModule;
