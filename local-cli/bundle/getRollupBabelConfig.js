/**
 * rollup使用的 babelConfig 与babel-preset-react-native基本一致
 */
'use strict';

// TODO 使用@babel/plugin-transform-runtime babel-plugin-jsx-pragmatic
// 但需要判断 当前文件是 require 还是 import 决定插入的代码 而且如果createElement 插入 require 的话也不利于压缩
const TRANSFORM_REACT_JSX_PRAGMA = '__react_create_element';

function requirePlugin(name) {
  const plugin = require(`babel-plugin-${name}`);
  return plugin.default ? plugin.default : plugin;
}

function getPreset({ es6, dev }) {
  const plugins = [
    requirePlugin('syntax-class-properties'),
    requirePlugin('syntax-trailing-function-commas'),
    // use `this.foo = bar` instead of `this.defineProperty('foo', ...)`
    // (Makes the properties enumerable)
    [requirePlugin('transform-class-properties'), { loose: true }],
    requirePlugin('transform-es2015-block-scoping'),
    requirePlugin('transform-es2015-computed-properties'),
    requirePlugin('transform-es2015-destructuring'),
    requirePlugin('transform-es2015-function-name'),
    requirePlugin('transform-es2015-literals'),
    requirePlugin('transform-es2015-parameters'),
    // requirePlugin('transform-es2015-shorthand-properties'),
    requirePlugin('transform-flow-strip-types'),
    [
      requirePlugin('transform-react-jsx'),
      {
        pragma: TRANSFORM_REACT_JSX_PRAGMA,
        useBuiltIns: true,
      }
    ],
    requirePlugin('transform-regenerator'),
    // rollup 不需要
    // [
    //   requirePlugin('transform-es2015-modules-commonjs'),
    //   {strict: false, allowTopLevelThis: true},
    // ]
    requirePlugin('syntax-async-functions'),
    // 'transform-es2015-classes',
    requirePlugin('transform-es2015-arrow-functions'),
    requirePlugin('check-es2015-constants'),
    requirePlugin('transform-es2015-spread'),
    requirePlugin('transform-object-rest-spread'),
    [
      requirePlugin('transform-es2015-template-literals'),
      { loose: true }, // dont 'a'.concat('b'), just use 'a'+'b'
    ],
    // polyfills 已经提供
    // 'transform-object-assign',
    [requirePlugin('transform-es2015-for-of'), { loose: true }],
    // require('../transforms/transform-symbol-member'), //TODO
    requirePlugin('transform-react-display-name'),
    // require('../transforms/transform-dynamic-import'),

    // 'transform-runtime',
    requirePlugin('external-helpers'),
    // [
    //   'babel-plugin-jsx-pragmatic',
    //   {
    //     module: 'react',
    //     import: TRANSFORM_REACT_JSX_PRAGMA,
    //     export: 'createElement',
    //   },
    // ],
  ];

  if (!dev) {
    plugins.push([
      requirePlugin('transform-react-remove-prop-types'),
      {
        doNotCheckReactClass: true,
      }
    ]);
  }
  if (!es6) {
    plugins.push(requirePlugin('transform-es2015-shorthand-properties'));
    plugins.push(requirePlugin('transform-es2015-classes'));
  }
  if (dev) {
    plugins.push(requirePlugin('transform-react-jsx-source'));
  }
  return {
    comments: false,
    compact: true,
    plugins,
    retainLines: true,
    externalHelpers: true,
    // runtimeHelpers: true,
  };
}

module.exports = getPreset;
