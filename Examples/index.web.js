const ReactNative = require('react-native');

ReactNative.disableReactWarnUnknownProperties && ReactNative.disableReactWarnUnknownProperties();

async function aaaaa() {
  await Promise.resolve();
}

aaaaa();

// require('../RNTester/js/RNTesterApp');
// ReactNative.AppRegistry.runApplication('RNTesterApp');

require('./HelloWorld/index');

// window._RWPerformance = require('RWPerformance');
