/**
 * rollup使用的 babelConfig 与babel-preset-react-native基本一致
 */
'use strict';

const resolvePlugins = require('babel-preset-react-native/lib/resolvePlugins');

function getPreset({
  es6,
  dev,
}) {
  const plugins = [
    'syntax-class-properties',
    'syntax-trailing-function-commas',
    'transform-class-properties',
    'transform-es2015-block-scoping',
    'transform-es2015-computed-properties',
    'transform-es2015-destructuring',
    'transform-es2015-function-name',
    'transform-es2015-literals',
    'transform-es2015-parameters',
    // 'transform-es2015-shorthand-properties',
    'transform-flow-strip-types',
    'transform-react-jsx',
    'transform-regenerator',
    // rollup 不需要
    // [
    //   'transform-es2015-modules-commonjs',
    //   {strict: false, allowTopLevelThis: true},
    // ]
    'syntax-async-functions',
    // 'transform-es2015-classes',
    'transform-es2015-arrow-functions',
    'check-es2015-constants',
    'transform-es2015-spread',
    'transform-object-rest-spread',
    'transform-es2015-template-literals',
    // polyfills 已经提供
    // 'transform-object-assign',
    'transform-es2015-for-of',
    // require('../transforms/transform-symbol-member'),
    'transform-react-display-name',
    // require('../transforms/transform-dynamic-import'),
    'external-helpers',
  ];
  if (!es6) {
    plugins.push('transform-es2015-shorthand-properties');
    plugins.push('transform-es2015-classes');
  }
  if (dev) {
    plugins.push('transform-react-jsx-source');
  }
  return {
    comments: false,
    compact: true,
    plugins: resolvePlugins(plugins),
    // env: {
    //   development: {
    //     plugins: resolvePlugins(['transform-react-jsx-source']),
    //   },
    // },
    // retainLines: true,
    externalHelpers: true,
  };
}

module.exports = getPreset;