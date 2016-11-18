/**
 * @providesModule RWServerUrl
 */

let PUBLIC_PATH = 'rwpublic';
let serverUrl = global.SOURCE_CODE_SERVER_URL || '';

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
