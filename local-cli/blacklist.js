'use strict';

// 对 metro-bundler/src/blacklist 的增强 使lab-react-native-web 可与react-native 共存
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