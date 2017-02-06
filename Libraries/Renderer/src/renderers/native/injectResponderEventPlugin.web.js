//兼容react native 的touch机制  代码参考react-native-web
//https://github.com/necolas/react-native-web/blob/master/src/modules/injectResponderEventPlugin.js

'use strict';

// const EventConstants = require('react-dom/lib/EventConstants');
const EventPluginRegistry = require('react-dom/lib/EventPluginRegistry');
const ResponderEventPlugin = require('react-dom/lib/ResponderEventPlugin');
const ResponderTouchHistoryStore = require('react-dom/lib/ResponderTouchHistoryStore');

const normalizeResponderNativeEvent = require('./normalizeResponderNativeEvent');

// const supportsTouch = 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch;

const responderDependencies = {
  topMouseDown: 'topMouseDown',
  topMouseMove: 'topMouseMove',
  topMouseUp: 'topMouseUp',
  topScroll: 'topScroll',
  topSelectionChange: 'topSelectionChange',
  topTouchCancel: 'topTouchCancel',
  topTouchEnd: 'topTouchEnd',
  topTouchMove: 'topTouchMove',
  topTouchStart: 'topTouchStart',
};

const endDependencies = [ responderDependencies.topTouchCancel, responderDependencies.topTouchEnd, responderDependencies.topMouseUp ];
const moveDependencies = [ responderDependencies.topTouchMove, responderDependencies.topMouseMove ];
const startDependencies = [ responderDependencies.topTouchStart, responderDependencies.topMouseDown ];
const emptyDependencies = [];

/**
 * Setup ResponderEventPlugin dependencies
 */
const REPEventTypes = ResponderEventPlugin.eventTypes;
REPEventTypes.responderMove.dependencies = moveDependencies;
REPEventTypes.responderEnd.dependencies = endDependencies;
REPEventTypes.responderStart.dependencies = startDependencies;
REPEventTypes.responderRelease.dependencies = endDependencies;
REPEventTypes.responderTerminationRequest.dependencies = emptyDependencies;
REPEventTypes.responderGrant.dependencies = emptyDependencies;
REPEventTypes.responderReject.dependencies = emptyDependencies;
REPEventTypes.responderTerminate.dependencies = emptyDependencies;
REPEventTypes.moveShouldSetResponder.dependencies = moveDependencies;
REPEventTypes.selectionChangeShouldSetResponder.dependencies = [ responderDependencies.topSelectionChange ];
REPEventTypes.scrollShouldSetResponder.dependencies = [ responderDependencies.topScroll ];
REPEventTypes.startShouldSetResponder.dependencies = startDependencies;

const originalExtractEvents = ResponderEventPlugin.extractEvents;
ResponderEventPlugin.extractEvents = function(
  topLevelType,
  targetInst,
  nativeEvent,
  nativeEventTarget
) {
  if (responderDependencies[topLevelType]) {
    // console.log('ResponderEventPlugin.extractEvents topLevelType:', topLevelType, 'touchHistory:', ResponderTouchHistoryStore.touchHistory, 'nativeEvent:', nativeEvent);
    switch (topLevelType) {
      case 'topScroll':
      case 'topSelectionChange':
        // TODO 这两个事件是否需要normalize?
        break;
      case 'topMouseMove':
        if (!ResponderTouchHistoryStore.touchHistory.numberActiveTouches) {
          // 过滤掉鼠标悬浮时的事件
          return null;
        }
      default:
        // TODO nativeEvent 重用
        nativeEvent = normalizeResponderNativeEvent(nativeEvent);
    }
    return originalExtractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
  }
  return null;
};

EventPluginRegistry.injectEventPluginsByName({
  ResponderEventPlugin,
});
