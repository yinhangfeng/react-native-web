'use strict';

const ReactNativeInternal = require('ReactNative');

// react web 扩展
exports.createWebCoreElement = require('createWebCoreElement');
exports.CSSClassNames = require('CSSClassNames');
exports.RWServerUrl = require('RWServerUrl');
exports.RWConfig = require('RWConfig');
// exports.RWBodyScrollHelper = require('RWBodyScrollHelper');
exports.RWPerformance = require('RWPerformance');

// Components
exports.AccessibilityInfo = null;
exports.ActivityIndicator = require('ActivityIndicator');
exports.ART = null; //require('ReactNativeART');
exports.Button = require('Button');
exports.CheckBox = null; //require('CheckBox');
exports.DatePickerIOS = null; //require('DatePickerIOS');
exports.DrawerLayoutAndroid = null; //require('DrawerLayoutAndroid');
exports.FlatList = null;
exports.Image = require('Image');
exports.ImageBackground = require('ImageBackground');
exports.ImageEditor = null; //require('ImageEditor');
exports.ImageStore = null; //require('ImageStore');
exports.KeyboardAvoidingView
exports.ListView = require('ListView');
exports.MaskedViewIOS = null;
exports.Modal = null; //require('Modal');
exports.NavigatorIOS = null; //require('NavigatorIOS');
exports.Picker = require('Picker');
exports.PickerIOS = null; //require('PickerIOS');
exports.ProgressBarAndroid = null; //require('ProgressBarAndroid');
exports.ProgressViewIOS = null; //require('ProgressViewIOS');
exports.SafeAreaView = null;
exports.ScrollView = require('ScrollView');
exports.SectionList = null;
exports.SegmentedControlIOS = null; //require('SegmentedControlIOS');
exports.Slider = null; //require('Slider');
exports.SnapshotViewIOS
exports.Switch = require('Switch');
exports.RefreshControl = require('RefreshControl');
exports.StatusBar = null; //require('StatusBar');
exports.SwipeableFlatList = null;
exports.SwipeableListView = null;
exports.TabBarIOS = null; //require('TabBarIOS');
exports.Text = require('Text');
exports.TextInput = require('TextInput');
exports.ToastAndroid = null; //require('ToastAndroid');
exports.ToolbarAndroid = null; //require('ToolbarAndroid');
exports.Touchable = require('Touchable');
exports.TouchableHighlight = require('TouchableHighlight');
exports.TouchableNativeFeedback = null; //require('TouchableNativeFeedback');
exports.TouchableOpacity = require('TouchableOpacity');
exports.TouchableWithoutFeedback = require('TouchableWithoutFeedback');
exports.View = require('View');
exports.ViewPagerAndroid = null; //require('ViewPagerAndroid');
exports.VirtualizedList = null;
exports.WebView = null; //require('WebView');

// APIs
exports.ActionSheetIOS = null; //require('ActionSheetIOS');
exports.Alert = require('Alert');
exports.AlertIOS = null; //require('AlertIOS');
exports.Animated = require('Animated');
exports.AppRegistry = require('AppRegistry');
exports.AppState = require('AppState');
exports.AsyncStorage = require('AsyncStorage');
exports.BackAndroid = null; //require('BackAndroid');
exports.BackHandler = null;
exports.CameraRoll = null; //require('CameraRoll');
exports.Clipboard = null; //require('Clipboard');
exports.DatePickerAndroid = null; //require('DatePickerAndroid');
exports.DeviceInfo = null;
exports.Dimensions = require('Dimensions');
exports.Easing = require('Easing');
exports.findNodeHandle = ReactNativeInternal.findNodeHandle;
exports.I18nManager = null;
exports.ImagePickerIOS = null; //require('ImagePickerIOS');
exports.InteractionManager = require('InteractionManager');
exports.Keyboard = null;
exports.LayoutAnimation = null; //require('LayoutAnimation');
exports.Linking = require('Linking');
exports.NativeEventEmitter
exports.NetInfo = null; //require('NetInfo');
exports.PanResponder = require('PanResponder');
exports.PermissionsAndroid = null;
exports.PixelRatio = require('PixelRatio');
exports.PushNotificationIOS = null; //require('PushNotificationIOS');
exports.Settings = null; //require('Settings');
exports.Share = null;
exports.StatusBarIOS = null; //require('StatusBarIOS');
exports.StyleSheet = require('StyleSheet');
exports.Systrace = null;
exports.TimePickerAndroid = null; //require('TimePickerAndroid');
exports.TVEventHandler = null;
exports.UIManager = require('UIManager');
//unstable_batchedUpdates
exports.Vibration = null; //require('Vibration');
exports.VibrationIOS = null; //require('VibrationIOS');

// Plugins
exports.DeviceEventEmitter = null; //require('RCTDeviceEventEmitter');
exports.NativeAppEventEmitter = null; //require('RCTNativeAppEventEmitter');
exports.NativeModules = require('NativeModules');
exports.Platform = require('Platform');
exports.processColor = require('processColor');
exports.requireNativeComponent = null; //require('requireNativeComponent');
exports.takeSnapshot

// Prop Types
exports.ColorPropType = require('ColorPropType');
exports.EdgeInsetsPropType = require('EdgeInsetsPropType');
exports.PointPropType = require('PointPropType');
exports.ViewPropTypes = require('ViewPropTypes');

let disableReactWarnUnknownProperties;
if (__DEV__) {
  disableReactWarnUnknownProperties = function disableReactWarnUnknownProperties() {
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

exports.disableReactWarnUnknownProperties = disableReactWarnUnknownProperties;