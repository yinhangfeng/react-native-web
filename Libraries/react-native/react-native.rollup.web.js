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
exports.ART = null; //require('ReactNativeART');
exports.DatePickerIOS = null; //require('DatePickerIOS');
exports.DrawerLayoutAndroid = null; //require('DrawerLayoutAndroid');
exports.Image = require('Image');
exports.ImageEditor = null; //require('ImageEditor');
exports.ImageStore = null; //require('ImageStore');
exports.ListView = require('ListView');
exports.MapView = null; //require('MapView');
exports.Modal = null; //require('Modal');
exports.Navigator = require('HistoryNavigator');
exports.NavigatorIOS = null; //require('NavigatorIOS');
exports.Picker = require('Picker');
exports.PickerIOS = null; //require('PickerIOS');
exports.ProgressBarAndroid = null; //require('ProgressBarAndroid');
exports.ProgressViewIOS = null; //require('ProgressViewIOS');
exports.ScrollView = require('ScrollView');
exports.SegmentedControlIOS = null; //require('SegmentedControlIOS');
exports.Slider = null; //require('Slider');
exports.SliderIOS = null; //require('SliderIOS');
exports.SnapshotViewIOS = null; //require('SnapshotViewIOS');
exports.Switch = require('Switch');
exports.PullToRefreshViewAndroid = null; //require('PullToRefreshViewAndroid');
exports.RecyclerViewBackedScrollView = require('RecyclerViewBackedScrollView');
exports.RefreshControl = require('RefreshControl');
exports.StatusBar = null; //require('StatusBar');
exports.SwitchAndroid = null; //require('SwitchAndroid');
exports.SwitchIOS = null; //require('SwitchIOS');
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
exports.WebView = null; //require('WebView');

// APIs
exports.ActionSheetIOS = null; //require('ActionSheetIOS');
exports.AdSupportIOS = null; //require('AdSupportIOS');
exports.Alert = require('Alert');
exports.AlertIOS = null; //require('AlertIOS');
exports.Animated = require('Animated');
exports.AppRegistry = require('AppRegistry');
exports.AppState = require('AppState');
exports.AppStateIOS = null; //require('AppStateIOS');
exports.AsyncStorage = require('AsyncStorage');
exports.BackAndroid = null; //require('BackAndroid');
exports.CameraRoll = null; //require('CameraRoll');
exports.Clipboard = null; //require('Clipboard');
exports.DatePickerAndroid = null; //require('DatePickerAndroid');
exports.Dimensions = require('Dimensions');
exports.Easing = require('Easing');
exports.ImagePickerIOS = null; //require('ImagePickerIOS');
exports.IntentAndroid = null; //require('IntentAndroid');
exports.InteractionManager = require('InteractionManager');
exports.LayoutAnimation = null; //require('LayoutAnimation');
exports.Linking = require('Linking');
exports.LinkingIOS = null; //require('LinkingIOS');
exports.NavigationExperimental = null; //require('NavigationExperimental');
exports.NetInfo = null; //require('NetInfo');
exports.PanResponder = require('PanResponder');
exports.PixelRatio = require('PixelRatio');
exports.PushNotificationIOS = null; //require('PushNotificationIOS');
exports.Settings = null; //require('Settings');
exports.StatusBarIOS = null; //require('StatusBarIOS');
exports.StyleSheet = require('StyleSheet');
exports.TimePickerAndroid = null; //require('TimePickerAndroid');
exports.UIManager = require('UIManager');
exports.Vibration = null; //require('Vibration');
exports.VibrationIOS = null; //require('VibrationIOS');

// Plugins
exports.DeviceEventEmitter = null; //require('RCTDeviceEventEmitter');
exports.NativeAppEventEmitter = null; //require('RCTNativeAppEventEmitter');
exports.NativeModules = require('NativeModules');
exports.Platform = require('Platform');
exports.processColor = require('processColor');
exports.requireNativeComponent = null; //require('requireNativeComponent');

// Prop Types
exports.ColorPropType = require('ColorPropType');
exports.EdgeInsetsPropType = require('EdgeInsetsPropType');
exports.PointPropType = require('PointPropType');

// Preserve getters with warnings on the internal ReactNative copy without
// invoking them.
const ReactNativeInternal = require('ReactNative');

// TODO rn 0.44 已经去掉了
exports.findNodeHandle = ReactNativeInternal.findNodeHandle;
