/**
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

// RW TODO window resize
const dimensions = {
  // Not map to real window size, because that map to screen size in native env.
  window: {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    scale: window.devicePixelRatio || 1,
  },
  modalFullscreenView: {
    width: screen.width,
    height: screen.height,
  },
};

class Dimensions {
  static get(dim: string): Object {
    return dimensions[dim];
  }
  // TODO addEventListener removeEventListener
}

module.exports = Dimensions;
