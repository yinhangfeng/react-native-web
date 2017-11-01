'use strict';

const getPolyfills = require('./rn-get-polyfills');

module.exports = {
  extraNodeModules: {
    'react-native': __dirname,
  },
  getPolyfills,
  
  // 测试plugin
  plugins: [{
    options(options) {
      console.log('TestPlugin options');
    },

    onServerCreated(server) {
      console.log('TestPlugin onServerCreated');
    },
  
    onBundlerCreated(bundler) {
      console.log('TestPlugin onBundlerCreated');
    },
  
    onResolverCreated(resolver) {
      console.log('TestPlugin onResolverCreated');
    },
  
    onDependencyGraphCreated(dependencyGraph) {
      console.log('TestPlugin onDependencyGraphCreated');
    },
  
    onHasteCreated(haste) {
      console.log('TestPlugin onHasteCreated');
    },

    onResolutionRequestCreated(resolutionRequest, platform, extraBuildOptions) {
      console.log('TestPlugin onResolutionRequestCreated', platform, extraBuildOptions);
      resolutionRequest._xxx = 'xxx';
    },
  
    resolveNodeDependency(resolutionRequest, moduleResolver, fromModule, toModuleName, platform, extraBuildOptions) {
      console.log('TestPlugin resolveNodeDependency', fromModule.path, toModuleName, platform, extraBuildOptions, resolutionRequest._xxx);
      if (toModuleName === 'xxx') {
        // const path = require('path');
        // const filePath = path.join(path.dirname(fromModule.path), 'xxx.js');
        // return moduleResolver._options.moduleCache.getModule(filePath);

        const filePath = '/lab-virtual/xxx.js';
        return moduleResolver._options.moduleCache.getMemoryModule(filePath, 'console.log("virtual xxx")');
      }
    },
  }],
};
