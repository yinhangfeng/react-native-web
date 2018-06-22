/**
 * RW SYNC react-native: 0.49
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

var ColorPropType = require('react-native/Libraries/StyleSheet/ColorPropType');
// var PickerIOS = require('PickerIOS');
// var PickerAndroid = require('PickerAndroid');
// var Platform = require('react-native/Libraries/Utilities/Platform');
var React = require('react-native/Libraries/react-native/React');
const PropTypes = require('prop-types');
var StyleSheetPropType = require('react-native/Libraries/StyleSheet/StyleSheetPropType');
var TextStylePropTypes = require('react-native/Libraries/Text/TextStylePropTypes');
// var UnimplementedView = require('react-native/Libraries/Components/UnimplementedViews/UnimplementedView');
const ViewPropTypes = require('react-native/Libraries/Components/View/ViewPropTypes');
var ViewStylePropTypes = require('react-native/Libraries/Components/View/ViewStylePropTypes');

var itemStylePropType = StyleSheetPropType(TextStylePropTypes);

var View = require('react-native/Libraries/Components/View/View');
var StyleSheet = require('react-native/Libraries/StyleSheet/StyleSheet');

var pickerStyleType = StyleSheetPropType({
  ...ViewStylePropTypes,
  color: ColorPropType,
});

const createWebCoreElement = require('react-native/Libraries/lrnw/createWebCoreElement');
const CSSClassNames = require('react-native/Libraries/StyleSheet/CSSClassNames');

var MODE_DIALOG = 'dialog';
var MODE_DROPDOWN = 'dropdown';
const PICKER = 'picker';

/**
 * Individual selectable item in a Picker.
 */
class PickerItem extends React.Component<{
 label: string,
 value?: any,
 color?: ColorPropType,
 testID?: string,
}> {
 static propTypes = {
   /**
    * Text to display for this item.
    */
   label: PropTypes.string.isRequired,
   /**
    * The value to be passed to picker's `onValueChange` callback when
    * this item is selected. Can be a string or an integer.
    */
   value: PropTypes.any,
   /**
    * Color of this item's text.
    * @platform android
    */
   color: ColorPropType,
   /**
    * Used to locate the item in end-to-end tests.
    */
   testID: PropTypes.string,
 };

 render() {
   return <option value={this.props.value}>{this.props.label}</option>;
 }
}

/**
 * Renders the native picker component on iOS and Android. Example:
 *
 *     <Picker
 *       selectedValue={this.state.language}
 *       onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}>
 *       <Picker.Item label="Java" value="java" />
 *       <Picker.Item label="JavaScript" value="js" />
 *     </Picker>
 */
class Picker extends React.Component<{
 style?: $FlowFixMe,
 selectedValue?: any,
 onValueChange?: Function,
 enabled?: boolean,
 mode?: 'dialog' | 'dropdown',
 itemStyle?: $FlowFixMe,
 prompt?: string,
 testID?: string,
}> {
  /**
  * On Android, display the options in a dialog.
  */
  static MODE_DIALOG = MODE_DIALOG;

  /**
  * On Android, display the options in a dropdown (this is the default).
  */
  static MODE_DROPDOWN = MODE_DROPDOWN;

  static Item = PickerItem;

  static defaultProps = {
    mode: MODE_DIALOG,
  };

  // $FlowFixMe(>=0.41.0)
  static propTypes = {
    ...ViewPropTypes,
    style: pickerStyleType,
    /**
    * Value matching value of one of the items. Can be a string or an integer.
    */
    selectedValue: PropTypes.any,
    /**
    * Callback for when an item is selected. This is called with the following parameters:
    *   - `itemValue`: the `value` prop of the item that was selected
    *   - `itemPosition`: the index of the selected item in this picker
    */
    onValueChange: PropTypes.func,
    /**
    * If set to false, the picker will be disabled, i.e. the user will not be able to make a
    * selection.
    * @platform android
    */
    enabled: PropTypes.bool,
    /**
    * On Android, specifies how to display the selection items when the user taps on the picker:
    *
    *   - 'dialog': Show a modal dialog. This is the default.
    *   - 'dropdown': Shows a dropdown anchored to the picker view
    *
    * @platform android
    */
    mode: PropTypes.oneOf(['dialog', 'dropdown']),
    /**
    * Style to apply to each of the item labels.
    * @platform ios
    */
    itemStyle: itemStylePropType,
    /**
    * Prompt string for this picker, used on Android in dialog mode as the title of the dialog.
    * @platform android
    */
    prompt: PropTypes.string,
    /**
    * Used to locate this view in end-to-end tests.
    */
    testID: PropTypes.string,
  };

  constructor() {
    super();
    this._onChange = this._onChange.bind(this);
  }

  _onChange(event) {
    // shim the native event
    const newValue = event.nativeEvent.newValue = this.refs[PICKER].value;

    if (this.props.onChange) {
      this.props.onChange(event);
    }

    if (this.props.onValueChange) {
      let newIndex = 0;
      React.Children.forEach(this.props.children, (child, index) => {
        if (child.props.value === newValue) {
          newIndex = index;
        }
      });
      this.props.onValueChange(newValue, newIndex);
    }
  }

  render() {
    return createWebCoreElement('select', {
      ref: PICKER,
      className: CSSClassNames.PICKER,
      value: this.props.selectedValue,
      style: this.props.style,
      onChange: this._onChange,
      children: this.props.children,
      disabled: this.props.enabled === false,
    });
  }
}

module.exports = Picker;
