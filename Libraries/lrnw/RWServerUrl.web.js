/**
 * @providesModule RWServerUrl
 */
'use strict';

let devServerURL;

if (__DEV__ && global.LRNW_DEV_SERVER_URL != null) {
  // 通过LRNW_DEV_SERVER_URL 判断是否为开发服务器 需在index.html 中配置
  devServerURL = LRNW_DEV_SERVER_URL;
  if (devServerURL.endsWith('/')) {
    devServerURL = devServerURL.slice(0, -1);
  }
}

const PUBLIC_PATH = global.LRNW_RESOURCE_PUBLIC_PATH || 'rwpublic';
let serverUrl = global.LRNW_RESOURCE_BASE_URL || devServerURL || '';

if (serverUrl.endsWith('/')) {
  serverUrl = serverUrl.slice(0, -1);
}

const PUBLIC_URL = serverUrl + '/' + PUBLIC_PATH;

/**
 * 所有都不含末尾 '/'
 */
module.exports = {
  DEV_SERVER_URL: devServerURL,
  SERVER_URL: serverUrl,
  PUBLIC_PATH,
  PUBLIC_URL,
  RESOURCE_BASE_URL: PUBLIC_URL,
  CSS_PATH: PUBLIC_PATH + '/css',
  JS_PATH: PUBLIC_PATH + '/js',
  FONT_PATH: PUBLIC_PATH + '/fonts',
  getUrl(path) {
    return serverUrl + '/' + path;
  },
};
