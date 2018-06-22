/**
 * RW SYNC react-native: 0.49 react-native-web: 0.1.0
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */
'use strict';

const ColorPropType = require('react-native/Libraries/StyleSheet/ColorPropType');
// const DocumentSelectionState = require('react-native/Libraries/vendor/document/selection/DocumentSelectionState');
// const EventEmitter = require('react-native/Libraries/vendor/emitter/EventEmitter');
const NativeMethodsMixin = require('react-native/Libraries/Renderer/shims/NativeMethodsMixin');
// const Platform = require('react-native/Libraries/Utilities/Platform');
const React = require('react-native/Libraries/react-native/React');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
// const ReactNative = require('react-native/Libraries/Renderer/shims/ReactNative');
// const StyleSheet = require('react-native/Libraries/StyleSheet/StyleSheet');
const Text = require('react-native/Libraries/Text/Text');
const TextInputState = require('react-native/Libraries/Components/TextInput/TextInputState');
// const TimerMixin = require('react-timer-mixin');
// const TouchableWithoutFeedback = require('react-native/Libraries/Components/Touchable/TouchableWithoutFeedback');
// const UIManager = require('react-native/Libraries/ReactNative/UIManager');
const ViewPropTypes = require('react-native/Libraries/Components/View/ViewPropTypes');

const createWebCoreElement = require('react-native/Libraries/lrnw/createWebCoreElement');
const CSSClassNames = require('react-native/Libraries/StyleSheet/CSSClassNames');

// const onlyMultiline = {
//   onTextInput: true,
//   children: true,
// };

type Event = Object;
type Selection = {
  start: number,
  end?: number,
};

// const DataDetectorTypes = [
//   'phoneNumber',
//   'link',
//   'address',
//   'calendarEvent',
//   'none',
//   'all',
// ];

const emptyObject = {};

/**
 * Determines whether a 'selection' prop differs from a node's existing
 * selection state.
 */
const isSelectionStale = (node, selection) => {
  if (node && selection) {
    const { selectionEnd, selectionStart } = node;
    const { start, end } = selection;
    return start !== selectionStart || end !== selectionEnd;
  }
  return false;
};

/**
 * A foundational component for inputting text into the app via a
 * keyboard. Props provide configurability for several features, such as
 * auto-correction, auto-capitalization, placeholder text, and different keyboard
 * types, such as a numeric keypad.
 *
 * The simplest use case is to plop down a `TextInput` and subscribe to the
 * `onChangeText` events to read the user input. There are also other events,
 * such as `onSubmitEditing` and `onFocus` that can be subscribed to. A simple
 * example:
 *
 * ```ReactNativeWebPlayer
 * import React, { Component } from 'react';
 * import { AppRegistry, TextInput } from 'react-native';
 *
 * export default class UselessTextInput extends Component {
 *   constructor(props) {
 *     super(props);
 *     this.state = { text: 'Useless Placeholder' };
 *   }
 *
 *   render() {
 *     return (
 *       <TextInput
 *         style={{height: 40, borderColor: 'gray', borderWidth: 1}}
 *         onChangeText={(text) => this.setState({text})}
 *         value={this.state.text}
 *       />
 *     );
 *   }
 * }
 *
 * // skip this line if using Create React Native App
 * AppRegistry.registerComponent('AwesomeProject', () => UselessTextInput);
 * ```
 *
 * Two methods exposed via the native element are .focus() and .blur() that
 * will focus or blur the TextInput programmatically.
 *
 * Note that some props are only available with `multiline={true/false}`.
 * Additionally, border styles that apply to only one side of the element
 * (e.g., `borderBottomColor`, `borderLeftWidth`, etc.) will not be applied if
 * `multiline=false`. To achieve the same effect, you can wrap your `TextInput`
 * in a `View`:
 *
 * ```ReactNativeWebPlayer
 * import React, { Component } from 'react';
 * import { AppRegistry, View, TextInput } from 'react-native';
 *
 * class UselessTextInput extends Component {
 *   render() {
 *     return (
 *       <TextInput
 *         {...this.props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
 *         editable = {true}
 *         maxLength = {40}
 *       />
 *     );
 *   }
 * }
 *
 * export default class UselessTextInputMultiline extends Component {
 *   constructor(props) {
 *     super(props);
 *     this.state = {
 *       text: 'Useless Multiline Placeholder',
 *     };
 *   }
 *
 *   // If you type something in the text box that is a color, the background will change to that
 *   // color.
 *   render() {
 *     return (
 *      <View style={{
 *        backgroundColor: this.state.text,
 *        borderBottomColor: '#000000',
 *        borderBottomWidth: 1 }}
 *      >
 *        <UselessTextInput
 *          multiline = {true}
 *          numberOfLines = {4}
 *          onChangeText={(text) => this.setState({text})}
 *          value={this.state.text}
 *        />
 *      </View>
 *     );
 *   }
 * }
 *
 * // skip these lines if using Create React Native App
 * AppRegistry.registerComponent(
 *  'AwesomeProject',
 *  () => UselessTextInputMultiline
 * );
 * ```
 *
 * `TextInput` has by default a border at the bottom of its view. This border
 * has its padding set by the background image provided by the system, and it
 * cannot be changed. Solutions to avoid this is to either not set height
 * explicitly, case in which the system will take care of displaying the border
 * in the correct position, or to not display the border by setting
 * `underlineColorAndroid` to transparent.
 *
 * Note that on Android performing text selection in input can change
 * app's activity `windowSoftInputMode` param to `adjustResize`.
 * This may cause issues with components that have position: 'absolute'
 * while keyboard is active. To avoid this behavior either specify `windowSoftInputMode`
 * in AndroidManifest.xml ( https://developer.android.com/guide/topics/manifest/activity-element.html )
 * or control this param programmatically with native code.
 *
 */

// $FlowFixMe(>=0.41.0)
const TextInput = createReactClass({
  displayName: 'TextInput',
  statics: {
    /* TODO(brentvatne) docs are needed for this */
    State: TextInputState,
  },

  propTypes: {
    ...ViewPropTypes,
    /**
     * Can tell `TextInput` to automatically capitalize certain characters.
     *
     * - `characters`: all characters.
     * - `words`: first letter of each word.
     * - `sentences`: first letter of each sentence (*default*).
     * - `none`: don't auto capitalize anything.
     */
    autoCapitalize: PropTypes.oneOf([
      'none',
      'sentences',
      'words',
      'characters',
    ]),
    /**
     * If `false`, disables auto-correct. The default value is `true`.
     */
    autoCorrect: PropTypes.bool,
    /**
     * If `false`, disables spell-check style (i.e. red underlines).
     * The default value is inherited from `autoCorrect`.
     * @platform ios
     */
    // spellCheck: PropTypes.bool,
    /**
     * If `true`, focuses the input on `componentDidMount`.
     * The default value is `false`.
     */
    autoFocus: PropTypes.bool,
    /**
     * If true, will increase the height of the textbox if need be. If false,
     * the textbox will become scrollable once the height is reached. The
     * default value is false.
     * @platform android
     */
    // autoGrow: PropTypes.bool,
    /**
     * If `false`, text is not editable. The default value is `true`.
     */
    editable: PropTypes.bool,
    /**
     * Determines which keyboard to open, e.g.`numeric`.
     *
     * The following values work across platforms:
     *
     * - `default`
     * - `numeric`
     * - `email-address`
     * - `phone-pad`
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
    // keyboardAppearance: PropTypes.oneOf([
    //   'default',
    //   'light',
    //   'dark',
    // ]),
    /**
     * Determines how the return key should look. On Android you can also use
     * `returnKeyLabel`.
     *
     * *Cross platform*
     *
     * The following values work across platforms:
     *
     * - `done`
     * - `go`
     * - `next`
     * - `search`
     * - `send`
     *
     * *Android Only*
     *
     * The following values work on Android only:
     *
     * - `none`
     * - `previous`
     *
     * *iOS Only*
     *
     * The following values work on iOS only:
     *
     * - `default`
     * - `emergency-call`
     * - `google`
     * - `join`
     * - `route`
     * - `yahoo`
     */
    returnKeyType: PropTypes.oneOf([
      // Cross-platform
      'done',
      'go',
      'next',
      'search',
      'send',
      // Android-only
      'none',
      'previous',
      // iOS-only
      'default',
      'emergency-call',
      'google',
      'join',
      'route',
      'yahoo',
    ]),
    /**
     * Sets the return key to the label. Use it instead of `returnKeyType`.
     * @platform android
     */
    // returnKeyLabel: PropTypes.string,
    /**
     * Limits the maximum number of characters that can be entered. Use this
     * instead of implementing the logic in JS to avoid flicker.
     */
    maxLength: PropTypes.number,
    /**
     * If autogrow is `true`, limits the height that the TextInput box can grow
     * to. Once it reaches this height, the TextInput becomes scrollable.
     */
    maxHeight: PropTypes.number,
    /**
     * Sets the number of lines for a `TextInput`. Use it with multiline set to
     * `true` to be able to fill the lines.
     * @platform android
     */
    numberOfLines: PropTypes.number,
    /**
     * When `false`, if there is a small amount of space available around a text input
     * (e.g. landscape orientation on a phone), the OS may choose to have the user edit
     * the text inside of a full screen text input mode. When `true`, this feature is
     * disabled and users will always edit the text directly inside of the text input.
     * Defaults to `false`.
     * @platform android
     */
    // disableFullscreenUI: PropTypes.bool,
    /**
     * If `true`, the keyboard disables the return key when there is no text and
     * automatically enables it when there is text. The default value is `false`.
     * @platform ios
     */
    // enablesReturnKeyAutomatically: PropTypes.bool,
    /**
     * If `true`, the text input can be multiple lines.
     * The default value is `false`.
     */
    multiline: PropTypes.bool,
    /**
     * Set text break strategy on Android API Level 23+, possible values are `simple`, `highQuality`, `balanced`
     * The default value is `simple`.
     * @platform android
     */
    // textBreakStrategy: PropTypes.oneOf(['simple', 'highQuality', 'balanced']),
    /**
     * Callback that is called when the text input is blurred.
     */
    onBlur: PropTypes.func,
    /**
     * Callback that is called when the text input is focused.
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
     * Callback that is called when the text input's content size changes.
     * This will be called with
     * `{ nativeEvent: { contentSize: { width, height } } }`.
     *
     * Only called for multiline text inputs.
     */
    onContentSizeChange: PropTypes.func,
    /**
     * Callback that is called when text input ends.
     */
    onEndEditing: PropTypes.func,
    /**
     * Callback that is called when the text input selection is changed.
     * This will be called with
     * `{ nativeEvent: { selection: { start, end } } }`.
     */
    onSelectionChange: PropTypes.func,
    /**
     * Callback that is called when the text input's submit button is pressed.
     * Invalid if `multiline={true}` is specified.
     */
    onSubmitEditing: PropTypes.func,
    /**
     * Callback that is called when a key is pressed.
     * This will be called with `{ nativeEvent: { key: keyValue } }`
     * where `keyValue` is `'Enter'` or `'Backspace'` for respective keys and
     * the typed-in character otherwise including `' '` for space.
     * Fires before `onChange` callbacks.
     * @platform ios
     */
    onKeyPress: PropTypes.func,
    /**
     * Invoked on mount and layout changes with `{x, y, width, height}`.
     */
    onLayout: PropTypes.func,
    /**
     * Invoked on content scroll with `{ nativeEvent: { contentOffset: { x, y } } }`.
     * May also contain other properties from ScrollEvent but on Android contentSize
     * is not provided for performance reasons.
     */
    onScroll: PropTypes.func,
    /**
     * The string that will be rendered before text input has been entered.
     */
    placeholder: PropTypes.node,
    /**
     * The text color of the placeholder string.
     */
    placeholderTextColor: ColorPropType, // RW TODO
    /**
     * If `true`, the text input obscures the text entered so that sensitive text
     * like passwords stay secure. The default value is `false`.
     */
    secureTextEntry: PropTypes.bool,
    /**
    * The highlight and cursor color of the text input.
    */
    selectionColor: ColorPropType,
    /**
     * An instance of `DocumentSelectionState`, this is some state that is responsible for
     * maintaining selection information for a document.
     *
     * Some functionality that can be performed with this instance is:
     *
     * - `blur()`
     * - `focus()`
     * - `update()`
     *
     * > You can reference `DocumentSelectionState` in
     * > [`vendor/document/selection/DocumentSelectionState.js`](https://github.com/facebook/react-native/blob/master/Libraries/vendor/document/selection/DocumentSelectionState.js)
     *
     * @platform ios
     */
    // selectionState: PropTypes.instanceOf(DocumentSelectionState),
    /**
     * The start and end of the text input's selection. Set start and end to
     * the same value to position the cursor.
     * RW TODO
     */
    selection: PropTypes.shape({
      start: PropTypes.number.isRequired,
      end: PropTypes.number,
    }),
    /**
     * The value to show for the text input. `TextInput` is a controlled
     * component, which means the native value will be forced to match this
     * value prop if provided. For most uses, this works great, but in some
     * cases this may cause flickering - one common cause is preventing edits
     * by keeping value the same. In addition to simply setting the same value,
     * either set `editable={false}`, or set/update `maxLength` to prevent
     * unwanted edits without flicker.
     */
    value: PropTypes.string,
    /**
     * Provides an initial value that will change when the user starts typing.
     * Useful for simple use-cases where you do not want to deal with listening
     * to events and updating the value prop to keep the controlled state in sync.
     */
    defaultValue: PropTypes.string,
    /**
     * When the clear button should appear on the right side of the text view.
     * @platform ios
     */
    // clearButtonMode: PropTypes.oneOf([
    //   'never',
    //   'while-editing',
    //   'unless-editing',
    //   'always',
    // ]),
    /**
     * If `true`, clears the text field automatically when editing begins.
     * @platform ios
     */
    clearTextOnFocus: PropTypes.bool,
    /**
     * If `true`, all text will automatically be selected on focus.
     */
    selectTextOnFocus: PropTypes.bool,
    /**
     * If `true`, the text field will blur when submitted.
     * The default value is true for single-line fields and false for
     * multiline fields. Note that for multiline fields, setting `blurOnSubmit`
     * to `true` means that pressing return will blur the field and trigger the
     * `onSubmitEditing` event instead of inserting a newline into the field.
     */
    blurOnSubmit: PropTypes.bool,
    /**
     * Note that not all Text styles are supported,
     * see [Issue#7070](https://github.com/facebook/react-native/issues/7070)
     * for more detail.
     *
     * [Styles](docs/style.html)
     */
    style: Text.propTypes.style,
    /**
     * The color of the `TextInput` underline.
     * @platform android
     */
    // underlineColorAndroid: ColorPropType,

    /**
     * If defined, the provided image resource will be rendered on the left.
     * The image resource must be inside `/android/app/src/main/res/drawable` and referenced
     * like
     * ```
     * <TextInput
     *  inlineImageLeft='search_icon'
     * />
     * ```
     * @platform android
     */
    // inlineImageLeft: PropTypes.string,

    /**
     * Padding between the inline image, if any, and the text input itself.
     * @platform android
     */
    // inlineImagePadding: PropTypes.number,

    /**
     * Determines the types of data converted to clickable URLs in the text input.
     * Only valid if `multiline={true}` and `editable={false}`.
     * By default no data types are detected.
     *
     * You can provide one type or an array of many types.
     *
     * Possible values for `dataDetectorTypes` are:
     *
     * - `'phoneNumber'`
     * - `'link'`
     * - `'address'`
     * - `'calendarEvent'`
     * - `'none'`
     * - `'all'`
     *
     * @platform ios
     */
    // dataDetectorTypes: PropTypes.oneOfType([
    //   PropTypes.oneOf(DataDetectorTypes),
    //   PropTypes.arrayOf(PropTypes.oneOf(DataDetectorTypes)),
    // ]),
    /**
     * If `true`, caret is hidden. The default value is `false`.
     */
    caretHidden: PropTypes.bool,
  },

  /**
   * `NativeMethodsMixin` will look for this when invoking `setNativeProps`. We
   * make `this` look like an actual native component class.
   */
  mixins: [NativeMethodsMixin],

  // getInitialState: function() {
  //   return {layoutHeight: this._layoutHeight};
  // },

  /**
   * Returns `true` if the input is currently focused; `false` otherwise.
   */
  isFocused: function(): boolean {
    return TextInputState.currentlyFocusedField() === this._inputRef;
  },

  // contextTypes: {
  //   onFocusRequested: PropTypes.func,
  //   focusEmitter: PropTypes.instanceOf(EventEmitter),
  // },

  // _inputRef: (undefined: any),
  // _focusSubscription: (undefined: ?Function),
  // _lastNativeText: (undefined: ?string),
  // _lastNativeSelection: (undefined: ?Selection),
  // _layoutHeight: (-1: number),

  componentDidMount: function() {
    //TODO RW
    if (this.props.autoFocus) {
      this._inputRef.focus();
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
    isInAParentText: PropTypes.bool
  },

  /**
   * Removes all text from the `TextInput`.
   */
  clear: function() {
    if (this._inputRef) {
      this._inputRef.value = '';
    }
  },

  render: function() {
    const {
      autoCorrect,
      // editable,
      keyboardType,
      multiline,
      numberOfLines,
      secureTextEntry,
      // style,
      /* eslint-disable */
      blurOnSubmit,
      clearTextOnFocus,
      // onChangeText,
      // onSelectionChange,
      onSubmitEditing,
      selection,
      selectTextOnFocus,
      /* react-native compat */
      caretHidden,
      clearButtonMode,
      dataDetectorTypes,
      disableFullscreenUI,
      enablesReturnKeyAutomatically,
      inlineImageLeft,
      inlineImagePadding,
      keyboardAppearance,
      onContentSizeChange,
      onEndEditing,
      onScroll,
      placeholderTextColor,
      returnKeyLabel,
      returnKeyType,
      selectionColor,
      selectionState,
      spellCheck,
      textBreakStrategy,
      underlineColorAndroid,
      /* eslint-enable */
      ...otherProps
    } = this.props;

    let type;

    switch (keyboardType) {
      case 'email-address':
        type = 'email';
        break;
      case 'number-pad':
      case 'numeric':
        type = 'number';
        break;
      case 'phone-pad':
        type = 'tel';
        break;
      case 'search':
      case 'web-search':
        type = 'search';
        break;
      case 'url':
        type = 'url';
        break;
      default:
        type = 'text';
    }

    if (secureTextEntry) {
      type = 'password';
    }

    Object.assign(otherProps, {
      className: CSSClassNames.TEXT_INPUT,
      ref: this._setNativeRef,
      autoCorrect: autoCorrect ? 'on' : 'off',
      dir: 'auto',
      onBlur: otherProps.onBlur && this._onBlur,
      onChange: (otherProps.onChange || otherProps.onChangeText) && this._onChange,
      onFocus: this._onFocus,
      onKeyDown: this._onKeyDown,
      onKeyPress: this._onKeyPress,
      onSelect: otherProps.onSelectionChange && this._onSelectionChange,
      readOnly: otherProps.editable === false,
    });

    if (multiline) {
      otherProps.rows = numberOfLines;
      return createWebCoreElement('textarea', otherProps);
    } else {
      otherProps.type = type;
      return createWebCoreElement('input', otherProps);
    }
  },

  _setNativeRef: function(ref) {
    this._inputRef = ref;
  },

  _onBlur: function(event: Event) {
    if (this.props.onBlur) {
      event.nativeEvent.text = event.target.value;
      this.props.onBlur(event);
    }
  },

  _onChange: function(event: Event) {
    if (this.props.onChange) {
      event.nativeEvent.text = event.target.value;
      this.props.onChange(event);
    }
    if (this.props.onChangeText) this.props.onChangeText(event.target.value);
  },

  _onFocus: function(event: Event) {
    const { clearTextOnFocus, onFocus, selectTextOnFocus } = this.props;
    if (onFocus) {
      event.nativeEvent.text = event.target.value;
      onFocus(event);
    }
    const node = this._inputRef;
    if (clearTextOnFocus) this.clear();
    if (selectTextOnFocus) node && node.select();
  },

  _onKeyDown: function(e) {
    // prevent key events bubbling (see #612)
    e.stopPropagation();

    // Backspace, Tab, and Cmd+Enter only fire 'keydown' DOM events
    if (e.which === 8 || e.which === 9 || (e.which === 13 && e.metaKey)) {
      this._onKeyPress(e);
    }
  },

  _onKeyPress: function(e) {
    const { blurOnSubmit, multiline, onKeyPress, onSubmitEditing } = this.props;
    const blurOnSubmitDefault = !multiline;
    const shouldBlurOnSubmit = blurOnSubmit == null ? blurOnSubmitDefault : blurOnSubmit;

    if (onKeyPress) {
      let keyValue;
      switch (e.which) {
        // backspace
        case 8:
          keyValue = 'Backspace';
          break;
        // tab
        case 9:
          keyValue = 'Tab';
          break;
        // enter
        case 13:
          keyValue = 'Enter';
          break;
        // spacebar
        case 32:
          keyValue = ' ';
          break;
        default: {
          // we trim to only care about the keys that has a textual representation
          if (e.shiftKey) {
            keyValue = String.fromCharCode(e.which).trim();
          } else {
            keyValue = String.fromCharCode(e.which)
              .toLowerCase()
              .trim();
          }
        }
      }

      if (keyValue) {
        e.nativeEvent = {
          altKey: e.altKey,
          ctrlKey: e.ctrlKey,
          key: keyValue,
          metaKey: e.metaKey,
          shiftKey: e.shiftKey,
          target: e.target
        };
        onKeyPress(e);
      }
    }

    if (!e.isDefaultPrevented() && e.which === 13 && !e.shiftKey) {
      if ((blurOnSubmit || !multiline) && onSubmitEditing) {
        e.nativeEvent = { target: e.target, text: e.target.value };
        onSubmitEditing(e);
      }
      if (shouldBlurOnSubmit) {
        this.blur();
      }
    }
  },

  _onSelectionChange: function(e) {
    const { onSelectionChange, selection = emptyObject } = this.props;
    if (onSelectionChange) {
      try {
        const node = e.target;
        if (isSelectionStale(node, selection)) {
          const { selectionStart, selectionEnd } = node;
          e.nativeEvent.selection = {
            start: selectionStart,
            end: selectionEnd
          };
          onSelectionChange(e);
        }
      } catch (e) {}
    }
  },
});

// const styles = StyleSheet.create({
// });

module.exports = TextInput;
