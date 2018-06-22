/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

'use strict';

const invariant = require('fbjs/lib/invariant');

// Export React, plus some native additions.
const ReactNative = {
  // Components
  get AccessibilityInfo() {
    return require('AccessibilityInfo');
  },
  get ActivityIndicator() {
    return require('react-native/Libraries/Components/ActivityIndicator/ActivityIndicator');
  },
  get ART() {
    return require('react-native/Libraries/ART/ReactNativeART');
  },
  get Button() {
    return require('react-native/Libraries/Components/Button');
  },
  get CheckBox() {
    return require('CheckBox');
  },
  get DatePickerIOS() {
    return require('DatePickerIOS');
  },
  get DrawerLayoutAndroid() {
    return require('DrawerLayoutAndroid');
  },
  get FlatList() {
    return require('react-native/Libraries/Lists/FlatList');
  },
  get Image() {
    return require('react-native/Libraries/Image/Image');
  },
  get ImageBackground() {
    return require('react-native/Libraries/Image/ImageBackground');
  },
  get ImageEditor() {
    return require('react-native/Libraries/Image/ImageEditor');
  },
  get ImageStore() {
    return require('react-native/Libraries/Image/ImageStore');
  },
  get InputAccessoryView() {
    return require('react-native/Libraries/Components/TextInput/InputAccessoryView');
  },
  get KeyboardAvoidingView() {
    return require('react-native/Libraries/Components/Keyboard/KeyboardAvoidingView');
  },
  get ListView() {
    return require('react-native/Libraries/Lists/ListView/ListView');
  },
  get MaskedViewIOS() {
    return require('MaskedViewIOS');
  },
  get Modal() {
    return require('react-native/Libraries/Modal/Modal');
  },
  get NavigatorIOS() {
    return require('NavigatorIOS');
  },
  get Picker() {
    return require('react-native/Libraries/Components/Picker/Picker');
  },
  get PickerIOS() {
    return require('PickerIOS');
  },
  get ProgressBarAndroid() {
    return require('ProgressBarAndroid');
  },
  get ProgressViewIOS() {
    return require('ProgressViewIOS');
  },
  get SafeAreaView() {
    return require('SafeAreaView');
  },
  get ScrollView() {
    return require('react-native/Libraries/Components/ScrollView/ScrollView');
  },
  get SectionList() {
    return require('react-native/Libraries/Lists/SectionList');
  },
  get SegmentedControlIOS() {
    return require('SegmentedControlIOS');
  },
  get Slider() {
    return require('react-native/Libraries/Components/Slider/Slider');
  },
  get SnapshotViewIOS() {
    return require('SnapshotViewIOS');
  },
  get Switch() {
    return require('react-native/Libraries/Components/Switch/Switch');
  },
  get RefreshControl() {
    return require('react-native/Libraries/Components/RefreshControl/RefreshControl');
  },
  get StatusBar() {
    return require('react-native/Libraries/Components/StatusBar/StatusBar');
  },
  get SwipeableFlatList() {
    return require('react-native/Libraries/Experimental/SwipeableRow/SwipeableFlatList');
  },
  get SwipeableListView() {
    return require('react-native/Libraries/Experimental/SwipeableRow/SwipeableListView');
  },
  get TabBarIOS() {
    return require('TabBarIOS');
  },
  get Text() {
    return require('react-native/Libraries/Text/Text');
  },
  get TextInput() {
    return require('react-native/Libraries/Components/TextInput/TextInput');
  },
  get ToastAndroid() {
    return require('ToastAndroid');
  },
  get ToolbarAndroid() {
    return require('ToolbarAndroid');
  },
  get Touchable() {
    return require('react-native/Libraries/Components/Touchable/Touchable');
  },
  get TouchableHighlight() {
    return require('react-native/Libraries/Components/Touchable/TouchableHighlight');
  },
  get TouchableNativeFeedback() {
    return require('TouchableNativeFeedback');
  },
  get TouchableOpacity() {
    return require('react-native/Libraries/Components/Touchable/TouchableOpacity');
  },
  get TouchableWithoutFeedback() {
    return require('react-native/Libraries/Components/Touchable/TouchableWithoutFeedback');
  },
  get View() {
    return require('react-native/Libraries/Components/View/View');
  },
  get ViewPagerAndroid() {
    return require('ViewPagerAndroid');
  },
  get VirtualizedList() {
    return require('react-native/Libraries/Lists/VirtualizedList');
  },
  get WebView() {
    return require('WebView');
  },

  // APIs
  get ActionSheetIOS() {
    return require('react-native/Libraries/ActionSheetIOS/ActionSheetIOS');
  },
  get Alert() {
    return require('react-native/Libraries/Alert/Alert');
  },
  get AlertIOS() {
    return require('react-native/Libraries/Alert/AlertIOS');
  },
  get Animated() {
    return require('react-native/Libraries/Animated/src/Animated');
  },
  get AppRegistry() {
    return require('react-native/Libraries/ReactNative/AppRegistry');
  },
  get AppState() {
    return require('react-native/Libraries/AppState/AppState');
  },
  get AsyncStorage() {
    return require('react-native/Libraries/Storage/AsyncStorage');
  },
  get BackAndroid() {
    return require('react-native/Libraries/Utilities/BackAndroid');
  }, // deprecated: use BackHandler instead
  get BackHandler() {
    return require('react-native/Libraries/Utilities/BackHandler');
  },
  get CameraRoll() {
    return require('react-native/Libraries/CameraRoll/CameraRoll');
  },
  get Clipboard() {
    return require('react-native/Libraries/Components/Clipboard/Clipboard');
  },
  get DatePickerAndroid() {
    return require('DatePickerAndroid');
  },
  get DeviceInfo() {
    return require('react-native/Libraries/Utilities/DeviceInfo');
  },
  get Dimensions() {
    return require('react-native/Libraries/Utilities/Dimensions');
  },
  get Easing() {
    return require('react-native/Libraries/Animated/src/Easing');
  },
  get findNodeHandle() {
    return require('react-native/Libraries/Renderer/shims/ReactNative').findNodeHandle;
  },
  get I18nManager() {
    return require('react-native/Libraries/ReactNative/I18nManager');
  },
  get ImagePickerIOS() {
    return require('react-native/Libraries/CameraRoll/ImagePickerIOS');
  },
  get InteractionManager() {
    return require('react-native/Libraries/Interaction/InteractionManager');
  },
  get Keyboard() {
    return require('react-native/Libraries/Components/Keyboard/Keyboard');
  },
  get LayoutAnimation() {
    return require('react-native/Libraries/LayoutAnimation/LayoutAnimation');
  },
  get Linking() {
    return require('react-native/Libraries/Linking/Linking');
  },
  get NativeEventEmitter() {
    return require('react-native/Libraries/EventEmitter/NativeEventEmitter');
  },
  get NetInfo() {
    return require('react-native/Libraries/Network/NetInfo');
  },
  get PanResponder() {
    return require('react-native/Libraries/Interaction/PanResponder');
  },
  get PermissionsAndroid() {
    return require('react-native/Libraries/PermissionsAndroid/PermissionsAndroid');
  },
  get PixelRatio() {
    return require('react-native/Libraries/Utilities/PixelRatio');
  },
  get PushNotificationIOS() {
    return require('react-native/Libraries/PushNotificationIOS/PushNotificationIOS');
  },
  get Settings() {
    return require('Settings');
  },
  get Share() {
    return require('react-native/Libraries/Share/Share');
  },
  get StatusBarIOS() {
    return require('StatusBarIOS');
  },
  get StyleSheet() {
    return require('react-native/Libraries/StyleSheet/StyleSheet');
  },
  get Systrace() {
    return require('react-native/Libraries/Performance/Systrace');
  },
  get TimePickerAndroid() {
    return require('TimePickerAndroid');
  },
  get TVEventHandler() {
    return require('react-native/Libraries/Components/AppleTV/TVEventHandler');
  },
  get UIManager() {
    return require('react-native/Libraries/ReactNative/UIManager');
  },
  get unstable_batchedUpdates() {
    return require('react-native/Libraries/Renderer/shims/ReactNative').unstable_batchedUpdates;
  },
  get Vibration() {
    return require('react-native/Libraries/Vibration/Vibration');
  },
  get VibrationIOS() {
    return require('VibrationIOS');
  },
  get YellowBox() {
    return require('react-native/Libraries/YellowBox/YellowBox');
  },

  // Plugins
  get DeviceEventEmitter() {
    return require('react-native/Libraries/EventEmitter/RCTDeviceEventEmitter');
  },
  get NativeAppEventEmitter() {
    return require('react-native/Libraries/EventEmitter/RCTNativeAppEventEmitter');
  },
  get NativeModules() {
    return require('react-native/Libraries/BatchedBridge/NativeModules');
  },
  get Platform() {
    return require('react-native/Libraries/Utilities/Platform');
  },
  get processColor() {
    return require('react-native/Libraries/StyleSheet/processColor');
  },
  get requireNativeComponent() {
    return require('react-native/Libraries/ReactNative/requireNativeComponent');
  },
  get takeSnapshot() {
    return require('react-native/Libraries/ReactNative/takeSnapshot');
  },

  // Prop Types
  get ColorPropType() {
    return require('react-native/Libraries/StyleSheet/ColorPropType');
  },
  get EdgeInsetsPropType() {
    return require('react-native/Libraries/StyleSheet/EdgeInsetsPropType');
  },
  get PointPropType() {
    return require('react-native/Libraries/StyleSheet/PointPropType');
  },
  get ViewPropTypes() {
    return require('react-native/Libraries/Components/View/ViewPropTypes');
  },

  // Deprecated
  get Navigator() {
    invariant(
      false,
      'Navigator is deprecated and has been removed from this package. It can now be installed ' +
        'and imported from `react-native-deprecated-custom-components` instead of `react-native`. ' +
        'Learn about alternative navigation solutions at http://facebook.github.io/react-native/docs/navigation.html',
    );
  },
};

module.exports = ReactNative;
