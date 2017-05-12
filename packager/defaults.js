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

exports.assetExts =  [
  'bmp', 'gif', 'jpg', 'jpeg', 'png', 'psd', 'svg', 'webp', // Image formats
  'm4v', 'mov', 'mp4', 'mpeg', 'mpg', 'webm', // Video formats
  'aac', 'aiff', 'caf', 'm4a', 'mp3', 'wav', // Audio formats
  'html', 'pdf', // Document formats
];

exports.moduleSystem = require.resolve('./src/Resolver/polyfills/require.js');

exports.platforms = ['ios', 'android', 'windows', 'web'];

exports.polyfills = [
  require.resolve('./src/Resolver/polyfills/polyfills.js'),
  // require.resolve('./src/Resolver/polyfills/console.js'), // RW web平台不需要
  require.resolve('./src/Resolver/polyfills/error-guard.js'),
  require.resolve('./src/Resolver/polyfills/Number.es6.js'),
  require.resolve('./src/Resolver/polyfills/String.prototype.es6.js'),
  require.resolve('./src/Resolver/polyfills/Array.prototype.es6.js'),
  require.resolve('./src/Resolver/polyfills/Array.es6.js'),
  require.resolve('./src/Resolver/polyfills/Object.es7.js'),
  require.resolve('./src/Resolver/polyfills/babelHelpers.js'),
];

exports.providesModuleNodeModules = [
  'react-native',
  'react-native-windows',
  //RW 添加当前库为providesModule 使得当前库作为NodeModules时使用node-haste构建时能使用haste
  'lab-react-native-web',
];

exports.runBeforeMainModule = [
  // Ensures essential globals are available and are patched correctly.
  'InitializeCore',
];
