/**
 * 使用rollup bundle
 * uglifyjs压缩
 * 并保存
 */
'use strict';

const fs = require('fs');
const path = require('path');
const rollup = require('rollup');
const json = require('rollup-plugin-json');
const babel = require('rollup-plugin-babel');
// const babelrc = require('babelrc-rollup');
const commonjs = require('rollup-plugin-commonjs');
const LABRNPlugin = require('./LABRNRollupPlugin');
const transformer = require('../../packager/transformer');

const prelude = require.resolve('../../packager/react-packager/src/Resolver/polyfills/prelude.js');
const prelude_dev = require.resolve('../../packager/react-packager/src/Resolver/polyfills/prelude_dev.js');

const polyfills = [
  require.resolve('../../packager/react-packager/src/Resolver/polyfills/polyfills.js'),
  require.resolve('../../packager/react-packager/src/Resolver/polyfills/error-guard.js'),
  require.resolve('../../packager/react-packager/src/Resolver/polyfills/Number.es6.js'),
  require.resolve('../../packager/react-packager/src/Resolver/polyfills/String.prototype.es6.js'),
  require.resolve('../../packager/react-packager/src/Resolver/polyfills/Array.prototype.es6.js'),
  require.resolve('../../packager/react-packager/src/Resolver/polyfills/Array.es6.js'),
  require.resolve('../../packager/react-packager/src/Resolver/polyfills/Object.es7.js'),
  require.resolve('../../packager/react-packager/src/Resolver/polyfills/babelHelpers.js'),

  // 把InitializeCore 当做polyfill
  require.resolve('../../Libraries/Core/InitializeCore.web.js'),
];

function getRollupConfig(requestOptions, rnConfig, labRnPlugin) {

  let rollupConfig;

  const projectRoots = rnConfig.getProjectRoots();
  let projectRollupConfigPath;
  if (projectRoots && projectRoots.length > 0) {
    projectRollupConfigPath = path.resolve(projectRoots[0], 'lab-rollup.config.js');
  }

  let pluginsConfig = {};
  if (projectRollupConfigPath && fs.existsSync(projectRollupConfigPath)) {
    rollupConfig = Object.assign({}, require(projectRollupConfigPath));
    if (rollupConfig.pluginsConfig) {
      pluginsConfig = rollupConfig.pluginsConfig;
      delete rollupConfig.pluginsConfig;
    }
  } else {
    rollupConfig = {};
  }

  // 将entry 转换为绝对路径 方便labRnPlugin处理
  rollupConfig.entry = path.resolve(requestOptions.entryFile);
  // 'use strict' 会在bundle外部拼接
  rollupConfig.useStrict = false;

  const babelConfig = buildBabelConfig(projectRoots);

  const innerPlugins = [
    labRnPlugin,
    json(pluginsConfig.json),
    babel(Object.assign({
      comments: false,
      // compact: true,
      exclude: ['**/react-packager/src/Resolver/polyfills/babelHelpers*'],
      externalHelpers: true,
    }, babelConfig)),
    commonjs(Object.assign({
      ignoreGlobal: true,
      namedExports: {
        'node_modules/react/react.js': [
          'Children', 'Component', 'PureComponent', 'createElement', 'cloneElement', 'isValidElement', 'PropTypes', 'createClass', 'createFactory', 'createMixin', 'DOM', 'version',
        ],
      },
    }, pluginsConfig.commonjs)),
  ];

  // TODO 支持plugin 排序配置?
  let plugins = innerPlugins;
  if (rollupConfig.plugins) {
    plugins = innerPlugins.concat(rollupConfig.plugins);
  }
  rollupConfig.plugins = plugins;

  return rollupConfig;
}

function buildBabelConfig(projectRoots) {
  let projectBabelRCPath;
  if (projectRoots && projectRoots.length > 0) {
    projectBabelRCPath = path.resolve(projectRoots[0], 'lab-rollup.config.js');
  }
  if (!projectBabelRCPath || !fs.existsSync(projectBabelRCPath)) {
    projectBabelRCPath = path.resolve(__dirname, '../../packager/react-packager/rn-babelrc.rollup.json');
  }

  return JSON.parse(fs.readFileSync(projectBabelRCPath, { encoding: 'utf8' }));
}

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
    // bundleEncoding,
    dev,
    sourcemapOutput
  } = outputOptions;
  const assetsOutput = [];

  let a = {
    ...requestOptions,
    isolateModuleIDs: true,
  };

  return packagerInstance.newResolutionRequest({
    ...requestOptions,
    isolateModuleIDs: true,
  }).then((resolutionRequest) => {
    let pfs = dev ? [prelude_dev] : [prelude];
    pfs = pfs.concat(polyfills);
    const labRnPlugin = LABRNPlugin({
      resolutionRequest,
      bundler: packagerInstance.getBundler(),
      dev,
      assetsOutput,
      platform: requestOptions.platform,
      polyfills: pfs,
    });
    const rollupConfig = getRollupConfig(requestOptions, config, labRnPlugin);
    return rollup.rollup(rollupConfig);
  }).then((bundle) => {
    if (shouldClosePackager) {
      packagerInstance.end();
    }

    // const result = bundle.generate({
    //   format: 'cjs',
    // });

    return bundle.write({
      format: 'cjs',
      dest: bundleOutput,
      sourceMap: false,
    });
  }).then(() => {
    return {
      getAssets() { return assetsOutput; },
    };
  });
}

module.exports = bundle;
