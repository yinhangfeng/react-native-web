/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @noflow - get/set properties not yet supported by flow. also `...require(x)` is broken #6560135
 */
'use strict';

//var warning = require('fbjs/lib/warning');

// if (__DEV__) {
//   var warningDedupe = {};
//   var addonWarn = function addonWarn(prevName, newPackageName) {
//     warning(
//       warningDedupe[prevName],
//       'React.addons.' + prevName + ' is deprecated. Please import the "' +
//       newPackageName + '" package instead.'
//     );
//     warningDedupe[prevName] = true;
//   };
// }

// Export React, plus some native additions.
var ReactNative = {
  // react web 扩展
  get createWebCoreElement() { return require('createWebCoreElement'); },
  get CSSClassNames() { return require('CSSClassNames'); },
  get RWServerUrl() { return require('RWServerUrl'); },
  get RWConfig() { return require('RWConfig'); },
  get RWBodyScrollHelper() { return require('RWBodyScrollHelper'); },
  get RWPerformance() { return require('RWPerformance'); },

  // Components
  get ActivityIndicator() { return require('ActivityIndicator'); },
  // get ART() { return require('ReactNativeART'); },
  // get DatePickerIOS() { return require('DatePickerIOS'); },
  // get DrawerLayoutAndroid() { return require('DrawerLayoutAndroid'); },
  Image: require('Image'),
  // get ImageEditor() { return require('ImageEditor'); },
  // get ImageStore() { return require('ImageStore'); },
  get ListView() { return require('ListView'); },
  // get MapView() { return require('MapView'); },
  // get Modal() { return require('Modal'); },
  // get Navigator() { return require('HistoryNavigator'); },
  // get NavigatorIOS() { return require('NavigatorIOS'); },
  get Picker() { return require('Picker'); },
  // get PickerIOS() { return require('PickerIOS'); },
  // get ProgressBarAndroid() { return require('ProgressBarAndroid'); },
  // get ProgressViewIOS() { return require('ProgressViewIOS'); },
  get ScrollView() { return require('ScrollView'); },
  // get SegmentedControlIOS() { return require('SegmentedControlIOS'); },
  ////get Slider() { return require('Slider'); },
  // get SliderIOS() { return require('SliderIOS'); },
  // get SnapshotViewIOS() { return require('SnapshotViewIOS'); },
  get Switch() { return require('Switch'); },
  // get PullToRefreshViewAndroid() { return require('PullToRefreshViewAndroid'); },
  get RecyclerViewBackedScrollView() { return require('RecyclerViewBackedScrollView'); },
  get RefreshControl() { return require('RefreshControl'); },
  // get StatusBar() { return require('StatusBar'); },
  // get SwitchAndroid() { return require('SwitchAndroid'); },
  // get SwitchIOS() { return require('SwitchIOS'); },
  // get TabBarIOS() { return require('TabBarIOS'); },
  Text: require('Text'),
  get TextInput() { return require('TextInput'); },
  // get ToastAndroid() { return require('ToastAndroid'); },
  // get ToolbarAndroid() { return require('ToolbarAndroid'); },
  get Touchable() { return require('Touchable'); },
  get TouchableHighlight() { return require('TouchableHighlight'); },
  //get TouchableNativeFeedback() { return require('TouchableNativeFeedback'); },
  get TouchableOpacity() { return require('TouchableOpacity'); },
  get TouchableWithoutFeedback() { return require('TouchableWithoutFeedback'); },
  View: require('View'),
  // get ViewPagerAndroid() { return require('ViewPagerAndroid'); },
  // get WebView() { return require('WebView'); },

  // APIs
  // get ActionSheetIOS() { return require('ActionSheetIOS'); },
  // get AdSupportIOS() { return require('AdSupportIOS'); },
  get Alert() { return require('Alert'); },
  // get AlertIOS() { return require('AlertIOS'); },
  get Animated() { return require('Animated'); },
  get AppRegistry() { return require('AppRegistry'); },
  get AppState() { return require('AppState'); },
  // get AppStateIOS() { return require('AppStateIOS'); },
  get AsyncStorage() { return require('AsyncStorage'); },
  // get BackAndroid() { return require('BackAndroid'); },
  // get CameraRoll() { return require('CameraRoll'); },
  // get Clipboard() { return require('Clipboard'); },
  // get DatePickerAndroid() { return require('DatePickerAndroid'); },
  get Dimensions() { return require('Dimensions'); },
  get Easing() { return require('Easing'); },
  // get ImagePickerIOS() { return require('ImagePickerIOS'); },
  // get IntentAndroid() { return require('IntentAndroid'); },
  get InteractionManager() { return require('InteractionManager'); },
  // get LayoutAnimation() { return require('LayoutAnimation'); },
  get Linking() { return require('Linking'); },
  // get LinkingIOS() { return require('LinkingIOS'); },
  // get NavigationExperimental() { return require('NavigationExperimental'); },
  // get NetInfo() { return require('NetInfo'); },
  get PanResponder() { return require('PanResponder'); },
  get PixelRatio() { return require('PixelRatio'); },
  // get PushNotificationIOS() { return require('PushNotificationIOS'); },
  // get Settings() { return require('Settings'); },
  // get StatusBarIOS() { return require('StatusBarIOS'); },
  StyleSheet: require('StyleSheet'),
  // get TimePickerAndroid() { return require('TimePickerAndroid'); },
  get UIManager() { return require('UIManager'); },
  // get Vibration() { return require('Vibration'); },
  // get VibrationIOS() { return require('VibrationIOS'); },

  // Plugins
  // get DeviceEventEmitter() { return require('RCTDeviceEventEmitter'); },
  // get NativeAppEventEmitter() { return require('RCTNativeAppEventEmitter'); },
  get NativeModules() { return require('NativeModules'); },
  get Platform() { return require('Platform'); },
  get processColor() { return require('processColor'); },
  //get requireNativeComponent() { return require('requireNativeComponent'); },

  // Prop Types
  get ColorPropType() { return require('ColorPropType'); },
  get EdgeInsetsPropType() { return require('EdgeInsetsPropType'); },
  get PointPropType() { return require('PointPropType'); },
};

// Preserve getters with warnings on the internal ReactNative copy without
// invoking them.
const ReactNativeInternal = require('ReactNative');
function applyForwarding(key) {
  if (__DEV__) {
    Object.defineProperty(
      ReactNative,
      key,
      Object.getOwnPropertyDescriptor(ReactNativeInternal, key)
    );
    return;
  }
  ReactNative[key] = ReactNativeInternal[key];
}
for (const key in ReactNativeInternal) {
  applyForwarding(key);
}

module.exports = ReactNative;
