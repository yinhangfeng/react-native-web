/**
 * @providesModule RWServerUrl
 * 资源文件url管理
 */

const PUBLIC_PATH = global.LAB_RESOURCE_PUBLIC_PATH || 'rwpublic';
//如果全局定义了SOURCE_CODE_SERVER_URL 则使用SOURCE_CODE_SERVER_URL 否则使用当前页面地址
const serverUrl = global.SOURCE_CODE_SERVER_URL || global.LAB_RESOURCE_BASE_URL || '';

module.exports = {
  PUBLIC_PATH,
  PUBLIC_URL: serverUrl + '/' + PUBLIC_PATH,
  CSS_PATH: PUBLIC_PATH + '/css',
  JS_PATH: PUBLIC_PATH + '/js',
  FONT_PATH: PUBLIC_PATH + '/fonts',
  getUrl(path) {
    return serverUrl + '/' + path;
  },
};
