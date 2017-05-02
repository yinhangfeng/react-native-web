'use strict';

// react web 扩展
exports.createWebCoreElement = require('createWebCoreElement');
exports.CSSClassNames = require('CSSClassNames');
exports.RWServerUrl = require('RWServerUrl');
exports.RWConfig = require('RWConfig');
exports.RWBodyScrollHelper = require('RWBodyScrollHelper');
exports.RWPerformance = require('RWPerformance');

// Components
exports.ActivityIndicator = require('ActivityIndicator');
// exports.ART = require('ReactNativeART');
// exports.DatePickerIOS = require('DatePickerIOS');
// exports.DrawerLayoutAndroid = require('DrawerLayoutAndroid');
exports.Image = require('Image');
// exports.ImageEditor = require('ImageEditor');
// exports.ImageStore = require('ImageStore');
exports.ListView = require('ListView');
// exports.MapView = require('MapView');
// exports.Modal = require('Modal');
// exports.Navigator = require('HistoryNavigator');
// exports.NavigatorIOS = require('NavigatorIOS');
exports.Picker = require('Picker');
// exports.PickerIOS = require('PickerIOS');
// exports.ProgressBarAndroid = require('ProgressBarAndroid');
// exports.ProgressViewIOS = require('ProgressViewIOS');
exports.ScrollView = require('ScrollView');
// exports.SegmentedControlIOS = require('SegmentedControlIOS');
////exports.Slider = require('Slider');
// exports.SliderIOS = require('SliderIOS');
// exports.SnapshotViewIOS = require('SnapshotViewIOS');
exports.Switch = require('Switch');
// exports.PullToRefreshViewAndroid = require('PullToRefreshViewAndroid');
exports.RecyclerViewBackedScrollView = require('RecyclerViewBackedScrollView');
exports.RefreshControl = require('RefreshControl');
// exports.StatusBar = require('StatusBar');
// exports.SwitchAndroid = require('SwitchAndroid');
// exports.SwitchIOS = require('SwitchIOS');
// exports.TabBarIOS = require('TabBarIOS');
exports.Text = require('Text');
exports.TextInput = require('TextInput');
// exports.ToastAndroid = require('ToastAndroid');
// exports.ToolbarAndroid = require('ToolbarAndroid');
exports.Touchable = require('Touchable');
exports.TouchableHighlight = require('TouchableHighlight');
//exports.TouchableNativeFeedback = require('TouchableNativeFeedback');
exports.TouchableOpacity = require('TouchableOpacity');
exports.TouchableWithoutFeedback = require('TouchableWithoutFeedback');
exports.View = require('View');
// exports.ViewPagerAndroid = require('ViewPagerAndroid');
// exports.WebView = require('WebView');

// APIs
// exports.ActionSheetIOS = require('ActionSheetIOS');
// exports.AdSupportIOS = require('AdSupportIOS');
exports.Alert = require('Alert');
// exports.AlertIOS = require('AlertIOS');
exports.Animated = require('Animated');
exports.AppRegistry = require('AppRegistry');
exports.AppState = require('AppState');
// exports.AppStateIOS = require('AppStateIOS');
exports.AsyncStorage = require('AsyncStorage');
// exports.BackAndroid = require('BackAndroid');
// exports.CameraRoll = require('CameraRoll');
// exports.Clipboard = require('Clipboard');
// exports.DatePickerAndroid = require('DatePickerAndroid');
exports.Dimensions = require('Dimensions');
exports.Easing = require('Easing');
// exports.ImagePickerIOS = require('ImagePickerIOS');
// exports.IntentAndroid = require('IntentAndroid');
exports.InteractionManager = require('InteractionManager');
// exports.LayoutAnimation = require('LayoutAnimation');
exports.Linking = require('Linking');
// exports.LinkingIOS = require('LinkingIOS');
// exports.NavigationExperimental = require('NavigationExperimental');
// exports.NetInfo = require('NetInfo');
exports.PanResponder = require('PanResponder');
exports.PixelRatio = require('PixelRatio');
// exports.PushNotificationIOS = require('PushNotificationIOS');
// exports.Settings = require('Settings');
// exports.StatusBarIOS = require('StatusBarIOS');
exports.StyleSheet = require('StyleSheet');
// exports.TimePickerAndroid = require('TimePickerAndroid');
exports.UIManager = require('UIManager');
// exports.Vibration = require('Vibration');
// exports.VibrationIOS = require('VibrationIOS');

// Plugins
// exports.DeviceEventEmitter = require('RCTDeviceEventEmitter');
// exports.NativeAppEventEmitter = require('RCTNativeAppEventEmitter');
exports.NativeModules = require('NativeModules');
exports.Platform = require('Platform');
exports.processColor = require('processColor');
//exports.requireNativeComponent = require('requireNativeComponent');

// Prop Types
exports.ColorPropType = require('ColorPropType');
exports.EdgeInsetsPropType = require('EdgeInsetsPropType');
exports.PointPropType = require('PointPropType');

// Preserve getters with warnings on the internal ReactNative copy without
// invoking them.
const ReactNativeInternal = require('ReactNative');

// TODO rn 0.44 已经去掉了
exports.findNodeHandle = ReactNativeInternal.findNodeHandle;
