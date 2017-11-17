/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule react-native-implementation.old
 * @flow
 */
'use strict';

const ReactNativeInternal = require('ReactNative');

// Export React, plus some native additions.
const ReactNative = {
  // react web 扩展
  createWebCoreElement: require('createWebCoreElement'),
  CSSClassNames: require('CSSClassNames'),
  get RWServerUrl() { return require('RWServerUrl'); },
  get RWConfig() { return require('RWConfig'); },
  // get RWBodyScrollHelper() { return require('RWBodyScrollHelper'); },
  get RWPerformance() { return require('RWPerformance'); },

  // Components
  // get AccessibilityInfo() { return require('AccessibilityInfo'); },
  ActivityIndicator: require('ActivityIndicator'),
  // get ART() { return require('ReactNativeART'); },
  get Button() { return require('Button'); },
  // get CheckBox() { return require('CheckBox'); },
  // get DatePickerIOS() { return require('DatePickerIOS'); },
  // get DrawerLayoutAndroid() { return require('DrawerLayoutAndroid'); },
  get FlatList() { return require('FlatList'); },
  Image: require('Image'),
  ImageBackground: require('ImageBackground'),
  // get ImageEditor() { return require('ImageEditor'); },
  // get ImageStore() { return require('ImageStore'); },
  // get KeyboardAvoidingView() { return require('KeyboardAvoidingView'); },
  ListView: require('ListView'),
  // get MaskedViewIOS() { return require('MaskedViewIOS'); },
  // get Modal() { return require('Modal'); },
  // get NavigatorIOS() { return require('NavigatorIOS'); },
  get Picker() { return require('Picker'); },
  // get PickerIOS() { return require('PickerIOS'); },
  // get ProgressBarAndroid() { return require('ProgressBarAndroid'); },
  // get ProgressViewIOS() { return require('ProgressViewIOS'); },
  // get SafeAreaView() { return require('SafeAreaView'); },
  ScrollView: require('ScrollView'),
  // get SectionList() { return require('SectionList'); },
  // get SegmentedControlIOS() { return require('SegmentedControlIOS'); },
  // get Slider() { return require('Slider'); },
  // get SnapshotViewIOS() { return require('SnapshotViewIOS'); },
  get Switch() { return require('Switch'); },
  get RefreshControl() { return require('RefreshControl'); },
  // get StatusBar() { return require('StatusBar'); },
  // get SwipeableFlatList() { return require('SwipeableFlatList'); },
  // get SwipeableListView() { return require('SwipeableListView'); },
  // get TabBarIOS() { return require('TabBarIOS'); },
  Text: require('Text'),
  TextInput: require('TextInput'),
  // get ToastAndroid() { return require('ToastAndroid'); },
  // get ToolbarAndroid() { return require('ToolbarAndroid'); },
  get Touchable() { return require('Touchable'); },
  get TouchableHighlight() { return require('TouchableHighlight'); },
  //get TouchableNativeFeedback() { return require('TouchableNativeFeedback'); },
  get TouchableOpacity() { return require('TouchableOpacity'); },
  get TouchableWithoutFeedback() { return require('TouchableWithoutFeedback'); },
  View: require('View'),
  // get ViewPagerAndroid() { return require('ViewPagerAndroid'); },
  // get VirtualizedList() { return require('VirtualizedList'); },
  // get WebView() { return require('WebView'); },

  // APIs
  // get ActionSheetIOS() { return require('ActionSheetIOS'); },
  // get AdSupportIOS() { return require('AdSupportIOS'); },
  get Alert() { return require('Alert'); },
  // get AlertIOS() { return require('AlertIOS'); },
  get Animated() { return require('Animated'); },
  AppRegistry: require('AppRegistry'),
  get AppState() { return require('AppState'); },
  get AsyncStorage() { return require('AsyncStorage'); },
  // get BackAndroid() { return require('BackAndroid'); },
  get BackHandler() { return require('BackHandler'); },
  // get CameraRoll() { return require('CameraRoll'); },
  // get Clipboard() { return require('Clipboard'); },
  // get DatePickerAndroid() { return require('DatePickerAndroid'); },
  get Dimensions() { return require('Dimensions'); },
  get Easing() { return require('Easing'); },
  findNodeHandle: ReactNativeInternal.findNodeHandle,
  // get I18nManager() { return require('I18nManager'); },
  // get ImagePickerIOS() { return require('ImagePickerIOS'); },
  get InteractionManager() { return require('InteractionManager'); },
  // get LayoutAnimation() { return require('LayoutAnimation'); },
  get Linking() { return require('Linking'); },
  // get NativeEventEmitter() { return require('NativeEventEmitter'); },
  // get NetInfo() { return require('NetInfo'); },
  get PanResponder() { return require('PanResponder'); },
  // get PermissionsAndroid() { return require('PermissionsAndroid'); },
  get PixelRatio() { return require('PixelRatio'); },
  // get PushNotificationIOS() { return require('PushNotificationIOS'); },
  // get Settings() { return require('Settings'); },
  // get Share() { return require('Share'); },
  // get StatusBarIOS() { return require('StatusBarIOS'); },
  StyleSheet: require('StyleSheet'),
  // get Systrace() { return require('Systrace'); },
  // get TimePickerAndroid() { return require('TimePickerAndroid'); },
  // get TVEventHandler() { return require('TVEventHandler'); },
  UIManager: require('UIManager'),
  get unstable_batchedUpdates() { return require('ReactNative').unstable_batchedUpdates; },
  // get Vibration() { return require('Vibration'); },
  // get VibrationIOS() { return require('VibrationIOS'); },

  // Plugins
  // get DeviceEventEmitter() { return require('RCTDeviceEventEmitter'); },
  // get NativeAppEventEmitter() { return require('RCTNativeAppEventEmitter'); },
  get NativeModules() { return require('NativeModules'); },
  Platform: require('Platform'),
  get processColor() { return require('processColor'); },
  // get requireNativeComponent() { return require('requireNativeComponent'); },
  // get takeSnapshot() { return require('takeSnapshot'); },

  // Prop Types
  get ColorPropType() { return require('ColorPropType'); },
  get EdgeInsetsPropType() { return require('EdgeInsetsPropType'); },
  get PointPropType() { return require('PointPropType'); },
  get ViewPropTypes() { return require('ViewPropTypes'); },
};

if (__DEV__) {
  ReactNative.disableReactWarnUnknownProperties = function disableReactWarnUnknownProperties() {
    if (console.lrnwOriError) {
      return;
    }
    const oriError = (console.lrnwOriError = console.error);
    console.error = function(message) {
      // warnUnknownProperties 不同react 版本 warning 不同
      if (typeof message === 'string'
        && (
          message.indexOf('For details, see https://fb.me/react-attribute-behavior') > 0
          || message.indexOf('Unknown event handler property ') > 0
          || message.indexOf('React does not recognize the ') > 0
          || message.indexOf(' non-boolean attribute ') > 0
        )
      ) {
        return;
      }
      oriError.apply(console, arguments);
    };
  };
}

module.exports = ReactNative;