/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule TouchableOpacity
 * @noflow
 */
'use strict';

// Note (avik): add @flow when Flow supports spread properties in propTypes

//var Animated = require('Animated');
var NativeMethodsMixin = require('NativeMethodsMixin');
var React = require('React');
var TimerMixin = require('react-timer-mixin');
var Touchable = require('Touchable');
var TouchableWithoutFeedback = require('TouchableWithoutFeedback');

var ensurePositiveDelayProps = require('ensurePositiveDelayProps');
var flattenStyle = require('flattenStyle');

var View = require('View');
var ReactDOM = require('react-dom');
var CSSClassNames = require('CSSClassNames');

const RWPerformance = require('RWPerformance');

// 对低性能设备 不使用触摸效果
const showActive = RWPerformance.level >= RWPerformance.MEDIUM;

type Event = Object;

var PRESS_RETENTION_OFFSET = {top: 20, left: 20, right: 20, bottom: 30};

/**
 * A wrapper for making views respond properly to touches.
 * On press down, the opacity of the wrapped view is decreased, dimming it.
 * This is done without actually changing the view hierarchy, and in general is
 * easy to add to an app without weird side-effects.
 *
 * Example:
 *
 * ```
 * renderButton: function() {
 *   return (
 *     <TouchableOpacity onPress={this._onPressButton}>
 *       <Image
 *         style={styles.button}
 *         source={require('image!myButton')}
 *       />
 *     </TouchableOpacity>
 *   );
 * },
 * ```
 */
var TouchableOpacity = React.createClass({
  mixins: [TimerMixin, Touchable.Mixin, NativeMethodsMixin],

  propTypes: {
    ...TouchableWithoutFeedback.propTypes,
    /**
     * Determines what the opacity of the wrapped view should be when touch is
     * active.
     */
    activeOpacity: React.PropTypes.number,
  },

  getDefaultProps: function() {
    return {
      activeOpacity: 0.2,
      delayPressIn: 90, //在网页环境下设置延迟
    };
  },

  getInitialState: function() {
    return {
      ...this.touchableGetInitialState(),
      //anim: 1,
    };
  },

  componentDidMount: function() {
    ensurePositiveDelayProps(this.props);
  },

  componentWillReceiveProps: function(nextProps) {
    ensurePositiveDelayProps(nextProps);
  },

  /**
   * Animate the touchable to a new opacity.
   */
  setOpacityTo: function(value: number) {
    // Animated.timing(
    //   this.state.anim,
    //   {toValue: value, duration: 150}
    // ).start();
    // var touchableRef = this.refs["touchable"];
    // setTimeout(() => {
    //   ReactDOM.findDOMNode(touchableRef).className += " active";//style.opacity = value;
    // });
  },

  /**
   * `Touchable.Mixin` self callbacks. The mixin will invoke these if they are
   * defined on your component.
   */
  touchableHandleActivePressIn: function(e: Event) {
    this.clearTimeout(this._hideTimeout);
    this._hideTimeout = null;
    this._opacityActive();
    this.props.onPressIn && this.props.onPressIn(e);
  },

  touchableHandleActivePressOut: function(e: Event) {
    if (!this._hideTimeout) {
      this._opacityInactive();
    }
    this.props.onPressOut && this.props.onPressOut(e);
  },

  touchableHandlePress: function(e: Event) {
    this.clearTimeout(this._hideTimeout);
    this._opacityActive();
    this._hideTimeout = this.setTimeout(
      this._opacityInactive,
      this.props.delayPressOut || 100
    );
    this.props.onPress && this.props.onPress(e);
  },

  touchableHandleLongPress: function(e: Event) {
    this.props.onLongPress && this.props.onLongPress(e);
  },

  touchableGetPressRectOffset: function() {
    return this.props.pressRetentionOffset || PRESS_RETENTION_OFFSET;
  },

  touchableGetHitSlop: function() {
    return this.props.hitSlop;
  },

  touchableGetHighlightDelayMS: function() {
    return this.props.delayPressIn || 0;
  },

  touchableGetLongPressDelayMS: function() {
    return this.props.delayLongPress === 0 ? 0 :
      this.props.delayLongPress || 500;
  },

  touchableGetPressOutDelayMS: function() {
    return this.props.delayPressOut;
  },

  _opacityActive: function() {
    //toggle class make active and inactive via css
    //this.setOpacityTo(this.props.activeOpacity);
    if (showActive) {
      ReactDOM.findDOMNode(this.refs["touchable"]).classList.add("active");
    }
  },

  _opacityInactive: function() {
    if (showActive) {
      this.clearTimeout(this._hideTimeout);
      this._hideTimeout = null;
      // var childStyle = flattenStyle(this.props.style) || {};
      // this.setOpacityTo(
      //   childStyle.opacity === undefined ? 1 : childStyle.opacity
      // );

      ReactDOM.findDOMNode(this.refs["touchable"]).classList.remove("active");
    }
  },

  render: function() {
    var className = CSSClassNames.TOUCHABLE;

    // let testProps = {
    //   onStartShouldSetResponderCapture: (e) => {
    //     console.log('TouchableOpacity onStartShouldSetResponderCapture ', e.type);
    //   },
    //   onMoveShouldSetResponderCapture: (e) => {
    //     console.log('TouchableOpacity onMoveShouldSetResponderCapture ', e.type);
    //   },
    //   onStartShouldSetResponder: (e) => {
    //     console.log('TouchableOpacity onStartShouldSetResponder ', e.type);
    //     return this.touchableHandleStartShouldSetResponder(e);
    //   },
    //   onMoveShouldSetResponder: (e) => {
    //     console.log('TouchableOpacity onMoveShouldSetResponder ', e.type);
    //   },
    //   onResponderGrant: (e) => {
    //     console.log('TouchableOpacity onResponderGrant ', e.type);
    //     return this.touchableHandleResponderGrant(e);
    //   },
    //   onResponderMove: (e) => {
    //     console.log('TouchableOpacity onResponderMove ', e.type);
    //     return this.touchableHandleResponderMove(e);
    //   },
    //   onResponderReject: (e) => {
    //     console.log('TouchableOpacity onResponderReject ', e.type);
    //   },
    //   onResponderRelease: (e) => {
    //     console.log('TouchableOpacity onResponderRelease ', e.type);
    //     return this.touchableHandleResponderRelease(e);
    //   },
    //   onResponderTerminate: (e) => {
    //     console.log('TouchableOpacity onResponderTerminate ', e.type);
    //     return this.touchableHandleResponderTerminate(e);
    //   },
    //   onResponderTerminationRequest: (e) => {
    //     console.log('TouchableOpacity onResponderTerminationRequest ', e.type);
    //     return this.touchableHandleResponderTerminationRequest(e);
    //   },
    //
    //   onTouchStartCapture: (e) => {
    //     console.log('TouchableOpacity onTouchStartCapture ', e.type);
    //   },
    //   onTouchMoveCapture: (e) => {
    //     console.log('TouchableOpacity onTouchMoveCapture ', e.type);
    //   },
    //   onTouchStart: (e) => {
    //     console.log('TouchableOpacity onTouchStart ', e.type);
    //   },
    //   onTouchMove: (e) => {
    //     console.log('TouchableOpacity onTouchMove ', e.type);
    //   },
    //   onTouchCancel: (e) => {
    //     console.log('TouchableOpacity onTouchCancel ', e.type);
    //   },
    //   onTouchEnd: (e) => {
    //     console.log('TouchableOpacity onTouchEnd ', e.type);
    //   },
    // };
    return (
      <View
        ref="touchable"
        className={className}
        accessible={this.props.accessible !== false}
        accessibilityLabel={this.props.accessibilityLabel}
        accessibilityComponentType={this.props.accessibilityComponentType}
        accessibilityTraits={this.props.accessibilityTraits}
        style={[this.props.style, {opacity: 1}]}
        testID={this.props.testID}
        onLayout={this.props.onLayout}
        hitSlop={this.props.hitSlop}
        onStartShouldSetResponder={this.touchableHandleStartShouldSetResponder}
        onResponderTerminationRequest={this.touchableHandleResponderTerminationRequest}
        onResponderGrant={this.touchableHandleResponderGrant}
        onResponderMove={this.touchableHandleResponderMove}
        onResponderRelease={this.touchableHandleResponderRelease}
        onResponderTerminate={this.touchableHandleResponderTerminate}>
        {this.props.children}
      </View>
    );
    // {Touchable.renderDebugView({color: 'cyan', hitSlop: this.props.hitSlop})}
  },
});

module.exports = TouchableOpacity;
