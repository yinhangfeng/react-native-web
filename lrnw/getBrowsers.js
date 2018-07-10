'use strict';

// https://github.com/browserslist/browserslist
module.exports = function getBrowsers(env) {
  let browsers;
  const LAB_BROWSERS = process.env.LAB_BROWSERS;
  if (LAB_BROWSERS === 'latest' || (env === 'development' && !LAB_BROWSERS)) {
    // dev 环境只兼容新浏览器 以方便调试 增加编译速度
    browsers = ['last 3 Chrome versions'];
  } else if (LAB_BROWSERS === 'es6') {
    browsers = [
      'Chrome 53',
      'Safari 10',
    ];
  } else if (LAB_BROWSERS) {
    browsers = LAB_BROWSERS.split(',');
  } else {
    browsers = [
      'Chrome 45',
      'Safari 8',
    ];
  }
  return browsers;
}