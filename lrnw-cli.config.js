'use strict';

const {
  resolve,
} = require('path');

module.exports = {
  processWebpackConfigOptions(webpackConfigOptions) {
    const projectRoot = webpackConfigOptions.projectRoot;
    return {
      ...webpackConfigOptions,
      entryPath: resolve(projectRoot, 'Examples/index.web.js'),
      outputPath: resolve(projectRoot, 'build'),
      htmlTemplatePath: resolve(projectRoot, 'Examples/index.html'),
    };
  },
};
