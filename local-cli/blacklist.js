'use strict';

const blacklist = require('metro-bundler/src/blacklist');

const lrnwSharedBlacklist = [
  '.ios.js',
  '.android.js',
  '.windows.js',
  /node_modules\/react-native\/.*/, // 忽略react-native 用于与其共存
];

function lrnwBlacklist(additionalBlacklist) {
  return blacklist((additionalBlacklist || []).concat(lrnwSharedBlacklist));
}

module.exports = lrnwBlacklist;