/**
 * @providesModule ReactNative
 */
'use strict';

var ReactNativeDefaultInjection = require('./ReactNativeDefaultInjection');

var findNodeHandle = require('./findNodeHandle');
var ReactDOM = require('react-dom');

// RW 在dev 模式去除ReactDOMUnknownPropertyHook，防止警告 TODO
if (__DEV__) {
  require('react-dom/lib/ReactDebugTool').removeHook(require('react-dom/lib/ReactDOMUnknownPropertyHook'));
}

// ReactNativeDefaultInjection.inject();

var render = function(
  element: ReactElement,
  rootTag: any
): ?ReactComponent {
  return ReactDOM.render(element, rootTag);
};

var ReactNative = {
  hasReactNativeInitialized: true, //RW 不知道什么作用?
  findNodeHandle: findNodeHandle,
  render: render,
  //unmountComponentAtNode: ReactNativeMount.unmountComponentAtNode,

  /* eslint-disable camelcase */
  //unstable_batchedUpdates: ReactUpdates.batchedUpdates, //RW TODO
  /* eslint-enable camelcase */

  //unmountComponentAtNodeAndRemoveContainer: ReactNativeMount.unmountComponentAtNodeAndRemoveContainer, //RW TODO
};

// Inject the runtime into a devtools global hook regardless of browser.
// Allows for debugging when the hook is injected on the page.
/* globals __REACT_DEVTOOLS_GLOBAL_HOOK__ */
// if (
//   typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
//   typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject === 'function') {
//   __REACT_DEVTOOLS_GLOBAL_HOOK__.inject({
//     ComponentTree: {
//       getClosestInstanceFromNode: function(node) {
//         return ReactNativeComponentTree.getClosestInstanceFromNode(node);
//       },
//       getNodeFromInstance: function(inst) {
//         // inst is an internal instance (but could be a composite)
//         while (inst._renderedComponent) {
//           inst = inst._renderedComponent;
//         }
//         if (inst) {
//           return ReactNativeComponentTree.getNodeFromInstance(inst);
//         } else {
//           return null;
//         }
//       },
//     },
//     Mount: ReactNativeMount,
//     Reconciler: require('ReactReconciler'),
//   });
// }

module.exports = ReactNative;
