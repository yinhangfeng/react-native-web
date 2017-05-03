/**
 * @providesModule AppRegistry
 * @flow
 */
'use strict';

const renderApplication = require('renderApplication');

let runnables = {};

type ComponentProvider = () => ReactClass<any>;

type AppConfig = {
  appKey: string;
  component?: ComponentProvider;
  run?: Function;
};

let AppRegistry = {
  registerConfig: function(config: Array < AppConfig > ) {
    for (let i = 0; i < config.length; ++i) {
      let appConfig = config[i];
      if (appConfig.run) {
        AppRegistry.registerRunnable(appConfig.appKey, appConfig.run);
      } else {
        AppRegistry.registerComponent(appConfig.appKey, appConfig.component);
      }
    }
  },

  registerComponent: function(appKey: string, getComponentFunc: ComponentProvider): string {
    runnables[appKey] = {
      run: (appParameters) =>
        renderApplication(getComponentFunc(), appParameters.initialProps, appParameters.rootTag)
    };
    return appKey;
  },

  registerRunnable: function(appKey: string, func: Function): string {
    runnables[appKey] = {run: func};
    return appKey;
  },

  getAppKeys: function(): Array < string > {
    return Object.keys(runnables);
  },

  // 运行程序 默认rootTag为#react-root
  runApplication: function(appKey: string, appParameters: any): void {
    if(!appParameters) {
      appParameters = {
        rootTag: document.getElementById('react-root')
      };
    }
    runnables[appKey].run(appParameters);
  },

  unmountApplicationComponentAtRootTag: function(rootTag : number) {
    // RW TODO
    //ReactNative.unmountComponentAtNodeAndRemoveContainer(rootTag);
  },
};

module.exports = AppRegistry;
