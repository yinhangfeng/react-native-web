'use strict';

const fs = require('fs');
const path = require('path');
const rollup = require('rollup');
const json = require('rollup-plugin-json');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const LABRNPlugin = require('./LABRNRollupPlugin');
const Server = require('metro-bundler/src/Server')

const prelude = require.resolve('metro-bundler/src/Resolver/polyfills/prelude.js');
const prelude_dev = require.resolve('metro-bundler/src/Resolver/polyfills/prelude_dev.js');

// react-native/rn-get-polyfills.js
const polyfills = [
  require.resolve('../../Libraries/polyfills/error-guard.js'),
  require.resolve('../../Libraries/polyfills/Number.es6.js'),
  require.resolve('../../Libraries/polyfills/String.prototype.es6.js'),
  require.resolve('../../Libraries/polyfills/Array.prototype.es6.js'),
  require.resolve('../../Libraries/polyfills/Array.es6.js'),
  require.resolve('../../Libraries/polyfills/Object.es6.js'),
  require.resolve('../../Libraries/polyfills/Object.es7.js'),
  require.resolve('../../Libraries/polyfills/babelHelpers.js'),

  // 把InitializeCore 当做polyfill
  require.resolve('../../Libraries/Core/InitializeCore.web.js'),
];

function createLABRNPlugin(packagerInstance, requestOptions, outputOptions, assetsOutput) {
  const {
    dev,
  } = outputOptions;
  return packagerInstance.newBundleSession({
    // 参数参考 metro-bundler/src/shared/bundle buildBundle
    ...Server.DEFAULT_BUNDLE_OPTIONS,
    ...requestOptions,
    isolateModuleIDs: true,
  }).then((bundleSession) => {
    let pfs = dev ? [prelude_dev] : [prelude];
    pfs = pfs.concat(polyfills);
    return LABRNPlugin({
      bundleSession,
      dev,
      assetsOutput,
      platform: requestOptions.platform,
      polyfills: pfs,
    });
  });
}

function createRollupConfig(requestOptions, rnConfig, labRnPlugin) {
  let rollupConfig = {
    // 将input 转换为绝对路径 方便labRnPlugin处理
    input: path.resolve(requestOptions.entryFile),
    // 去除每个模块的 'use strict' 会在bundle外部拼接
    strict: false,
    plugins: [
      labRnPlugin,
      createJsonPlugin(rnConfig),
      createBabelPlugin(rnConfig),
      createCommonjsPlugin(rnConfig),
    ],
  };

  if (rnConfig.rollupProcessConfig) {
    rollupConfig = rnConfig.rollupProcessConfig(rollupConfig);
  }

  return rollupConfig;
}

// https://github.com/rollup/rollup-plugin-json
function createJsonPlugin(rnConfig) {
  let config;
  if (rnConfig.rollupProcessJsonPluginConfig) {
    config = rnConfig.rollupProcessJsonPluginConfig(config);
  }
  return json(config);
}

// https://github.com/rollup/rollup-plugin-babel
function createBabelPlugin(rnConfig) {
  const babelConfig = require('./rollupBabelConfig');

  let config = Object.assign(
    {},
    babelConfig,
    {
      exclude: ['**/Libraries/polyfills/babelHelpers*'],
      externalHelpers: true,
    }
  );

  if (rnConfig.rollupProcessBabelPluginConfig) {
    config = rnConfig.rollupProcessBabelPluginConfig(config);
  }
  return babel(config);
}

// https://github.com/rollup/rollup-plugin-commonjs
function createCommonjsPlugin(rnConfig) {
  let config = {
    ignoreGlobal: true,
    // namedExports: {
    //   'node_modules/react/react.js': [
    //     'Children', 'Component', 'PureComponent', 'createElement', 'cloneElement', 'isValidElement', 'PropTypes', 'createClass', 'createFactory', 'createMixin', 'DOM', 'version',
    //   ],
    // },
  };
  if (rnConfig.rollupProcessCommonjsPluginConfig) {
    config = rnConfig.rollupProcessCommonjsPluginConfig(config);
  }
  return commonjs(config);
}

/**
 * @return bundle 假的Bundle对象 包括 saveBundle getAssets
 */
function bundle(packagerInstance, requestOptions, outputOptions, config) {
  const {
    bundleOutput,
    dev,
    sourcemapOutput
  } = outputOptions;
  const assetsOutput = [];

  return createLABRNPlugin(packagerInstance, requestOptions, outputOptions, assetsOutput)
    .then((labRnPlugin) => {
      const rollupConfig = createRollupConfig(requestOptions, config, labRnPlugin);
      return rollup.rollup(rollupConfig);
    }).then((bundle) => {
      return {
        saveBundle() {
          return bundle.write({
            format: 'cjs',
            dest: bundleOutput,
            sourceMap: false,
          }).then(() => this);
        },

        getAssets() {
          return assetsOutput;
        },
      };
    });
}

module.exports = bundle;
