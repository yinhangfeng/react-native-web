/**
 */
'use strict';

const createElement = require('react-native/Libraries/react-native/React').createElement;
const createReactDOMStyleObject = require('./createReactDOMStyleObject');

/**
 * 创建web上的核心element 如div span。
 * 本函数用于View Text等最基本的组件渲染核心元素
 * @param type: String 元素类型如 div
 * @param config: Object 属性
 *
 * 作用:
 * 1.style 翻译
 */
function createWebCoreElement(type, config) {
  if (config && config.style) {
    let style = createReactDOMStyleObject(config.style);
    config = {
      ...config,
      style,
    };
  }

  //console.log('createWebCoreElement ', config);

  if (arguments.length < 3) {
    return createElement(type, config);
  }
  let args = Array.prototype.slice.call(arguments);
  args[1] = config;
  return createElement.apply(null, args);

}

module.exports = createWebCoreElement;
