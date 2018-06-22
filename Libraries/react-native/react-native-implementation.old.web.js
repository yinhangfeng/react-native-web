/**
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

const ReactNativeInternal = require('react-native/Libraries/Renderer/shims/ReactNative');

// Export React, plus some native additions.
const ReactNative = {
  // react web 扩展
  createWebCoreElement: require('react-native/Libraries/lrnw/createWebCoreElement'),
  CSSClassNames: require('react-native/Libraries/StyleSheet/CSSClassNames'),
  get RWServerUrl() { return require('react-native/Libraries/lrnw/RWServerUrl'); },
  get RWConfig() { return require('react-native/Libraries/lrnw/RWConfig'); },
  // get RWBodyScrollHelper() { return require('RWBodyScrollHelper'); },
  get RWPerformance() { return require('react-native/Libraries/lrnw/RWPerformance'); },

  // Components
  // get AccessibilityInfo() { return require('AccessibilityInfo'); },
  ActivityIndicator: require('react-native/Libraries/Components/ActivityIndicator/ActivityIndicator'),
  // get ART() { return require('react-native/Libraries/ART/ReactNativeART'); },
  get Button() { return require('react-native/Libraries/Components/Button'); },
  // get CheckBox() { return require('CheckBox'); },
  // get DatePickerIOS() { return require('DatePickerIOS'); },
  // get DrawerLayoutAndroid() { return require('DrawerLayoutAndroid'); },
  get FlatList() { return require('react-native/Libraries/Lists/FlatList'); },
  Image: require('react-native/Libraries/Image/Image'),
  ImageBackground: require('react-native/Libraries/Image/ImageBackground'),
  // get ImageEditor() { return require('react-native/Libraries/Image/ImageEditor'); },
  // get ImageStore() { return require('react-native/Libraries/Image/ImageStore'); },
  // get KeyboardAvoidingView() { return require('react-native/Libraries/Components/Keyboard/KeyboardAvoidingView'); },
  ListView: require('react-native/Libraries/Lists/ListView/ListView'),
  // get MaskedViewIOS() { return require('MaskedViewIOS'); },
  // get Modal() { return require('react-native/Libraries/Modal/Modal'); },
  // get NavigatorIOS() { return require('NavigatorIOS'); },
  get Picker() { return require('react-native/Libraries/Components/Picker/Picker'); },
  // get PickerIOS() { return require('PickerIOS'); },
  // get ProgressBarAndroid() { return require('ProgressBarAndroid'); },
  // get ProgressViewIOS() { return require('ProgressViewIOS'); },
  // get SafeAreaView() { return require('SafeAreaView'); },
  ScrollView: require('react-native/Libraries/Components/ScrollView/ScrollView'),
  // get SectionList() { return require('react-native/Libraries/Lists/SectionList'); },
  // get SegmentedControlIOS() { return require('SegmentedControlIOS'); },
  // get Slider() { return require('react-native/Libraries/Components/Slider/Slider'); },
  // get SnapshotViewIOS() { return require('SnapshotViewIOS'); },
  get Switch() { return require('react-native/Libraries/Components/Switch/Switch'); },
  get RefreshControl() { return require('react-native/Libraries/Components/RefreshControl/RefreshControl'); },
  // get StatusBar() { return require('react-native/Libraries/Components/StatusBar/StatusBar'); },
  // get SwipeableFlatList() { return require('react-native/Libraries/Experimental/SwipeableRow/SwipeableFlatList'); },
  // get SwipeableListView() { return require('react-native/Libraries/Experimental/SwipeableRow/SwipeableListView'); },
  // get TabBarIOS() { return require('TabBarIOS'); },
  Text: require('react-native/Libraries/Text/Text'),
  TextInput: require('react-native/Libraries/Components/TextInput/TextInput'),
  // get ToastAndroid() { return require('ToastAndroid'); },
  // get ToolbarAndroid() { return require('ToolbarAndroid'); },
  get Touchable() { return require('react-native/Libraries/Components/Touchable/Touchable'); },
  get TouchableHighlight() { return require('react-native/Libraries/Components/Touchable/TouchableHighlight'); },
  //get TouchableNativeFeedback() { return require('TouchableNativeFeedback'); },
  get TouchableOpacity() { return require('react-native/Libraries/Components/Touchable/TouchableOpacity'); },
  get TouchableWithoutFeedback() { return require('react-native/Libraries/Components/Touchable/TouchableWithoutFeedback'); },
  View: require('react-native/Libraries/Components/View/View'),
  // get ViewPagerAndroid() { return require('ViewPagerAndroid'); },
  // get VirtualizedList() { return require('react-native/Libraries/Lists/VirtualizedList'); },
  // get WebView() { return require('WebView'); },

  // APIs
  // get ActionSheetIOS() { return require('react-native/Libraries/ActionSheetIOS/ActionSheetIOS'); },
  // get AdSupportIOS() { return require('AdSupportIOS'); },
  get Alert() { return require('react-native/Libraries/Alert/Alert'); },
  // get AlertIOS() { return require('react-native/Libraries/Alert/AlertIOS'); },
  get Animated() { return require('react-native/Libraries/Animated/src/Animated'); },
  AppRegistry: require('react-native/Libraries/ReactNative/AppRegistry'),
  get AppState() { return require('react-native/Libraries/AppState/AppState'); },
  get AsyncStorage() { return require('react-native/Libraries/Storage/AsyncStorage'); },
  // get BackAndroid() { return require('react-native/Libraries/Utilities/BackAndroid'); },
  get BackHandler() { return require('react-native/Libraries/Utilities/BackHandler'); },
  // get CameraRoll() { return require('react-native/Libraries/CameraRoll/CameraRoll'); },
  // get Clipboard() { return require('react-native/Libraries/Components/Clipboard/Clipboard'); },
  // get DatePickerAndroid() { return require('DatePickerAndroid'); },
  get Dimensions() { return require('react-native/Libraries/Utilities/Dimensions'); },
  get Easing() { return require('react-native/Libraries/Animated/src/Easing'); },
  findNodeHandle: ReactNativeInternal.findNodeHandle,
  // get I18nManager() { return require('react-native/Libraries/ReactNative/I18nManager'); },
  // get ImagePickerIOS() { return require('react-native/Libraries/CameraRoll/ImagePickerIOS'); },
  get InteractionManager() { return require('react-native/Libraries/Interaction/InteractionManager'); },
  // get LayoutAnimation() { return require('react-native/Libraries/LayoutAnimation/LayoutAnimation'); },
  get Linking() { return require('react-native/Libraries/Linking/Linking'); },
  // get NativeEventEmitter() { return require('react-native/Libraries/EventEmitter/NativeEventEmitter'); },
  // get NetInfo() { return require('react-native/Libraries/Network/NetInfo'); },
  get PanResponder() { return require('react-native/Libraries/Interaction/PanResponder'); },
  // get PermissionsAndroid() { return require('react-native/Libraries/PermissionsAndroid/PermissionsAndroid'); },
  get PixelRatio() { return require('react-native/Libraries/Utilities/PixelRatio'); },
  // get PushNotificationIOS() { return require('react-native/Libraries/PushNotificationIOS/PushNotificationIOS'); },
  // get Settings() { return require('Settings'); },
  // get Share() { return require('react-native/Libraries/Share/Share'); },
  // get StatusBarIOS() { return require('StatusBarIOS'); },
  StyleSheet: require('react-native/Libraries/StyleSheet/StyleSheet'),
  // get Systrace() { return require('react-native/Libraries/Performance/Systrace'); },
  // get TimePickerAndroid() { return require('TimePickerAndroid'); },
  // get TVEventHandler() { return require('react-native/Libraries/Components/AppleTV/TVEventHandler'); },
  UIManager: require('react-native/Libraries/ReactNative/UIManager'),
  get unstable_batchedUpdates() { return require('react-native/Libraries/Renderer/shims/ReactNative').unstable_batchedUpdates; },
  // get Vibration() { return require('react-native/Libraries/Vibration/Vibration'); },
  // get VibrationIOS() { return require('VibrationIOS'); },

  // Plugins
  // get DeviceEventEmitter() { return require('react-native/Libraries/EventEmitter/RCTDeviceEventEmitter'); },
  // get NativeAppEventEmitter() { return require('react-native/Libraries/EventEmitter/RCTNativeAppEventEmitter'); },
  get NativeModules() { return require('react-native/Libraries/BatchedBridge/NativeModules'); },
  Platform: require('react-native/Libraries/Utilities/Platform'),
  get processColor() { return require('react-native/Libraries/StyleSheet/processColor'); },
  // get requireNativeComponent() { return require('react-native/Libraries/ReactNative/requireNativeComponent'); },
  // get takeSnapshot() { return require('react-native/Libraries/ReactNative/takeSnapshot'); },

  // Prop Types
  get ColorPropType() { return require('react-native/Libraries/StyleSheet/ColorPropType'); },
  get EdgeInsetsPropType() { return require('react-native/Libraries/StyleSheet/EdgeInsetsPropType'); },
  get PointPropType() { return require('react-native/Libraries/StyleSheet/PointPropType'); },
  get ViewPropTypes() { return require('react-native/Libraries/Components/View/ViewPropTypes'); },
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
