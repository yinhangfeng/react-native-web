'use strict';

const fs = require('fs');
const path = require('path');
const rollup = require('rollup');
const json = require('rollup-plugin-json');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
// const uglify = require('rollup-plugin-uglify');
const uglify = require('./UglifyRollupPlugin');
const LABRNPlugin = require('./LABRNRollupPlugin');
const RNInlinePlugin = require('./RNInlineRollupPlugin');
const Server = require('metro-bundler/src/Server');
const merge = require('lodash/merge');

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
];

const runBeforeMainModule = [
  require.resolve('../../Libraries/Core/InitializeCore.web.js'),
  require.resolve('./rollupRunBeforeMainModule.js'),
];

function createLABRNPlugin(packagerInstance, options, assetsOutput) {
  return packagerInstance.newBundleSession({
    // 参数参考 metro-bundler/src/shared/bundle buildBundle
    ...Server.DEFAULT_BUNDLE_OPTIONS,
    ...options.requestOptions,
    isolateModuleIDs: true,
  }).then((bundleSession) => {
    let pfs = options.dev ? [prelude_dev] : [prelude];
    pfs = pfs.concat(polyfills);
    return LABRNPlugin({
      bundleSession,
      dev: options.dev,
      assetsOutput,
      platform: options.platform,
      polyfills: pfs,
      runBeforeMainModule,
    });
  });
}

function createRollupConfig(options, rnConfig, labRnPlugin) {
  let rollupConfig = {
    // 将input 转换为绝对路径 方便labRnPlugin处理
    input: path.resolve(options.entryFile),
    // 去除每个模块的 'use strict' 会在bundle外部拼接
    // strict: false,
    plugins: [
      labRnPlugin,
      createJsonPlugin(rnConfig, options),
      createBabelPlugin(rnConfig, options),
      !options.dev && createRNInlinePlugin(rnConfig, options),
      // TODO metro-bundler inline constantFolding JSTransformer/worker/index transformCode
      !options.dev && createReplacePlugin(rnConfig, options),
      createCommonjsPlugin(rnConfig, options),
      !options.dev && (options.rollupMinifyEngine == 'uglify' ? createUglifyPlugin(rnConfig, options) : createClosurePlugin(rnConfig, options)),
    ],
  };

  if (rnConfig.rollupProcessConfig) {
    rollupConfig = rnConfig.rollupProcessConfig(rollupConfig);
  }

  return rollupConfig;
}

// https://github.com/rollup/rollup-plugin-json
function createJsonPlugin(rnConfig, options) {
  let config;
  if (rnConfig.rollupProcessJsonPluginConfig) {
    config = rnConfig.rollupProcessJsonPluginConfig(config, options);
  }
  return json(config);
}

// https://github.com/rollup/rollup-plugin-babel
function createBabelPlugin(rnConfig, options) {
  const getRollupBabelConfig = require('./getRollupBabelConfig');
  const babelConfig = getRollupBabelConfig({
    es6: options.babelPresetTarget === 'es6',
    dev: options.dev,
  });

  let config = merge(
    {},
    babelConfig,
    {
      exclude: ['**/Libraries/polyfills/babelHelpers*'],
      babelrc: false,
    }
  );

  if (rnConfig.rollupProcessBabelPluginConfig) {
    config = rnConfig.rollupProcessBabelPluginConfig(config, options);
  }
  return babel(config);
}

function createRNInlinePlugin(rnConfig, options) {
  let config = {
    dev: options.dev,
    platform: options.platform,
  };
  if (rnConfig.rollupProcessRNInlinePluginConfig) {
    config = rnConfig.rollupProcessRNInlinePluginConfig(config, options);
  }
  return RNInlinePlugin(config);
}

// https://github.com/rollup/rollup-plugin-replace
function createReplacePlugin(rnConfig, options) {
  let config = {
    __DEV__: 'false',
    'process.env.NODE_ENV': "'production'",
  };
  if (rnConfig.rollupProcessReplacePluginConfig) {
    config = rnConfig.rollupProcessReplacePluginConfig(config, options);
  }
  return replace(config);
}

// https://github.com/rollup/rollup-plugin-commonjs
function createCommonjsPlugin(rnConfig, options) {
  let config = {
    ignoreGlobal: true,
    namedExports: {
      'node_modules/react/index.js': [
        'Children', 'Component', 'PureComponent', 'unstable_AsyncComponent', 'createElement', 'cloneElement', 'isValidElement', 'createFactory', 'version', '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
      ],
    },
  };
  if (rnConfig.rollupProcessCommonjsPluginConfig) {
    config = rnConfig.rollupProcessCommonjsPluginConfig(config, options);
  }
  return commonjs(config);
}

// https://github.com/camelaissani/rollup-plugin-closure-compiler-js
function createClosurePlugin(rnConfig, options) {
  const closure = require('rollup-plugin-closure-compiler-js');
  // 配置来自react https://github.com/facebook/react/blob/master/scripts/rollup/build.js
  let config = {
    compilationLevel: 'SIMPLE',
    languageIn: 'ECMASCRIPT5_STRICT',
    languageOut: 'ECMASCRIPT5_STRICT',
    env: 'CUSTOM',
    warningLevel: 'QUIET',
    applyInputSourceMaps: false,
    useTypesForOptimization: false,
    processCommonJsModules: false,
    assumeFunctionWrapper: true,
    // renaming: false,
  };
  if (rnConfig.rollupProcessClosurePluginConfig) {
    config = rnConfig.rollupProcessClosurePluginConfig(config, options);
  }
  return closure(config);
}

// https://github.com/TrySound/rollup-plugin-uglify
function createUglifyPlugin(rnConfig, options) {
  // 配置来自react https://github.com/facebook/react/blob/master/scripts/rollup/build.js
  let config = {
    toplevel: true,
    compress: {
      drop_console: true,
      // pure_funcs: [ 'Object.freeze' ], // 用于压缩rollup 转换结果中的 es module Object.freeze 可能会出问题
      pure_getters: true, // 可能会出问题
    },
    mangle: {
      eval: true,
      toplevel: true,
    },
  };
  if (rnConfig.rollupProcessUglifyPluginConfig) {
    config = rnConfig.rollupProcessUglifyPluginConfig(config, options);
  }
  return uglify(config);
}

/**
 * @return bundle 假的Bundle对象 包括 saveBundle getAssets
 */
function bundle(packagerInstance, requestOptions, args, rnConfig) {
  const options = {
    ...args,
    ...requestOptions,
    requestOptions,
  };

  const assetsOutput = [];
  return createLABRNPlugin(packagerInstance, options, assetsOutput)
    .then((labRnPlugin) => {
      const rollupConfig = createRollupConfig(options, rnConfig, labRnPlugin);
      return rollup.rollup(rollupConfig);
    }).then((bundle) => {
      return {
        saveBundle({
          bundleOutput,
        }) {
          let bundleOutputOptions = {
            format: 'cjs',
            file: bundleOutput,
            sourcemap: false,
            interop: false,
          };
          if (rnConfig.rollupProcessOutputConfig) {
            bundleOutputOptions = rnConfig.rollupProcessOutputConfig(bundleOutputOptions);
          }
          return bundle.write(bundleOutputOptions).then(() => this);
        },

        getAssets() {
          return assetsOutput;
        },
      };
    });
}

module.exports = bundle;
