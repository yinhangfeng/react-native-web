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

const processColor = require('react-native/Libraries/StyleSheet/processColor');
const {DevLoadingView} = require('react-native/Libraries/BatchedBridge/NativeModules');

class HMRLoadingView {
  static showMessage(message: string) {
    DevLoadingView.showMessage(
      message,
      processColor('#000000'),
      processColor('#aaaaaa'),
    );
  }

  static hide() {
    DevLoadingView.hide();
  }
}

module.exports = HMRLoadingView;
