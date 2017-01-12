//兼容react native 的touch机制  代码来自react-native-web
//https://github.com/necolas/react-native-web/blob/master/src/modules/injectResponderEventPlugin.js
//tab 机制的其它实现 https://github.com/zilverline/react-tap-event-plugin

// based on https://github.com/facebook/react/pull/4303/files
'use strict';

const EventConstants = require('react-dom/lib/EventConstants');
const EventPluginRegistry = require('react-dom/lib/EventPluginRegistry');
const ResponderEventPlugin = require('react-dom/lib/ResponderEventPlugin');
const ResponderTouchHistoryStore = require('react-dom/lib/ResponderTouchHistoryStore');
const normalizeNativeEvent = require('./normalizeNativeEvent');

const supportsTouch = 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch;

const {
  topMouseDown,
  topMouseMove,
  topMouseUp,
  topScroll,
  topSelectionChange,
  topTouchCancel,
  topTouchEnd,
  topTouchMove,
  topTouchStart,
} = EventConstants.topLevelTypes;

const endDependencies = [ topTouchCancel, topTouchEnd, topMouseUp ];
const moveDependencies = [ topTouchMove, topMouseMove ];
const startDependencies = [ topTouchStart, topMouseDown ];

/**
 * 1.Setup ResponderEventPlugin dependencies
 */
ResponderEventPlugin.eventTypes.responderMove.dependencies = moveDependencies;
ResponderEventPlugin.eventTypes.responderEnd.dependencies = endDependencies;
ResponderEventPlugin.eventTypes.responderStart.dependencies = startDependencies;
ResponderEventPlugin.eventTypes.responderRelease.dependencies = endDependencies;
ResponderEventPlugin.eventTypes.responderTerminationRequest.dependencies = [];
ResponderEventPlugin.eventTypes.responderGrant.dependencies = [];
ResponderEventPlugin.eventTypes.responderReject.dependencies = [];
ResponderEventPlugin.eventTypes.responderTerminate.dependencies = [];
ResponderEventPlugin.eventTypes.moveShouldSetResponder.dependencies = moveDependencies;
ResponderEventPlugin.eventTypes.selectionChangeShouldSetResponder.dependencies = [ topSelectionChange ];
ResponderEventPlugin.eventTypes.scrollShouldSetResponder.dependencies = [ topScroll ];
ResponderEventPlugin.eventTypes.startShouldSetResponder.dependencies = startDependencies;

/**
 * 2.ResponderTouchHistoryStore.recordTouchTrack normalizeNativeEvent
 */
const originalRecordTouchTrack = ResponderTouchHistoryStore.recordTouchTrack;

let isMouseDown = false;

ResponderTouchHistoryStore.recordTouchTrack = (topLevelType, nativeEvent) => {
  // Filter out mouse-move events when the mouse button is not down
  // console.log('recordTouchTrack', topLevelType, nativeEvent.type);

  if (supportsTouch) {
    if (topLevelType.startsWith('topMouse')) {
      // 对支持touch的环境 直接过滤掉mouse event
      return;
    }
  } else {
    //对不支持touch 的环境 使用isMouseDown 标记鼠标是否按下 (需关注react native web 修复情况)
    switch (topLevelType) {
      case topMouseDown:
        isMouseDown = true;
        break;
      case topMouseUp:
        isMouseDown = false;
        break;
      default:
        if (!isMouseDown) {
          return;
        }
        break;
    }
  }

  // XXX
  // 1.不调用recordTouchTrack 组件还是会收到onResponderMove等事件
  // 2.这里的normalizeNativeEvent 不会影响组件onResponderMove 中的事件，所以需要在View中对事件再次处理

  originalRecordTouchTrack.call(ResponderTouchHistoryStore, topLevelType, normalizeNativeEvent(nativeEvent));
}

/**
 * 3.injectEventPluginsByName
 */
EventPluginRegistry.injectEventPluginsByName({
  ResponderEventPlugin
});
