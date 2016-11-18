/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

var path = require('path');

// Don't forget to everything listed here to `package.json`
// modulePathIgnorePatterns.
var sharedBlacklist = [
  /node_modules[/\\]react[/\\]dist[/\\].*/,

  'downstream/core/invariant.js',

  /website\/node_modules\/.*/,

  // TODO(jkassens, #9876132): Remove this rule when it's no longer needed.
  'Libraries/Relay/relay/tools/relayUnstableBatchedUpdates.js',
];

var platformBlacklists = {
  //RW 黑名单
  web: [
    '.ios.js',
    '.android.js',
    '.windows.js',
    /node_modules\/react-native\/.*/, // 忽略react-native 用于与其共存

    //忽略所有react中renders/native部分
    /node_modules\/react\/lib\/NativeMethodsMixin\.js/,
    // /node_modules\/react\/lib\/ReactNative\.js/,
    // /node_modules\/react\/lib\/ReactNativeAttributePayload\.js/,
    // /node_modules\/react\/lib\/ReactNativeBaseComponent\.js/,
    // /node_modules\/react\/lib\/ReactNativeBridgeEventPlugin\.js/,
    // /node_modules\/react\/lib\/ReactNativeComponentEnvironment\.js/,
    // /node_modules\/react\/lib\/ReactNativeComponentTree\.js/,
    // /node_modules\/react\/lib\/ReactNativeContainerInfo\.js/,
    // /node_modules\/react\/lib\/ReactNativeDefaultInjection\.js/,
    // /node_modules\/react\/lib\/ReactNativeDOMIDOperations\.js/,
    // /node_modules\/react\/lib\/ReactNativeEventEmitter\.js/,
    // /node_modules\/react\/lib\/ReactNativeEventPluginOrder\.js/,
    // /node_modules\/react\/lib\/ReactNativeGlobalResponderHandler\.js/,
    // /node_modules\/react\/lib\/ReactNativeMount\.js/,
    // /node_modules\/react\/lib\/ReactNativePropRegistry\.js/,
    // /node_modules\/react\/lib\/ReactNativeReconcileTransaction\.js/,
    // /node_modules\/react\/lib\/ReactNativeTagHandles\.js/,
    // /node_modules\/react\/lib\/ReactNativeTextComponent\.js/,
    // /node_modules\/react\/lib\/ReactNativeTreeTraversal\.js/,
    /node_modules\/react\/lib\/ReactNative.*?\.js/,

    /node_modules\/react\/lib\/createReactNativeComponentClass\.js/,
    /node_modules\/react\/lib\/findNodeHandle\.js/,
  ],
  ios: [
    '.web.js',
    '.android.js',
    '.windows.js',
  ],
  android: [
    '.web.js',
    '.ios.js',
    '.windows.js'
  ],
  windows: [
    '.web.js',
    '.ios.js',
    '.android.js'
  ],
};

function escapeRegExp(pattern) {
  if (Object.prototype.toString.call(pattern) === '[object RegExp]') {
    return pattern.source.replace(/\//g, path.sep);
  } else if (typeof pattern === 'string') {
    var escaped = pattern.replace(/[\-\[\]\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    // convert the '/' into an escaped local file separator
    return escaped.replace(/\//g,'\\' + path.sep);
  } else {
    throw new Error('Unexpected packager blacklist pattern: ' + pattern);
  }
}

function blacklist(platform, additionalBlacklist) {
  return new RegExp('(' +
    (additionalBlacklist || []).concat(sharedBlacklist)
      .concat(platformBlacklists[platform] || [])
      .map(escapeRegExp)
      .join('|') +
    ')$'
  );
}

module.exports = blacklist;
