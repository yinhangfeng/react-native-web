const AppRegistry = require('AppRegistry');

//require('./UIExplorer/UIExplorerApp');

require('./UIExplorer/js/UIExplorerAppNoNav');
AppRegistry.runApplication('UIExplorerApp');

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
