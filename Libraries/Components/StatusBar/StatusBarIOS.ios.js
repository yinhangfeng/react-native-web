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

const NativeEventEmitter = require('react-native/Libraries/EventEmitter/NativeEventEmitter');
const {StatusBarManager} = require('react-native/Libraries/BatchedBridge/NativeModules');

/**
 * Use `StatusBar` for mutating the status bar.
 */
class StatusBarIOS extends NativeEventEmitter {}

module.exports = new StatusBarIOS(StatusBarManager);
