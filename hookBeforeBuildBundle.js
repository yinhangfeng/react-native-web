'use strict';

const path = require('path');

module.exports = function(options) {
  console.log('hookBeforeBuildBundle', options);

  return Promise.resolve(Object.assign({}, options.bundleOptions, {
    extraNodeModules: {
      'xxxxx': path.join(__dirname, 'Examples/UIExplorer/js/xxxxx'),
    }
  }));
};
