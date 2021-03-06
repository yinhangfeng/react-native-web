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

const DeviceInfo = require('react-native/Libraries/BatchedBridge/NativeModules').DeviceInfo;

const invariant = require('fbjs/lib/invariant');

invariant(DeviceInfo, 'DeviceInfo native module is not installed correctly');

module.exports = DeviceInfo;
