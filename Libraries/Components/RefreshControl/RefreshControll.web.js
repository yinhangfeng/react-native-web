/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RefreshControl
 * @flow
 */
'use strict';

const React = require('React');

//const requireNativeComponent = require('requireNativeComponent');

var RefreshLayoutConsts = {SIZE: {}};

// RW web下RefreshControl无效果
const RefreshControl = React.createClass({
  statics: {
    SIZE: RefreshLayoutConsts.SIZE,
  },

  // mixins: [NativeMethodsMixin],
  //
  // propTypes: {
  //   ...View.propTypes,
  //   /**
  //    * Called when the view starts refreshing.
  //    */
  //   onRefresh: React.PropTypes.func,
  //   /**
  //    * Whether the view should be indicating an active refresh.
  //    */
  //   refreshing: React.PropTypes.bool,
  //   /**
  //    * The color of the refresh indicator.
  //    * @platform ios
  //    */
  //   tintColor: ColorPropType,
  //   /**
  //    * Title color.
  //    * @platform ios
  //    */
  //   titleColor: ColorPropType,
  //   /**
  //    * The title displayed under the refresh indicator.
  //    * @platform ios
  //    */
  //   title: React.PropTypes.string,
  //   /**
  //    * Whether the pull to refresh functionality is enabled.
  //    * @platform android
  //    */
  //   enabled: React.PropTypes.bool,
  //   /**
  //    * The colors (at least one) that will be used to draw the refresh indicator.
  //    * @platform android
  //    */
  //   colors: React.PropTypes.arrayOf(ColorPropType),
  //   /**
  //    * The background color of the refresh indicator.
  //    * @platform android
  //    */
  //   progressBackgroundColor: ColorPropType,
  //   /**
  //    * Size of the refresh indicator, see RefreshControl.SIZE.
  //    * @platform android
  //    */
  //   size: React.PropTypes.oneOf(RefreshLayoutConsts.SIZE.DEFAULT, RefreshLayoutConsts.SIZE.LARGE),
  // },

  _nativeRef: {},

  render() {
    return null;
  },
});

module.exports = RefreshControl;
