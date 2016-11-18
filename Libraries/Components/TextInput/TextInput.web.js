/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule TextInput
 * @flow
 */
'use strict';

const DocumentSelectionState = require('DocumentSelectionState');
//const EventEmitter = require('EventEmitter');
const NativeMethodsMixin = require('react/lib/NativeMethodsMixin');
const Platform = require('Platform');
const PropTypes = require('react/lib/ReactPropTypes');
const React = require('React');
const ReactNative = require('ReactNative');
const ReactChildren = require('react/lib/ReactChildren');
//const StyleSheet = require('StyleSheet');
const Text = require('Text');
//const TextInputState = require('TextInputState');
//const TimerMixin = require('react-timer-mixin');
//const TouchableWithoutFeedback = require('TouchableWithoutFeedback');
//const UIManager = require('UIManager');
const View = require('View');
const createWebCoreElement = require('createWebCoreElement');
const CSSClassNames = require('CSSClassNames');

//const emptyFunction = require('fbjs/lib/emptyFunction');
//const invariant = require('fbjs/lib/invariant');

// const onlyMultiline = {
//   onTextInput: true, // not supported in Open Source yet
//   children: true,
// };

// const notMultiline = {
//   // nothing yet
// };

let KEYBOARD_TYPE_MAP = {
  'default': 'text',
  'ascii-capable': 'text',
  'numbers-and-punctuation': 'number',
  'url': 'url',
  'number-pad': 'number',
  'phone-pad': 'tel',
  'name-phone-pad': 'text',
  'email-address': 'email',
  'decimal-pad': 'number',
  'twitter': 'text',
  'web-search': 'search',
  'numeric': 'number'
};

type Event = Object;

const TextInput = React.createClass({
  statics: {
    /* TODO(brentvatne) docs are needed for this */
    //State: TextInputState,
  },

  propTypes: {
    ...View.propTypes,
    /**
     * Can tell TextInput to automatically capitalize certain characters.
     *
     * - characters: all characters,
     * - words: first letter of each word
     * - sentences: first letter of each sentence (default)
     * - none: don't auto capitalize anything
     */
    autoCapitalize: PropTypes.oneOf([
      'none',
      'sentences',
      'words',
      'characters',
    ]),
    /**
     * If false, disables auto-correct. The default value is true.
     */
    autoCorrect: PropTypes.bool,
    /**
     * If true, focuses the input on componentDidMount.
     * The default value is false.
     */
    autoFocus: PropTypes.bool,
    /**
     * If false, text is not editable. The default value is true.
     */
    editable: PropTypes.bool,
    /**
     * Determines which keyboard to open, e.g.`numeric`.
     *
     * The following values work across platforms:
     * - default
     * - numeric
     * - email-address
     */
    keyboardType: PropTypes.oneOf([
      // Cross-platform
      'default',
      'email-address',
      'numeric',
      'phone-pad',
      // iOS-only
      'ascii-capable',
      'numbers-and-punctuation',
      'url',
      'number-pad',
      'name-phone-pad',
      'decimal-pad',
      'twitter',
      'web-search',
    ]),
    /**
     * Determines the color of the keyboard.
     * @platform ios
     */
    keyboardAppearance: PropTypes.oneOf([
      'default',
      'light',
      'dark',
    ]),
    /**
     * Determines how the return key should look.
     * @platform ios
     */
    returnKeyType: PropTypes.oneOf([
      'default',
      'go',
      'google',
      'join',
      'next',
      'route',
      'search',
      'send',
      'yahoo',
      'done',
      'emergency-call',
    ]),
    /**
     * Limits the maximum number of characters that can be entered. Use this
     * instead of implementing the logic in JS to avoid flicker.
     */
    maxLength: PropTypes.number,
    /**
     * Sets the number of lines for a TextInput. Use it with multiline set to
     * true to be able to fill the lines.
     * @platform android
     */
    numberOfLines: PropTypes.number,
    /**
     * If true, the keyboard disables the return key when there is no text and
     * automatically enables it when there is text. The default value is false.
     * @platform ios
     */
    enablesReturnKeyAutomatically: PropTypes.bool,
    /**
     * If true, the text input can be multiple lines.
     * The default value is false.
     */
    multiline: PropTypes.bool,
    /**
     * Callback that is called when the text input is blurred
     */
    onBlur: PropTypes.func,
    /**
     * Callback that is called when the text input is focused
     */
    onFocus: PropTypes.func,
    /**
     * Callback that is called when the text input's text changes.
     */
    onChange: PropTypes.func,
    /**
     * Callback that is called when the text input's text changes.
     * Changed text is passed as an argument to the callback handler.
     */
    onChangeText: PropTypes.func,
    /**
     * Callback that is called when text input ends.
     */
    onEndEditing: PropTypes.func,
    /**
     * Callback that is called when the text input selection is changed
     */
    onSelectionChange: PropTypes.func,
    /**
     * Callback that is called when the text input's submit button is pressed.
     * Invalid if multiline={true} is specified.
     */
    onSubmitEditing: PropTypes.func,
    /**
     * Callback that is called when a key is pressed.
     * Pressed key value is passed as an argument to the callback handler.
     * Fires before onChange callbacks.
     * @platform ios
     */
    onKeyPress: PropTypes.func,
    /**
     * Invoked on mount and layout changes with `{x, y, width, height}`.
     */
    onLayout: PropTypes.func,
    /**
     * The string that will be rendered before text input has been entered
     */
    placeholder: PropTypes.string,
    /**
     * The text color of the placeholder string
     */
    placeholderTextColor: PropTypes.string,
    /**
     * If true, the text input obscures the text entered so that sensitive text
     * like passwords stay secure. The default value is false.
     */
    secureTextEntry: PropTypes.bool,
    /**
    * The highlight (and cursor on ios) color of the text input
    */
    selectionColor: PropTypes.string,
    /**
     * See DocumentSelectionState.js, some state that is responsible for
     * maintaining selection information for a document
     * @platform ios
     */
    selectionState: PropTypes.instanceOf(DocumentSelectionState),
    /**
     * The value to show for the text input. TextInput is a controlled
     * component, which means the native value will be forced to match this
     * value prop if provided. For most uses this works great, but in some
     * cases this may cause flickering - one common cause is preventing edits
     * by keeping value the same. In addition to simply setting the same value,
     * either set `editable={false}`, or set/update `maxLength` to prevent
     * unwanted edits without flicker.
     */
    value: PropTypes.string,
    /**
     * Provides an initial value that will change when the user starts typing.
     * Useful for simple use-cases where you don't want to deal with listening
     * to events and updating the value prop to keep the controlled state in sync.
     */
    defaultValue: PropTypes.string,
    /**
     * When the clear button should appear on the right side of the text view
     * @platform ios
     */
    clearButtonMode: PropTypes.oneOf([
      'never',
      'while-editing',
      'unless-editing',
      'always',
    ]),
    /**
     * If true, clears the text field automatically when editing begins
     * @platform ios
     */
    clearTextOnFocus: PropTypes.bool,
    /**
     * If true, all text will automatically be selected on focus
     */
    selectTextOnFocus: PropTypes.bool,
    /**
     * If true, the text field will blur when submitted.
     * The default value is true for single-line fields and false for
     * multiline fields. Note that for multiline fields, setting blurOnSubmit
     * to true means that pressing return will blur the field and trigger the
     * onSubmitEditing event instead of inserting a newline into the field.
     */
    blurOnSubmit: PropTypes.bool,
    /**
     * Styles
     */
    style: Text.propTypes.style,
    /**
     * The color of the textInput underline.
     * @platform android
     */
    underlineColorAndroid: PropTypes.string,
  },

  /**
   * `NativeMethodsMixin` will look for this when invoking `setNativeProps`. We
   * make `this` look like an actual native component class.
   */
  mixins: [NativeMethodsMixin],

  // viewConfig:
  //   ((Platform.OS === 'ios' && RCTTextField ?
  //     RCTTextField.viewConfig :
  //     (Platform.OS === 'android' && AndroidTextInput ?
  //       AndroidTextInput.viewConfig :
  //       {})) : Object),

  /**
   * Returns if the input is currently focused.
   */
  isFocused: function(): boolean {
    return this.refs.input === document.activeElement;
  },

  // contextTypes: {
  //   onFocusRequested: React.PropTypes.func,
  //   focusEmitter: React.PropTypes.instanceOf(EventEmitter), //TODO RW 兼容native focus机制? 或者用web自己的 document.activeElement?
  // },

  //_focusSubscription: (undefined: ?Function),

  componentDidMount: function() {
    //TODO RW
    if (this.props.autoFocus) {
      this.refs.input.focus();
    }
  },

  // componentWillUnmount: function() {
  //   this._focusSubscription && this._focusSubscription.remove();
  //   if (this.isFocused()) {
  //     this.blur();
  //   }
  // },

  getChildContext: function(): Object {
    return {isInAParentText: true};
  },

  childContextTypes: {
    isInAParentText: React.PropTypes.bool
  },

  /**
   * Removes all text from the input.
   */
  clear: function() {
    if(this.refs.input) {
      this.refs.input.value = '';
    }
    //this.setNativeProps({text: ''});
  },

  render: function() {
    const props = this.props;

    const propsCommon = {
      ...props,
      className: CSSClassNames.TEXT_INPUT,
      ref: 'input',
      'aria-label': props.accessibilityLabel,
      onBlur: props.onBlur && this._onBlur,
      onChange: (props.onChange || props.onChangeText) && this._onChange,
      onFocus: this._onFocus,
      onSelect: props.onSelectionChange && this._onSelectionChange,
      readOnly: props.editable === false,
      children: undefined, //TODO RW 暂时不支持children
    };

    let input;
    if (props.multiline) {
      propsCommon.maxRows = props.numberOfLines;
      propsCommon.minRows = props.numberOfLines;

      input = createWebCoreElement('textarea', propsCommon);
    } else {
      propsCommon.type = KEYBOARD_TYPE_MAP[props.keyboardType];

      if (props.password || props.secureTextEntry) {
        propsCommon.type = 'password';
      }
      input = createWebCoreElement('input', propsCommon);
    }

    //TODO RW children
    return input;
  },

  _onFocus: function(event: Event) {
    const { clearTextOnFocus, onFocus, selectTextOnFocus } = this.props;
    const node = this.refs.input;
    if(node) {
      if (clearTextOnFocus) node.value = '';
      if (selectTextOnFocus) node.select();
    }
    if (onFocus) {
      event.nativeEvent.text = event.target.value;
      onFocus(event);
    }

    // if (this.props.selectionState) {
    //   this.props.selectionState.focus();
    // }
  },

  _onChange: function(event: Event) {
    if (this.props.onChange) {
      event.nativeEvent.text = event.target.value;
      this.props.onChange(event);
    }
    if (this.props.onChangeText) this.props.onChangeText(event.target.value);
  },

  _onBlur: function(event: Event) {
    //this.blur();
    if (this.props.onBlur) {
      event.nativeEvent.text = event.target.value;
      this.props.onBlur(event);
    }

    // if (this.props.selectionState) {
    //   this.props.selectionState.blur();
    // }
  },

  _onSelectionChange: function(e) {
    const { onSelectionChange } = this.props;

    if (onSelectionChange) {
      const { selectionDirection, selectionEnd, selectionStart } = e.target;
      e.nativeEvent.text = e.target.value;
      const event = {
        selectionDirection,
        selectionEnd,
        selectionStart,
        nativeEvent: e.nativeEvent
      };
      onSelectionChange(event);
    }
  },
});

// const styles = StyleSheet.create({
//   input: {
//     alignSelf: 'stretch',
//   },
// });

module.exports = TextInput;
