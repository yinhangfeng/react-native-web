/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

/* eslint-env jest */

'use strict';

declare var jest: any;

const React = require('react-native/Libraries/react-native/React');
const View = require('react-native/Libraries/Components/View/View');

const requireNativeComponent = require('react-native/Libraries/ReactNative/requireNativeComponent');

const RCTScrollView = requireNativeComponent('RCTScrollView');

const ScrollViewComponent = jest.genMockFromModule('ScrollView');

class ScrollViewMock extends ScrollViewComponent {
  render() {
    return (
      <RCTScrollView {...this.props}>
        {this.props.refreshControl}
        <View>{this.props.children}</View>
      </RCTScrollView>
    );
  }
}

module.exports = ScrollViewMock;
