//lab-react-native-web cli config

'use strict';

var blacklist = require('./packager/blacklist');
var path = require('path');

var lrnwBlacklist = [
  /node_modules\/react-native\/.*/, // 忽略react-native 用于与其共存
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
