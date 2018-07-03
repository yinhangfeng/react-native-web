/**
 * RW SYNC react-native-web: 0.8.6
 * 兼容react native 的touch机制  代码参考react-native-web
 * https://github.com/necolas/react-native-web/blob/master/packages/react-native-web/src/modules/ResponderEventPlugin/index.js
 */
'use strict';

const ReactDOM = require('react-dom');
const ReactDOMUnstableNativeDependencies = require('react-dom/unstable-native-dependencies');
const { EventPluginHub } = ReactDOM.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
const { ResponderEventPlugin, ResponderTouchHistoryStore } = ReactDOMUnstableNativeDependencies;

const normalizeResponderNativeEvent = require('./normalizeResponderNativeEvent');

// react 16.4.0 以上已经不需要设置 dependencies https://github.com/facebook/react/pull/12629
// if (!ResponderEventPlugin.eventTypes.responderMove.dependencies) {
//   const responderDependencies = {
//     topMouseDown: 'topMouseDown',
//     topMouseMove: 'topMouseMove',
//     topMouseUp: 'topMouseUp',
//     topScroll: 'topScroll',
//     topSelectionChange: 'topSelectionChange',
//     topTouchCancel: 'topTouchCancel',
//     topTouchEnd: 'topTouchEnd',
//     topTouchMove: 'topTouchMove',
//     topTouchStart: 'topTouchStart',
//   };

//   const endDependencies = [ responderDependencies.topTouchCancel, responderDependencies.topTouchEnd, responderDependencies.topMouseUp ];
//   const moveDependencies = [ responderDependencies.topTouchMove, responderDependencies.topMouseMove ];
//   const startDependencies = [ responderDependencies.topTouchStart, responderDependencies.topMouseDown ];
//   const emptyDependencies = [];

//   /**
//    * Setup ResponderEventPlugin dependencies
//    */
//   const REPEventTypes = ResponderEventPlugin.eventTypes;
//   REPEventTypes.responderMove.dependencies = moveDependencies;
//   REPEventTypes.responderEnd.dependencies = endDependencies;
//   REPEventTypes.responderStart.dependencies = startDependencies;
//   REPEventTypes.responderRelease.dependencies = endDependencies;
//   REPEventTypes.responderTerminationRequest.dependencies = emptyDependencies;
//   REPEventTypes.responderGrant.dependencies = emptyDependencies;
//   REPEventTypes.responderReject.dependencies = emptyDependencies;
//   REPEventTypes.responderTerminate.dependencies = emptyDependencies;
//   REPEventTypes.moveShouldSetResponder.dependencies = moveDependencies;
//   REPEventTypes.selectionChangeShouldSetResponder.dependencies = [ responderDependencies.topSelectionChange ];
//   REPEventTypes.scrollShouldSetResponder.dependencies = [ responderDependencies.topScroll ];
//   REPEventTypes.startShouldSetResponder.dependencies = startDependencies;
// }

const originalExtractEvents = ResponderEventPlugin.extractEvents.bind(ResponderEventPlugin);
ResponderEventPlugin.extractEvents = function(
  topLevelType,
  targetInst,
  nativeEvent,
  nativeEventTarget
) {
  // console.log('ResponderEventPlugin.extractEvents topLevelType:', topLevelType, 'touchHistory:', ResponderTouchHistoryStore.touchHistory, 'nativeEvent:', nativeEvent);

  switch (topLevelType) {
    case 'mousemove':
      if (!ResponderTouchHistoryStore.touchHistory.numberActiveTouches) {
        // 过滤掉鼠标悬浮时的事件
        break;
      }
    case 'mousedown':
    case 'mousemove':
    case 'mouseup':
    case 'touchcancel':
    case 'touchend':
    case 'touchmove':
    case 'touchstart':
      // RW TODO nativeEvent 重用
      nativeEvent = normalizeResponderNativeEvent(nativeEvent);
    case 'scroll':
    case 'selectionChange':
      // TODO 这两个事件是否需要normalize?
      return originalExtractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
    default:
      break;
  }
  return null;
};

EventPluginHub.injection.injectEventPluginsByName({
  ResponderEventPlugin,
});
