/**
 * RW SYNC react-native: 0.49
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */
'use strict';

const createReactClass = require('create-react-class');

const RefreshLayoutConsts = {SIZE: {}};

// RW web 下 RefreshControl 无效果
const RefreshControl = createReactClass({
  statics: {
    SIZE: RefreshLayoutConsts.SIZE,
  },

  render() {
    return null;
  },
});

module.exports = RefreshControl;
