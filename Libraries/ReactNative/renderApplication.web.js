/**
 * RW SYNC react-native: 0.49 react-native-web: 0.1.0
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @format
 * @flow
 */

'use strict';

const React = require('React');
const AppContainer = require('./AppContainer');
const ReactNative = require('ReactNative');

function renderApplication<Props: Object>(
  RootComponent: React.ComponentType<Props>,
  initialProps: Props,
  rootTag: any,
  WrapperComponent?: ?React.ComponentType<*>,
) {
  ReactNative.render(
    <AppContainer rootTag={rootTag} WrapperComponent={WrapperComponent}>
      <RootComponent {...initialProps} rootTag={rootTag} />
    </AppContainer>,
    rootTag,
  );
}

module.exports = renderApplication;
