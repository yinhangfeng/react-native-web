/**
 * @providesModule UIManager
 */

const CSSPropertyOperations = require('react-dom/lib/CSSPropertyOperations');
const createReactDOMStyleObject = require('../lrnw/createReactDOMStyleObject');

const measureLayout = (node, relativeToNativeNode, callback) => {
  //RW TODO 检查是否正确
  const relativeNode = relativeToNativeNode || node.parentNode;
  const relativeRect = relativeNode.getBoundingClientRect();
  const { height, left, top, width } = node.getBoundingClientRect();
  const x = left - relativeRect.left;
  const y = top - relativeRect.top;
  callback(x, y, width, height, left, top);
}

const UIManager = {
  blur(node) {
    try {
      node.blur();
    } catch (err) {}
  },

  focus(node) {
    try {
      node.focus();
    } catch (err) {}
  },

  measure(node, callback) {
    measureLayout(node, null, callback);
  },

  measureInWindow(node, callback) {
    const { height, left, top, width } = node.getBoundingClientRect();
    callback(left, top, width, height);
  },

  measureLayout(node, relativeToNativeNode, onFail, onSuccess) {
    const relativeTo = relativeToNativeNode || node.parentNode;
    measureLayout(node, relativeTo, onSuccess);
  },

  updateView(node, props, component) {
    for (const prop in props) {
      const value = props[prop];
      switch (prop) {
        case 'style':
          CSSPropertyOperations.setValueForStyles(node, createReactDOMStyleObject(value), component._reactInternalInstance);
          break;
        case 'className':
          // prevent class names managed by React Native from being replaced
          //node.classList.add(value); //RW html5 兼容性 https://developer.mozilla.org/en-US/docs/Web/API/Element/classList  XXX 带空格的不行
          node.setAttribute('class', node.getAttribute('class') + ' ' + value);
          break;
        case 'text':
        case 'value':
          // native platforms use `text` prop to replace text input value
          // TODO RW 可能需要判断一下node的类型 不然不是很合理
          node.value = value
          break
        default:
          node.setAttribute(prop, value);
          break;
      }
    }
  }
};

module.exports = UIManager;
