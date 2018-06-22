'use strict';

const ReactNativeInternal = require('react-native/Libraries/Renderer/shims/ReactNative');
const UnimplementedView = require('react-native/Libraries/Components/UnimplementedViews/UnimplementedView');

// react web 扩展
exports.createWebCoreElement = require('react-native/Libraries/lrnw/createWebCoreElement');
exports.CSSClassNames = require('react-native/Libraries/StyleSheet/CSSClassNames');
exports.RWServerUrl = require('react-native/Libraries/lrnw/RWServerUrl');
exports.RWConfig = require('react-native/Libraries/lrnw/RWConfig');
// exports.RWBodyScrollHelper = require('RWBodyScrollHelper');
exports.RWPerformance = require('react-native/Libraries/lrnw/RWPerformance');

// Components
exports.AccessibilityInfo = null;
exports.ActivityIndicator = require('react-native/Libraries/Components/ActivityIndicator/ActivityIndicator');
exports.ART = null; //require('react-native/Libraries/ART/ReactNativeART');
exports.Button = require('react-native/Libraries/Components/Button');
exports.CheckBox = UnimplementedView; //require('CheckBox');
exports.DatePickerIOS = UnimplementedView; //require('DatePickerIOS');
exports.DrawerLayoutAndroid = UnimplementedView; //require('DrawerLayoutAndroid');
exports.FlatList = UnimplementedView;
exports.Image = require('react-native/Libraries/Image/Image');
exports.ImageBackground = require('react-native/Libraries/Image/ImageBackground');
exports.ImageEditor = null; //require('react-native/Libraries/Image/ImageEditor');
exports.ImageStore = null; //require('react-native/Libraries/Image/ImageStore');
exports.KeyboardAvoidingView = UnimplementedView;
exports.ListView = require('react-native/Libraries/Lists/ListView/ListView');
exports.MaskedViewIOS = UnimplementedView;
exports.Modal = UnimplementedView; //require('react-native/Libraries/Modal/Modal');
exports.NavigatorIOS = UnimplementedView; //require('NavigatorIOS');
exports.Picker = require('react-native/Libraries/Components/Picker/Picker');
exports.PickerIOS = UnimplementedView; //require('PickerIOS');
exports.ProgressBarAndroid = UnimplementedView; //require('ProgressBarAndroid');
exports.ProgressViewIOS = UnimplementedView; //require('ProgressViewIOS');
exports.SafeAreaView = UnimplementedView;
exports.ScrollView = require('react-native/Libraries/Components/ScrollView/ScrollView');
exports.SectionList = UnimplementedView;
exports.SegmentedControlIOS = UnimplementedView; //require('SegmentedControlIOS');
exports.Slider = UnimplementedView; //require('react-native/Libraries/Components/Slider/Slider');
exports.SnapshotViewIOS = UnimplementedView;
exports.Switch = require('react-native/Libraries/Components/Switch/Switch');
exports.RefreshControl = require('react-native/Libraries/Components/RefreshControl/RefreshControl');
exports.StatusBar = UnimplementedView; //require('react-native/Libraries/Components/StatusBar/StatusBar');
exports.SwipeableFlatList = UnimplementedView;
exports.SwipeableListView = UnimplementedView;
exports.TabBarIOS = UnimplementedView; //require('TabBarIOS');
exports.Text = require('react-native/Libraries/Text/Text');
exports.TextInput = require('react-native/Libraries/Components/TextInput/TextInput');
exports.ToastAndroid = null; //require('ToastAndroid');
exports.ToolbarAndroid = UnimplementedView; //require('ToolbarAndroid');
exports.Touchable = require('react-native/Libraries/Components/Touchable/Touchable');
exports.TouchableHighlight = require('react-native/Libraries/Components/Touchable/TouchableHighlight');
exports.TouchableNativeFeedback = UnimplementedView; //require('TouchableNativeFeedback');
exports.TouchableOpacity = require('react-native/Libraries/Components/Touchable/TouchableOpacity');
exports.TouchableWithoutFeedback = require('react-native/Libraries/Components/Touchable/TouchableWithoutFeedback');
exports.View = require('react-native/Libraries/Components/View/View');
exports.ViewPagerAndroid = UnimplementedView; //require('ViewPagerAndroid');
exports.VirtualizedList = UnimplementedView;
exports.WebView = UnimplementedView; //require('WebView');

// APIs
exports.ActionSheetIOS = null; //require('react-native/Libraries/ActionSheetIOS/ActionSheetIOS');
exports.Alert = require('react-native/Libraries/Alert/Alert');
exports.AlertIOS = null; //require('react-native/Libraries/Alert/AlertIOS');
exports.Animated = require('react-native/Libraries/Animated/src/Animated');
exports.AppRegistry = require('react-native/Libraries/ReactNative/AppRegistry');
exports.AppState = require('react-native/Libraries/AppState/AppState');
exports.AsyncStorage = require('react-native/Libraries/Storage/AsyncStorage');
exports.BackAndroid = null; //require('react-native/Libraries/Utilities/BackAndroid');
exports.BackHandler = null;
exports.CameraRoll = null; //require('react-native/Libraries/CameraRoll/CameraRoll');
exports.Clipboard = null; //require('react-native/Libraries/Components/Clipboard/Clipboard');
exports.DatePickerAndroid = null; //require('DatePickerAndroid');
exports.DeviceInfo = null;
exports.Dimensions = require('react-native/Libraries/Utilities/Dimensions');
exports.Easing = require('react-native/Libraries/Animated/src/Easing');
exports.findNodeHandle = ReactNativeInternal.findNodeHandle;
exports.I18nManager = null;
exports.ImagePickerIOS = null; //require('react-native/Libraries/CameraRoll/ImagePickerIOS');
exports.InteractionManager = require('react-native/Libraries/Interaction/InteractionManager');
exports.Keyboard = null;
exports.LayoutAnimation = null; //require('react-native/Libraries/LayoutAnimation/LayoutAnimation');
exports.Linking = require('react-native/Libraries/Linking/Linking');
exports.NativeEventEmitter = null;
exports.NetInfo = null; //require('react-native/Libraries/Network/NetInfo');
exports.PanResponder = require('react-native/Libraries/Interaction/PanResponder');
exports.PermissionsAndroid = null;
exports.PixelRatio = require('react-native/Libraries/Utilities/PixelRatio');
exports.PushNotificationIOS = null; //require('react-native/Libraries/PushNotificationIOS/PushNotificationIOS');
exports.Settings = null; //require('Settings');
exports.Share = null;
exports.StatusBarIOS = null; //require('StatusBarIOS');
exports.StyleSheet = require('react-native/Libraries/StyleSheet/StyleSheet');
exports.Systrace = null;
exports.TimePickerAndroid = null; //require('TimePickerAndroid');
exports.TVEventHandler = null;
exports.UIManager = require('react-native/Libraries/ReactNative/UIManager');
//unstable_batchedUpdates
exports.Vibration = null; //require('react-native/Libraries/Vibration/Vibration');
exports.VibrationIOS = null; //require('VibrationIOS');

// Plugins
exports.DeviceEventEmitter = null; //require('react-native/Libraries/EventEmitter/RCTDeviceEventEmitter');
exports.NativeAppEventEmitter = null; //require('react-native/Libraries/EventEmitter/RCTNativeAppEventEmitter');
exports.NativeModules = require('react-native/Libraries/BatchedBridge/NativeModules');
exports.Platform = require('react-native/Libraries/Utilities/Platform');
exports.processColor = require('react-native/Libraries/StyleSheet/processColor');
exports.requireNativeComponent = require('react-native/Libraries/ReactNative/requireNativeComponent');
exports.takeSnapshot

// Prop Types
exports.ColorPropType = require('react-native/Libraries/StyleSheet/ColorPropType');
exports.EdgeInsetsPropType = require('react-native/Libraries/StyleSheet/EdgeInsetsPropType');
exports.PointPropType = require('react-native/Libraries/StyleSheet/PointPropType');
exports.ViewPropTypes = require('react-native/Libraries/Components/View/ViewPropTypes');

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
