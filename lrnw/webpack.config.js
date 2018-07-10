'use strict';

const {
  resolve,
} = require('path');
const getWebpackConfig = require('./getWebpackConfig');
const getBabelConfig = require('./getBabelConfig');
const getBrowsers = require('./getBrowsers');

module.exports = function({
  env = 'development',
} = {}) {
  const projectRoot = resolve(__dirname, '..');
  const browsers = getBrowsers(env);
  const babelConfig = getBabelConfig({
    env,
    browsers,
  });
  return getWebpackConfig({
    env,
    projectRoot,
    babelConfig,
    entryPath: resolve(projectRoot, 'Examples/index.web.js'),
    outputPath: resolve(projectRoot, 'build'),
    htmlTemplatePath: resolve(projectRoot, 'Examples/index.html'),
    browsers,
  });
};