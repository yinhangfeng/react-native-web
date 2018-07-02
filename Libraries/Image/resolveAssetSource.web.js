/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * Resolves an asset into a `source` for `Image`.
 */
'use strict';

const AssetRegistry = require('react-native/Libraries/Image/AssetRegistry');
const RWServerUrl = require('react-native/Libraries/lrnw/RWServerUrl');
const PixelRatio = require('react-native/Libraries/Utilities/PixelRatio');

let _customSourceTransformer;

// TODO
function setCustomSourceTransformer(transformer) {
  _customSourceTransformer = transformer;
}

/**
 * `source` is either a number (opaque type returned by require('./foo.png'))
 * or an `ImageSource` like { uri: '<http location || file path>' }
 */
function resolveAssetSource(source: any): ?ResolvedAssetSource {
  if (typeof source === 'object') {
    return source;
  }

  const asset = AssetRegistry.getAssetByID(source);
  if (!asset) {
    return null;
  }

  const {
    scales,
    files,
  } = asset;
  let file;
  if (Array.isArray(scales)) {
    const deviceScale = PixelRatio.get();
    for (let i = 0; i < scales.length; ++i) {
      if (scales[i] >= deviceScale) {
        file = files[i];
        break;
      }
    }
    if (!file) {
      file = files[files.length - 1];
    }
  } else {
    file = files;
  }

  return `${RWServerUrl.SERVER_URL}${RWServerUrl.ASSETS_PATH}/${file}`;
}

function pickScale(scales, deviceScale) {
  if (!Array.isArray(scales)) {
    return scales;
  }
  // Packager guarantees that `scales` array is sorted
  for (var i = 0; i < scales.length; i++) {
    if (scales[i] >= deviceScale) {
      return scales[i];
    }
  }

  // If nothing matches, device scale is larger than any available
  // scales, so we return the biggest one. Unless the array is empty,
  // in which case we default to 1
  return scales[scales.length - 1] || 1;
}

module.exports = resolveAssetSource;
module.exports.pickScale = pickScale;
module.exports.setCustomSourceTransformer = setCustomSourceTransformer;
