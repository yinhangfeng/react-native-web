/**
 * @providesModule UIManager
 */

const CSSPropertyOperations = require('react-dom/lib/CSSPropertyOperations');
const createReactDOMStyleObject = require('../lrnw/createReactDOMStyleObject');

const hasOwnProperty = Object.prototype.hasOwnProperty;

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
      if (!hasOwnProperty.call(props, prop)) {
        continue;
      }
      const value = props[prop];
      switch (prop) {
        case 'style':
        // RW TODO 从react 复制CSSPropertyOperations.setValueForStyles 的实现
          CSSPropertyOperations.setValueForStyles(node, createReactDOMStyleObject(value), component._reactInternalInstance);
          break;
        case 'className':
          node.setAttribute('class', value);
          break;
        case 'text':
        case 'value':
          // native platforms use `text` prop to replace text input value
          node.value = value
          break;
        default:
          node.setAttribute(prop, value);
          break;
      }
    }
  }
};

module.exports = UIManager;
