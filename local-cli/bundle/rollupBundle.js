/**
 * 使用rollup bundle
 * uglifyjs压缩
 * 并保存
 */
'use strict';

const rollup = require('rollup');
const json = require('rollup-plugin-json');
const babel = require('rollup-plugin-babel');
// const babelrc = require('babelrc-rollup');
const commonjs = require('rollup-plugin-commonjs');
const LABRNPlugin = require('./LABRNPlugin');

return function getRollupConfig(entry, projectRoots, labRnPlugin) {

  let rollupConfig;

  let projectRollupConfigPath;
  if (projectRoots && projectRoots.length > 0) {
    projectRollupConfigPath = path.resolve(projectRoots[0], '.babelrc');
  }

  let pluginsConfig = {};
  if (projectRollupConfigPath) {
    rollupConfig = Object.assign({}, require(projectRollupConfigPath));
    if (rollupConfig.pluginsConfig) {
      pluginsConfig = rollupConfig.pluginsConfig;
      delete rollupConfig.pluginsConfig;
    }
  } else {
    rollupConfig = {};
  }

  rollupConfig.entry = entry;

  const innerPlugins = [
    labRnPlugin,
    json(pluginsConfig.json),
    commonjs(Object.assign({

    }, pluginsConfig.commonjs)),
  ];

  let plugins = innerPlugins;
  if (rollupConfig.plugins) {
    plugins = innerPlugins.concat(rollupConfig.plugins);
  }
  rollupConfig.plugins = plugins;

  return rollupConfig;
};

/**
 * @param {any} packagerInstance 
 * @param {any} requestOpts 
 * @param {any} shouldClosePackager
 * @param {Object} outputOptions
 * 
 * @return bundle 假的Bundle对象 只有getAssets函数以便之后saveAssets使用
 */
function bundle(packagerInstance, requestOptions, outputOptions, config, shouldClosePackager) {
  const {
    bundleOutput,
    bundleEncoding: encoding,
    dev,
    sourcemapOutput
  } = outputOptions;

  return packagerInstance.newResolutionRequest({
    ...requestOptions,
    isolateModuleIDs: true,
  }).then((resolutionRequest) => {
    const labRnPlugin = LABRNPlugin({
      resolutionRequest,
      bundler: packagerInstance.getBundler(),
    });
    const rollupConfig = getRollupConfig(requestOptions.entryFile, config.getProjectRoots());
    return rollup.rollup(rollupConfig);
  }).then((bundle) => {
    const result = bundle.generate({
      format: 'cjs',
    });
  });

  // xxx
  if (shouldClosePackager) {
    packagerInstance.end();
  }
}

module.exports = bundle;
