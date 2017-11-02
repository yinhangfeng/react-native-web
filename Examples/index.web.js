const ReactNative = require('react-native');
const AppRegistry = require('AppRegistry');

ReactNative.disableWarnUnknownProperties && ReactNative.disableWarnUnknownProperties();

require('../RNTester/js/RNTesterApp');
AppRegistry.runApplication('RNTesterApp');

// const NavigationExperimentalExample = require('./UIExplorer/NavigationExperimental/NavigationExperimentalExample');
// AppRegistry.registerComponent('NavigationExperimentalExample', () => NavigationExperimentalExample);
// AppRegistry.runApplication('NavigationExperimentalExample');

// const NavigatorExample = require('./UIExplorer/Navigator/NavigatorExample');
// AppRegistry.registerComponent('NavigatorExample', () => NavigatorExample);
// AppRegistry.runApplication('NavigatorExample');

// require('./HelloWorld/index');


// require('./HistoryNavigator');

// require('./BodyScroll');

window._RWPerformance = require('RWPerformance');
