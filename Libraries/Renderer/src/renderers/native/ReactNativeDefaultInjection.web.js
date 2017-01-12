/**
 * @providesModule ReactNativeDefaultInjection
 * @flow
 */
'use strict';

/**
 * Make sure essential globals are available and are patched correctly. Please don't remove this
 * line. Bundles created by react-packager `require` it before executing any application code. This
 * ensures it exists in the dependency graph and can be `require`d.
 * TODO: require this in packager, not in React #10932517
 */
require('InitializeCore');

//兼容native touch机制
require('./injectResponderEventPlugin');

// RW TODO react工程的 ReactNativeDefaultInjection 中的其它功能?
