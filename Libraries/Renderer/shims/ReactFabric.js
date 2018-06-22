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

const BatchedBridge = require('react-native/Libraries/BatchedBridge/BatchedBridge');

// TODO @sema: Adjust types
import type {ReactNativeType} from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';

let ReactFabric;

if (__DEV__) {
  ReactFabric = require('react-native/Libraries/Renderer/oss/ReactFabric-dev');
} else {
  ReactFabric = require('react-native/Libraries/Renderer/oss/ReactFabric-prod');
}

BatchedBridge.registerCallableModule('ReactFabric', ReactFabric);

module.exports = (ReactFabric: ReactNativeType);
