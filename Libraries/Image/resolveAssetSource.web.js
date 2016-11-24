/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule resolveAssetSource
 * @flow
 *
 * Resolves an asset into a `source` for `Image`.
 */
'use strict';

import type { ResolvedAssetSource } from 'AssetSourceResolver';

const AssetRegistry = require('AssetRegistry');
const AssetSourceResolver = require('AssetSourceResolver');
//const { SourceCode } = require('NativeModules');
const RWServerUrl = require('RWServerUrl');

let _customSourceTransformer, _serverURL, _devServerURL;//, _bundleSourcePath;

// function getDevServerURL(): ?string {
//   if (_serverURL === undefined) {
//     var scriptURL = SourceCode.scriptURL;
//     var match = scriptURL && scriptURL.match(/^https?:\/\/.*?\//);
//     if (match) {
//       // Bundle was loaded from network
//       _serverURL = match[0];
//     } else {
//       // Bundle was loaded from file
//       _serverURL = null;
//     }
//   }
//   return _serverURL;
// }

// function getBundleSourcePath(): ?string {
//   if (_bundleSourcePath === undefined) {
//     const scriptURL = SourceCode.scriptURL;
//     if (!scriptURL) {
//       // scriptURL is falsy, we have nothing to go on here
//       _bundleSourcePath = null;
//       return _bundleSourcePath;
//     }
//     if (scriptURL.startsWith('assets://')) {
//       // running from within assets, no offline path to use
//       _bundleSourcePath = null;
//       return _bundleSourcePath;
//     }
//     if (scriptURL.startsWith('file://')) {
//       // cut off the protocol
//       _bundleSourcePath = scriptURL.substring(7, scriptURL.lastIndexOf('/') + 1);
//     } else {
//       _bundleSourcePath = scriptURL.substring(0, scriptURL.lastIndexOf('/') + 1);
//     }
//   }
//
//   return _bundleSourcePath;
// }

if (global.SOURCE_CODE_SERVER_URL != null) {
  // 通过SOURCE_CODE_SERVER_URL 判断是否为开发服务器 TODO
  _devServerURL = global.SOURCE_CODE_SERVER_URL + '/';
} else {
  _serverURL = '/' + RWServerUrl.PUBLIC_PATH + '/';
}

function setCustomSourceTransformer(
  transformer: (resolver: AssetSourceResolver) => ResolvedAssetSource,
): void {
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

  var asset = AssetRegistry.getAssetByID(source);
  if (!asset) {
    return null;
  }

  const resolver = new AssetSourceResolver(_devServerURL, _serverURL, asset);
  if (_customSourceTransformer) {
    return _customSourceTransformer(resolver);
  }
  return resolver.defaultAsset();
}

module.exports = resolveAssetSource;
module.exports.pickScale = AssetSourceResolver.pickScale;
module.exports.setCustomSourceTransformer = setCustomSourceTransformer;
