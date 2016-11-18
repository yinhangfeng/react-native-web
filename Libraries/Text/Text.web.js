/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Text
 * @flow
 */
'use strict';

const NativeMethodsMixin = require('react/lib/NativeMethodsMixin');
const LayoutMixin = require('RWLayoutMixin');
const React = require('React');
const StyleSheetPropType = require('StyleSheetPropType');
const TextStylePropTypes = require('TextStylePropTypes');
const Touchable = require('Touchable');
const merge = require('merge');
const createWebCoreElement = require('createWebCoreElement');
const CSSClassNames = require('CSSClassNames');
const classNames = require('classnames');

const stylePropType = StyleSheetPropType(TextStylePropTypes);

//TODO
//1.RW native 能识别文本中的空格与回车 web需要兼容么?
//2. textDecorationLine
//3. numberOfLines 实现方式使用的maxHeight 没有考虑外层Text的lineHeight继承
const Text = React.createClass({
  propTypes: {
    /**
     * This can be one of the following values:
     *
     * - `head` - The line is displayed so that the end fits in the container and the missing text
     * at the beginning of the line is indicated by an ellipsis glyph. e.g., "...wxyz"
     * - `middle` - The line is displayed so that the beginning and end fit in the container and the
     * missing text in the middle is indicated by an ellipsis glyph. "ab...yz"
     * - `tail` - The line is displayed so that the beginning fits in the container and the
     * missing text at the end of the line is indicated by an ellipsis glyph. e.g., "abcd..."
     * - `clip` - Lines are not drawn past the edge of the text container.
     *
     * The default is `tail`.
     *
     * `numberOfLines` must be set in conjunction with this prop.
     *
     * > `clip` is working only for iOS
     *
     * RW TODO
     */
    ellipsizeMode: React.PropTypes.oneOf(['head', 'middle', 'tail', 'clip']),
    /**
     * Used to truncate the text with an ellipsis after computing the text
     * layout, including line wrapping, such that the total number of lines
     * does not exceed this number.
     *
     * This prop is commonly used with `ellipsizeMode`.
     */
    numberOfLines: React.PropTypes.number,
    /**
     * Invoked on mount and layout changes with
     *
     *   `{nativeEvent: {layout: {x, y, width, height}}}`
     */
    onLayout: React.PropTypes.func,
    /**
     * This function is called on press.
     *
     * e.g., `onPress={() => console.log('1st')}``
     */
    onPress: React.PropTypes.func,
    /**
     * This function is called on long press.
     *
     * e.g., `onLongPress={this.increaseSize}>``
     */
    onLongPress: React.PropTypes.func,
    /**
     * Lets the user select text, to use the native copy and paste functionality.
     *
     * @platform android
     */
    selectable: React.PropTypes.bool,
    /**
     * When `true`, no visual change is made when text is pressed down. By
     * default, a gray oval highlights the text on press down.
     *
     * @platform ios
     */
    suppressHighlighting: React.PropTypes.bool,
    style: stylePropType,
    /**
     * Used to locate this view in end-to-end tests.
     */
    testID: React.PropTypes.string,
    /**
     * Specifies whether fonts should scale to respect Text Size accessibility setting on iOS. The
     * default is `true`.
     *
     * @platform ios
     */
    allowFontScaling: React.PropTypes.bool,
    /**
     * When set to `true`, indicates that the view is an accessibility element. The default value
     * for a `Text` element is `true`.
     *
     * See the
     * [Accessibility guide](/react-native/docs/accessibility.html#accessible-ios-android)
     * for more information.
     */
     accessible: React.PropTypes.bool,
  },
  getDefaultProps(): Object {
    return {
      accessible: true,
      allowFontScaling: true,
      ellipsizeMode: 'tail',
    };
  },
  getInitialState: function(): Object {
    return merge(Touchable.Mixin.touchableGetInitialState(), {
      isHighlighted: false,
    });
  },
  mixins: [NativeMethodsMixin, LayoutMixin],
  getChildContext(): Object {
    return {isInAParentText: true};
  },
  childContextTypes: {
    isInAParentText: React.PropTypes.bool
  },
  contextTypes: {
    isInAParentText: React.PropTypes.bool
  },
  /**
   * Only assigned if touch is needed.
   */
  _handlers: (null: ?Object),
  _hasPressHandler(): boolean {
    return !!this.props.onPress || !!this.props.onLongPress;
  },
  /**
   * These are assigned lazily the first time the responder is set to make plain
   * text nodes as cheap as possible.
   */
  touchableHandleActivePressIn: (null: ?Function),
  touchableHandleActivePressOut: (null: ?Function),
  touchableHandlePress: (null: ?Function),
  touchableHandleLongPress: (null: ?Function),
  touchableGetPressRectOffset: (null: ?Function),
  render(): ReactElement<any> {
    let newProps = this.props;
    if (this.props.onStartShouldSetResponder || this._hasPressHandler()) {
      if (!this._handlers) {
        this._handlers = {
          onStartShouldSetResponder: (): bool => {
            const shouldSetFromProps = this.props.onStartShouldSetResponder &&
                this.props.onStartShouldSetResponder();
            const setResponder = shouldSetFromProps || this._hasPressHandler();
            if (setResponder && !this.touchableHandleActivePressIn) {
              // Attach and bind all the other handlers only the first time a touch
              // actually happens.
              for (const key in Touchable.Mixin) {
                if (typeof Touchable.Mixin[key] === 'function') {
                  (this: any)[key] = Touchable.Mixin[key].bind(this);
                }
              }
              this.touchableHandleActivePressIn = () => {
                if (this.props.suppressHighlighting || !this._hasPressHandler()) {
                  return;
                }
                this.setState({
                  isHighlighted: true,
                });
              };

              this.touchableHandleActivePressOut = () => {
                if (this.props.suppressHighlighting || !this._hasPressHandler()) {
                  return;
                }
                this.setState({
                  isHighlighted: false,
                });
              };

              this.touchableHandlePress = () => {
                this.props.onPress && this.props.onPress();
              };

              this.touchableHandleLongPress = () => {
                this.props.onLongPress && this.props.onLongPress();
              };

              this.touchableGetPressRectOffset = function(): RectOffset {
                return PRESS_RECT_OFFSET;
              };
            }
            return setResponder;
          },
          onResponderGrant: function(e: SyntheticEvent, dispatchID: string) {
            this.touchableHandleResponderGrant(e, dispatchID);
            this.props.onResponderGrant &&
              this.props.onResponderGrant.apply(this, arguments);
          }.bind(this),
          onResponderMove: function(e: SyntheticEvent) {
            this.touchableHandleResponderMove(e);
            this.props.onResponderMove &&
              this.props.onResponderMove.apply(this, arguments);
          }.bind(this),
          onResponderRelease: function(e: SyntheticEvent) {
            this.touchableHandleResponderRelease(e);
            this.props.onResponderRelease &&
              this.props.onResponderRelease.apply(this, arguments);
          }.bind(this),
          onResponderTerminate: function(e: SyntheticEvent) {
            this.touchableHandleResponderTerminate(e);
            this.props.onResponderTerminate &&
              this.props.onResponderTerminate.apply(this, arguments);
          }.bind(this),
          onResponderTerminationRequest: function(): bool {
            // Allow touchable or props.onResponderTerminationRequest to deny
            // the request
            var allowTermination = this.touchableHandleResponderTerminationRequest();
            if (allowTermination && this.props.onResponderTerminationRequest) {
              allowTermination = this.props.onResponderTerminationRequest.apply(this, arguments);
            }
            return allowTermination;
          }.bind(this),
        };
      }
      newProps = {
        ...this.props,
        ...this._handlers,
        isHighlighted: this.state.isHighlighted,
      };
    }

    let style;
    let classNameArr = [CSSClassNames.TEXT];
    // if(this.context.isInAParentText) {
    //   classNameArr.push(CSSClassNames.TEXT_CHILD);
    // }
    if(newProps.numberOfLines) {
      classNameArr.push(CSSClassNames.TEXT_NOL);

      let lineHeight;
      let maxHeight;

      if (newProps.lineHeight) {
        lineHeight = newProps.lineHeight;
        maxHeight = lineHeight * newProps.numberOfLines;
      } else {
        lineHeight = '1.375';
        maxHeight = (1.375 * newProps.numberOfLines) + 'em';
      }

      //TODO RW 根据lineHeight 算出maxHeight  用em会比较方便
      style = {
        WebkitLineClamp: newProps.numberOfLines,
        lineHeight: lineHeight,
        maxHeight: maxHeight,
      };
    }
    if(this.props.className) {
      classNameArr.push(this.props.className);
    }

    //TODO RW lineHeight
    return createWebCoreElement('span', {
      ...newProps,
      className: classNames(classNameArr),
      style: style ? [newProps.style, style] : newProps.style,
    });

  },
});

module.exports = Text;
