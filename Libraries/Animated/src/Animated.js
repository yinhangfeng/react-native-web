/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

'use strict';

const AnimatedImplementation = require('react-native/Libraries/Animated/src/AnimatedImplementation');
const Image = require('react-native/Libraries/Image/Image');
const ScrollView = require('react-native/Libraries/Components/ScrollView/ScrollView');
const Text = require('react-native/Libraries/Text/Text');
const View = require('react-native/Libraries/Components/View/View');

const Animated = {
  View: AnimatedImplementation.createAnimatedComponent(View),
  Text: AnimatedImplementation.createAnimatedComponent(Text),
  Image: AnimatedImplementation.createAnimatedComponent(Image),
  ScrollView: AnimatedImplementation.createAnimatedComponent(ScrollView),
};

Object.assign((Animated: Object), AnimatedImplementation);

module.exports = ((Animated: any): typeof AnimatedImplementation &
  typeof Animated);
