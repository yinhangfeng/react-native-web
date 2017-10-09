/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule react-native-implementation
 * @flow
 */
'use strict';

const {
  findNodeHandle,
} = require('ReactNative');

// Export React, plus some native additions.
const ReactNative = {
  // react web 扩展
  createWebCoreElement: require('createWebCoreElement'),
  CSSClassNames: require('CSSClassNames'),
  get RWServerUrl() { return require('RWServerUrl'); },
  get RWConfig() { return require('RWConfig'); },
  get RWBodyScrollHelper() { return require('RWBodyScrollHelper'); },
  get RWPerformance() { return require('RWPerformance'); },

  // Components
  ActivityIndicator: require('ActivityIndicator'),
  // get ART() { return require('ReactNativeART'); },
  // get DatePickerIOS() { return require('DatePickerIOS'); },
  // get DrawerLayoutAndroid() { return require('DrawerLayoutAndroid'); },
  Image: require('Image'),
  ImageBackground: require('ImageBackground'),
  // get ImageEditor() { return require('ImageEditor'); },
  // get ImageStore() { return require('ImageStore'); },
  ListView: require('ListView'),
  // get MapView() { return require('MapView'); },
  // get Modal() { return require('Modal'); },
  // get Navigator() { return require('HistoryNavigator'); },
  // get NavigatorIOS() { return require('NavigatorIOS'); },
  get Picker() { return require('Picker'); },
  // get PickerIOS() { return require('PickerIOS'); },
  // get ProgressBarAndroid() { return require('ProgressBarAndroid'); },
  // get ProgressViewIOS() { return require('ProgressViewIOS'); },
  ScrollView: require('ScrollView'),
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
  // get WebView() { return require('WebView'); },

  // APIs
  // get ActionSheetIOS() { return require('ActionSheetIOS'); },
  // get AdSupportIOS() { return require('AdSupportIOS'); },
  get Alert() { return require('Alert'); },
  // get AlertIOS() { return require('AlertIOS'); },
  get Animated() { return require('Animated'); },
  AppRegistry: require('AppRegistry'),
  get AppState() { return require('AppState'); },
  // get AppStateIOS() { return require('AppStateIOS'); },
  get AsyncStorage() { return require('AsyncStorage'); },
  // get BackAndroid() { return require('BackAndroid'); },
  // get CameraRoll() { return require('CameraRoll'); },
  // get Clipboard() { return require('Clipboard'); },
  // get DatePickerAndroid() { return require('DatePickerAndroid'); },
  get Dimensions() { return require('Dimensions'); },
  get Easing() { return require('Easing'); },
  findNodeHandle,
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
  UIManager: require('UIManager'),
  // get Vibration() { return require('Vibration'); },
  // get VibrationIOS() { return require('VibrationIOS'); },

  // Plugins
  // get DeviceEventEmitter() { return require('RCTDeviceEventEmitter'); },
  // get NativeAppEventEmitter() { return require('RCTNativeAppEventEmitter'); },
  get NativeModules() { return require('NativeModules'); },
  Platform: require('Platform'),
  get processColor() { return require('processColor'); },
  //get requireNativeComponent() { return require('requireNativeComponent'); },

  // Prop Types
  get ColorPropType() { return require('ColorPropType'); },
  get EdgeInsetsPropType() { return require('EdgeInsetsPropType'); },
  get PointPropType() { return require('PointPropType'); },
  get ViewPropTypes() { return require('ViewPropTypes'); },
};

module.exports = ReactNative;
