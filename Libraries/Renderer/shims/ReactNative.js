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

import type {ReactNativeType} from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';

let ReactNative;

if (__DEV__) {
  ReactNative = require('react-native/Libraries/Renderer/oss/ReactNativeRenderer-dev');
} else {
  ReactNative = require('react-native/Libraries/Renderer/oss/ReactNativeRenderer-prod');
}

module.exports = (ReactNative: ReactNativeType);
