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

const AnimatedImplementation = require('react-native/Libraries/Animated/src/AnimatedImplementation');

module.exports = {
  ...AnimatedImplementation,
  div: AnimatedImplementation.createAnimatedComponent('div'),
  span: AnimatedImplementation.createAnimatedComponent('span'),
  img: AnimatedImplementation.createAnimatedComponent('img'),
};
