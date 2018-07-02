'use strict';

const webpack = require('webpack');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const RequireImageXAssetPlugin = require('../lrnw-image-loader').RequireImageXAssetPlugin;
const { resolve } = require('path');

const createBabelConfig = require('./createBabelConfig');

const projectRoot = resolve(__dirname, '../../');

function projectPath(relativePath) {
  return resolve(projectRoot, relativePath);
}

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
// const sassRegex = /\.(scss|sass)$/;
// const sassModuleRegex = /\.module\.(scss|sass)$/;

const LRNW_ASSETS_PATH = 'assets';

// https://webpack.js.org/configuration
// https://github.com/umijs/umi/blob/master/packages/af-webpack/src/getConfig.js
// https://github.com/facebook/create-react-app/blob/next/packages/react-scripts/config/webpack.config.prod.js
module.exports = function({ env } = { env: 'development', }) {
  const isDev = env === 'development';

  // https://github.com/browserslist/browserslist
  let browsers;
  const LAB_BROWSERS = process.env.LAB_NEWEST_BROWSER;
  if (LAB_BROWSERS === 'latest' || (isDev && !LAB_BROWSERS)) {
    // dev 环境只兼容新浏览器 以方便调试 增加编译速度
    browsers = ['last 3 Chrome versions'];
  } if (LAB_BROWSERS === 'es6') {
    browsers = [
      'Chrome 53',
      'Safari 10',
    ];
  } else if (LAB_BROWSERS) {
    browsers = LAB_BROWSERS.split(',');
  } else {
    browsers = [
      'Chrome 45',
      'Safari 8',
    ];
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

  const outputPath = projectPath('build');

  // js 和 css 采用不同的 hash 算法
  const jsHash = !isDev ? '.[chunkhash:8]' : '';
  const cssHash = !isDev ? '.[contenthash:8]' : '';

  const babelUse = [
    {
      loader: 'babel-loader',
      options: createBabelConfig({
        isDev,
        browsers,
      }),
    },
  ];

  const plugins = [
    new RequireImageXAssetPlugin(),
    isDev && new webpack.HotModuleReplacementPlugin(),
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
      template: projectPath('Examples/index.html'),
    }),
    // https://github.com/Urthen/case-sensitive-paths-webpack-plugin
    // new CaseSensitivePathsPlugin(),
    // https://doc.webpack-china.org/plugins/ignore-plugin 忽略 moment 的本地化内容
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // TODO
    // new CopyWebpackPlugin([
    //   {
    //     from: projectPath('public'),
    //     to: outputPath,
    //     toType: 'dir',
    //   },
    // ]),
    // https://github.com/webpack-contrib/webpack-bundle-analyzer
    process.env.LAB_ANALYZE &&
      new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
        analyzerMode: 'server',
        analyzerPort: process.env.LAB_ANALYZE_PORT || 8888,
        openAnalyzer: true,
      }),
  ].filter(Boolean);

  const config = {
    mode: isDev ? 'development' : 'production',
    entry: [projectPath('Libraries/lrnw/polyfills.web.js'), projectPath('Examples/index.web.js')],
    output: {
      path: outputPath,
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: isDev,
      filename: `js/[name]${jsHash}.js`,
      publicPath: '/',
      chunkFilename: `js/[name]${jsHash}.async.js`,
    },
    // 'source-map' 'eval-source-map'
    devtool: !isDev ? 'none' : (process.env.LAB_BUILD_DEV ? 'source-map' : 'source-map'),
    devServer: isDev
      ? {
          port: 9007,
          // proxy: {
          //   '/api': 'http://localhost:8000',
          // },
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
        'react-native': projectRoot,
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          // 排除不需要 transform 的大库
          exclude: /node_modules[\\\/](?:@babel|core-js|regenerator-runtime|bluebird|react|react-dom|lodash|lodash-es|@material-ui|jss)[\\\/]/,
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
          loader: require.resolve('../lrnw-image-loader'),
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
  };

  return config;
};
