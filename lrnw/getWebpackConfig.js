'use strict';

const { resolve } = require('path');
const webpack = require('webpack');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const autoprefixer = require('autoprefixer');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const RequireImageXAssetPlugin = require('./lrnw-image-loader').RequireImageXAssetPlugin;

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;

const LRNW_ASSETS_PATH = 'assets';

const lrnwRoot = resolve(__dirname, '..');

/**
 * https://webpack.js.org/configuration
 * https://github.com/umijs/umi/blob/master/packages/af-webpack/src/getConfig/index.js
 * https://github.com/facebook/create-react-app/blob/next/packages/react-scripts/config/webpack.config.prod.js
 * 
 * TODO react-native constant Platform ...
 * 
 * process.env: {
 *   LAB_ANALYZE,
 *   LAB_ANALYZE_PORT,
 *   LAB_MINIFY,
 * }
 */
module.exports = function({
  env,
  projectRoot,
  babelConfig,
  entryPath,
  outputPath,
  htmlTemplatePath,
  browsers,
  publicPath,
}) {
  const isDev = env === 'development';

  function projectPath(relativePath) {
    return resolve(projectRoot, relativePath);
  }

  function lrnwPath(relativePath) {
    return resolve(lrnwRoot, relativePath);
  }

  const cssOptions = {
    importLoaders: 1,
    ...(!isDev && {
      minimize: {
        // ref: https://github.com/umijs/umi/issues/164
        minifyFontValues: false,
      },
      sourceMap: true,
    }),
  };
  const cssModulesConfig = {
    modules: true,
    // TODO https://github.com/facebook/create-react-app/blob/next/packages/react-dev-utils/getCSSModuleLocalIdent.js
    localIdentName: isDev ? '[name]_[local]__[hash:base64:5]' : '[local]__[hash:base64:5]',
  };
  const postcssOptions = {
    // Necessary for external CSS imports to work
    // https://github.com/facebookincubator/create-react-app/issues/2677
    ident: 'postcss',
    plugins: () => [
      postcssFlexbugsFixes,
      autoprefixer({
        browsers,
        flexbox: 'no-2009',
      }),
    ],
  };
  function getCSSLoader({ modules, less } = {}) {
    const loaders = [
      isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          ...cssOptions,
          ...(modules && cssModulesConfig),
        },
      },
      {
        loader: 'postcss-loader',
        options: postcssOptions,
      },
    ];
    if (less) {
      loaders.push({
        loader: 'less-loader',
        options: {
          javascriptEnabled: true,
        },
      });
    }
    return loaders;
  }

  // js 和 css 采用不同的 hash 算法
  const jsHash = !isDev ? '.[chunkhash:8]' : '';
  const cssHash = !isDev ? '.[contenthash:8]' : '';

  const babelUse = [
    {
      loader: 'babel-loader',
      options: babelConfig,
    },
  ];

  const plugins = [
    new RequireImageXAssetPlugin({
      projectRoot,
    }),
    // TODO
    // isDev && new webpack.HotModuleReplacementPlugin(),
    // https://www.npmjs.com/package/react-dev-utils
    // isDev && new WatchMissingNodeModulesPlugin(projectPath('node_modules')),
    // https://github.com/jannesmeyer/system-bell-webpack-plugin
    // isDev && new SystemBellWebpackPlugin(),
    !isDev &&
      new CleanWebpackPlugin([outputPath], {
        root: projectRoot,
      }),
    !isDev &&
      new MiniCssExtractPlugin({
        filename: `css/[name]${cssHash}.css`,
        chunkFilename: `css/[id]${cssHash}.css`,
      }),

    // 只定义 process.env.NODE_ENV 的话在 webpack4 以上可以省略
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
      '__DEV__': isDev,
      'LRNW_ASSETS_PATH': JSON.stringify(LRNW_ASSETS_PATH),
    }),
    new HTMLWebpackPlugin({
      template: htmlTemplatePath,
    }),
    // https://github.com/Urthen/case-sensitive-paths-webpack-plugin
    // new CaseSensitivePathsPlugin(),
    // https://doc.webpack-china.org/plugins/ignore-plugin 忽略 moment 的本地化内容
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    publicPath && new CopyWebpackPlugin([
      {
        from: publicPath,
        to: outputPath,
        toType: 'dir',
      },
    ]),
    // https://github.com/webpack-contrib/webpack-bundle-analyzer
    process.env.LAB_ANALYZE &&
      new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
        analyzerMode: 'server',
        analyzerPort: process.env.LAB_ANALYZE_PORT || 8888,
        openAnalyzer: true,
      }),
  ].filter(Boolean);

  let minimize = !isDev;
  if (process.env.LAB_MINIFY != null) {
    if (process.env.LAB_MINIFY === 'false') {
      minimize = false;
    } else {
      minimize = Boolean(process.env.LAB_MINIFY);
    }
  }

  const config = {
    mode: isDev ? 'development' : 'production',
    entry: [lrnwPath('Libraries/lrnw/promise.js'), lrnwPath('Libraries/lrnw/polyfills.js'), entryPath],
    output: {
      path: outputPath,
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: isDev,
      filename: `js/[name]${jsHash}.js`,
      publicPath: '/',
      chunkFilename: `js/[name]${jsHash}.async.js`,
    },
    // 'source-map' 'eval-source-map'
    devtool: isDev ? 'source-map' : 'none',
    devServer: isDev
      ? {
          port: 9081,
        }
      : {},
    bail: !isDev,
    // devtool,
    resolve: {
      // modules,
      extensions: [
        '.web.js',
        '.web.jsx',
        // '.web.ts',
        // '.web.tsx',
        '.js',
        '.json',
        '.jsx',
        // '.ts',
        // '.tsx',
      ],
      alias: {
        'react-native': lrnwRoot,
        // promise 使用 bluebird 将对core-js promise 引用(目前在 @babel/runtime/helpers 内有)指向 bluebird 可能通过 alias 无法解决 需要 https://webpack.js.org/plugins/normal-module-replacement-plugin
        'core-js/library/fn/promise': 'bluebird/js/browser/bluebird.min',
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          // 排除不需要 transform 的大库
          exclude: /node_modules[\\\/](@babel|core-js|regenerator-runtime|bluebird|react|react-dom|lodash|lodash-es|@material-ui|jss)[\\\/]/,
          use: babelUse,
        },
        {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: getCSSLoader(),
        },
        {
          test: cssModuleRegex,
          use: getCSSLoader({
            modules: true,
          }),
        },
        {
          test: lessRegex,
          exclude: lessModuleRegex,
          use: getCSSLoader({
            less: true,
          }),
        },
        {
          test: lessModuleRegex,
          use: getCSSLoader({
            modules: true,
            less: true,
          }),
        },
        {
          test: /\.(bmp|gif|jpg|jpeg|png|webp)$/,
          loader: require.resolve('./lrnw-image-loader'),
          options: {
            name: `${LRNW_ASSETS_PATH}/[name].[hash:8].[ext]`,
          },
        },
        {
          exclude: [/\.html|ejs$/, /\.json$/, /\.(js|jsx|ts|tsx|mjs)$/, /\.(css|less|scss|sass)$/, /\.(bmp|gif|jpg|jpeg|png|webp)$/],
          loader: 'file-loader',
          options: {
            name: `${LRNW_ASSETS_PATH}/[name].[hash:8].[ext]`,
          },
        },
      ],
    },
    plugins,
    // externals: {},
    // node: {
    //   dgram: 'empty',
    //   fs: 'empty',
    //   net: 'empty',
    //   tls: 'empty',
    //   child_process: 'empty',
    // },
    performance: isDev
      ? {
          hints: false,
        }
      : undefined,
    // https://webpack.js.org/configuration/optimization/
    optimization: {
      minimize,
    },
  };

  return config;
};
