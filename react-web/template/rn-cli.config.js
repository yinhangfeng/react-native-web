//react native 与 lab-react-native-web 共存时忽略配置

'use strict';

var blacklist = require('./node_modules/react-native/packager/blacklist');
var path = require('path');

var lrnwBlacklist = [
  /node_modules\/lab-react-native-web\/.*/, // 忽略lab-react-native-web
];

var config = {

  /**
   * 黑名单目录
   * 扩展增加 react-native 用于lab-react-native-web与react-native 共存时
   */
  getBlacklistRE(platform) {
    return blacklist(platform, lrnwBlacklist);
  }
};

module.exports = config;
