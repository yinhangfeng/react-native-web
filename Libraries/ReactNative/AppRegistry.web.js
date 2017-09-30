/**
 * RW SYNC react-native-web: 0.1.0
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule AppRegistry
 * @flow
 */
'use strict';

const renderApplication = require('renderApplication');

const runnables = {};

export type ComponentProvider = () => ReactClass<any>;

export type AppConfig = {
  appKey: string,
  component?: ComponentProvider,
  run?: Function
};

const AppRegistry = {

  getAppKeys(): Array < string > {
    return Object.keys(runnables);
  },

  getApplication(appKey: string, appParameters?: Object): string {
    // invariant(
    //   runnables[appKey] && runnables[appKey].getApplication,
    //   `Application ${appKey} has not been registered. ` +
    //     'This is either due to an import error during initialization or failure to call AppRegistry.registerComponent.'
    // );

    return runnables[appKey].getApplication(appParameters);
  },

  registerComponent(appKey: string, getComponentFunc: ComponentProvider): string {
    runnables[appKey] = {
      run: (appParameters) =>
        renderApplication(getComponentFunc(), appParameters.initialProps || {}, appParameters.rootTag)
    };
    return appKey;
  },

  registerConfig(config: Array<AppConfig>) {
    config.forEach(({ appKey, component, run }) => {
      if (run) {
        AppRegistry.registerRunnable(appKey, run);
      } else {
        invariant(component, 'No component provider passed in');
        AppRegistry.registerComponent(appKey, component);
      }
    });

  },

  registerRunnable(appKey: string, run: Function): string {
    runnables[appKey] = { run };
    return appKey;
  },

  // 运行程序 默认rootTag为#react-root
  runApplication(appKey: string, appParameters: any): void {
    if(!appParameters) {
      appParameters = {
        rootTag: document.getElementById('react-root')
      };
    }
    runnables[appKey].run(appParameters);
  },

  unmountApplicationComponentAtRootTag(rootTag) {
    // unmountComponentAtNode(rootTag);
  },
};

module.exports = AppRegistry;
