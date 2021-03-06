/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @emails oncall+react_native
 */

'use strict';

jest.disableAutomock();

const React = require('react-native/Libraries/react-native/React');
const ReactTestRenderer = require('react-test-renderer');
const Image = require('react-native/Libraries/Image/Image');
const View = require('react-native/Libraries/Components/View/View');

it('renders assets based on relative path', () => {
  expect(
    ReactTestRenderer.create(
      <View>
        <Image source={require('./img/img1.png')} />
        <Image source={require('./img/img2.png')} />
      </View>,
    ),
  ).toMatchSnapshot();
});
