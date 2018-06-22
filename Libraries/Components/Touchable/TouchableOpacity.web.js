/**
 * RW SYNC react-native: 0.49 react-native-web: 0.1.0
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @noflow
 */
'use strict';

// Note (avik): add @flow when Flow supports spread properties in propTypes

// var Animated = require('react-native/Libraries/Animated/src/Animated');
var NativeMethodsMixin = require('react-native/Libraries/Renderer/shims/NativeMethodsMixin');
var React = require('react-native/Libraries/react-native/React');
var PropTypes = require('prop-types');
var TimerMixin = require('react-timer-mixin');
var Touchable = require('react-native/Libraries/Components/Touchable/Touchable');
var TouchableWithoutFeedback = require('react-native/Libraries/Components/Touchable/TouchableWithoutFeedback');

var createReactClass = require('create-react-class');
// var ensurePositiveDelayProps = require('react-native/Libraries/Components/Touchable/ensurePositiveDelayProps');
var flattenStyle = require('react-native/Libraries/StyleSheet/flattenStyle');

var View = require('react-native/Libraries/Components/View/View');
var ReactDOM = require('react-dom');
var CSSClassNames = require('react-native/Libraries/StyleSheet/CSSClassNames');

const RWPerformance = require('react-native/Libraries/lrnw/RWPerformance');

// 对低性能设备 不使用触摸效果
const showActive = RWPerformance.level >= RWPerformance.MEDIUM;

type Event = Object;

var PRESS_RETENTION_OFFSET = {top: 20, left: 20, right: 20, bottom: 30};

/**
 * A wrapper for making views respond properly to touches.
 * On press down, the opacity of the wrapped view is decreased, dimming it.
 *
 * Opacity is controlled by wrapping the children in an Animated.View, which is
 * added to the view hiearchy.  Be aware that this can affect layout.
 *
 * Example:
 *
 * ```
 * renderButton: function() {
 *   return (
 *     <TouchableOpacity onPress={this._onPressButton}>
 *       <Image
 *         style={styles.button}
 *         source={require('./myButton.png')}
 *       />
 *     </TouchableOpacity>
 *   );
 * },
 * ```
 */
var TouchableOpacity = createReactClass({
  displayName: 'TouchableOpacity',
  mixins: [TimerMixin, Touchable.Mixin, NativeMethodsMixin],

  propTypes: {
    ...TouchableWithoutFeedback.propTypes,
    /**
     * Determines what the opacity of the wrapped view should be when touch is
     * active. Defaults to 0.2.
     */
    activeOpacity: PropTypes.number,
    /**
     * Apple TV parallax effects
     */
    // tvParallaxProperties: PropTypes.object,
  },

  getDefaultProps: function() {
    return {
      activeOpacity: 0.2,
      delayPressIn: 90, //RW 在网页环境下设置延迟
    };
  },

  getInitialState: function() {
    return {
      ...this.touchableGetInitialState(),
      // anim: new Animated.Value(this._getChildStyleOpacityWithDefault()),
    };
  },

  // RW 为了效率
  // componentDidMount: function() {
  //   ensurePositiveDelayProps(this.props);
  // },

  // componentWillReceiveProps: function(nextProps) {
  //   ensurePositiveDelayProps(nextProps);
  // },

  /**
   * Animate the touchable to a new opacity.
   */
  setOpacityTo: function(value: number, duration: number) {
    // Animated.timing(
    //   this.state.anim,
    //   {
    //     toValue: value,
    //     duration: duration,
    //     easing: Easing.inOut(Easing.quad),
    //     useNativeDriver: true,
    //   }
    // ).start();
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

  _opacityActive: function(duration: number) {
    // this.setOpacityTo(this.props.activeOpacity, duration);
    if (showActive) {
      ReactDOM.findDOMNode(this.refs["touchable"]).classList.add("active");
    }
  },

  _opacityInactive: function(duration: number) {
    if (showActive) {
      this.clearTimeout(this._hideTimeout);
      this._hideTimeout = null;

      ReactDOM.findDOMNode(this.refs["touchable"]).classList.remove("active");
    }
  },

  render: function() {
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

    const props = this.props;
    let className = CSSClassNames.TOUCHABLE;
    if (props.className) {
      className += ' ' + props.className;
    }

    return (
      <View
        {...props}
        ref="touchable"
        className={className}
        onStartShouldSetResponder={this.touchableHandleStartShouldSetResponder}
        onResponderTerminationRequest={this.touchableHandleResponderTerminationRequest}
        onResponderGrant={this.touchableHandleResponderGrant}
        onResponderMove={this.touchableHandleResponderMove}
        onResponderRelease={this.touchableHandleResponderRelease}
        onResponderTerminate={this.touchableHandleResponderTerminate}>
        {props.children}
      </View>
    );
  },
});

module.exports = TouchableOpacity;
