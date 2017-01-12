'use strict';

const path = require('path');

module.exports = function(options) {
  console.log('serverBuildBundleInterceptor', options);

  return {
    bundleOptions: Object.assign({}, options.bundleOptions, {
        extraNodeModules: {
          'xxxxx': path.join(__dirname, 'Examples/UIExplorer/js/xxxxx'),
        }
      }),
    fileChanged: Math.random() > 0.5,
  };
};
