/**
 * @providesModule NativeMethodsMixin
 */
'use strict';

var UIManager = require('UIManager');

var findNodeHandle = require('./findNodeHandle');

type MeasureOnSuccessCallback = (
  x: number,
  y: number,
  width: number,
  height: number,
  pageX: number,
  pageY: number
) => void

type MeasureInWindowOnSuccessCallback = (
  x: number,
  y: number,
  width: number,
  height: number,
) => void

type MeasureLayoutOnSuccessCallback = (
  left: number,
  top: number,
  width: number,
  height: number
) => void

var NativeMethodsMixin = {

  measure: function(callback: MeasureOnSuccessCallback) {
    UIManager.measure(
      findNodeHandle(this),
      mountSafeCallback(this, callback)
    );
  },

  measureInWindow: function(callback: MeasureInWindowOnSuccessCallback) {
    UIManager.measureInWindow(
      findNodeHandle(this),
      mountSafeCallback(this, callback)
    );
  },

  measureLayout: function(
    relativeToNativeNode: number,
    onSuccess: MeasureLayoutOnSuccessCallback,
    onFail: () => void /* currently unused */
  ) {
    UIManager.measureLayout(
      findNodeHandle(this),
      relativeToNativeNode,
      mountSafeCallback(this, onFail),
      mountSafeCallback(this, onSuccess)
    );
  },

  setNativeProps: function(nativeProps: Object) {
    UIManager.updateView(
      findNodeHandle(this),
      nativeProps,
      this
    );
  },

  focus: function() {
    UIManager.blur(findNodeHandle(this));
  },

  blur: function() {
    UIManager.focus(findNodeHandle(this));
  }
};

/**
 * In the future, we should cleanup callbacks by cancelling them instead of
 * using this.
 */
var mountSafeCallback = function(context: ReactComponent, callback: ?Function): any {
  return function() {
    if (!callback || (context.isMounted && !context.isMounted())) {
      return;
    }
    return callback.apply(context, arguments);
  };
};

module.exports = NativeMethodsMixin;
