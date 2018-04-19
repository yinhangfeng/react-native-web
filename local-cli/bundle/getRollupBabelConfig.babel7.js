/**
 * rollup使用的 babelConfig 与babel-preset-react-native基本一致
 */
'use strict';

const TRANSFORM_REACT_JSX_PRAGMA = '__react_create_element';

function getPreset({ es6, dev }) {
  const plugins = [
    ['@babel/plugin-transform-block-scoping'],
    // the flow strip types plugin must go BEFORE class properties!
    // there'll be a test case that fails if you don't.
    ['@babel/plugin-transform-flow-strip-types'],
    [
      '@babel/plugin-proposal-class-properties',
      // use `this.foo = bar` instead of `this.defineProperty('foo', ...)`
      // (Makes the properties enumerable)
      { loose: true },
    ],
    ['@babel/plugin-transform-computed-properties'],
    ['@babel/plugin-transform-destructuring'],
    ['@babel/plugin-transform-function-name'],
    ['@babel/plugin-transform-literals'],
    ['@babel/plugin-transform-parameters'],
    // ['@babel/plugin-transform-shorthand-properties'],
    [
      '@babel/plugin-transform-react-jsx',
      {
        pragma: TRANSFORM_REACT_JSX_PRAGMA,
        useBuiltIns: true,
      },
    ],
    ['@babel/plugin-transform-regenerator'],
    ['@babel/plugin-transform-sticky-regex'],
    ['@babel/plugin-transform-unicode-regex'],
    // [
    //   '@babel/plugin-transform-modules-commonjs',
    //   {
    //     strict: false,
    //     strictMode : false, // prevent "use strict" injections
    //     allowTopLevelThis: true, // dont rewrite global `this` -> `undefined`
    //   },
    // ],
    ['@babel/plugin-transform-arrow-functions'],
    // ['@babel/plugin-transform-classes'],
    ['@babel/plugin-transform-for-of', { loose: true }],
    ['@babel/plugin-transform-spread'],
    [
      '@babel/plugin-transform-template-literals',
      { loose: true }, // dont 'a'.concat('b'), just use 'a'+'b'
    ],
    ['@babel/plugin-transform-exponentiation-operator'],
    // polyfills 已经提供
    // ['@babel/plugin-transform-object-assign'],
    ['@babel/plugin-proposal-object-rest-spread'],
    ['@babel/plugin-transform-react-display-name'],
    // ['@babel/plugin-transform-react-jsx-source')],
    // ['../transforms/transform-symbol-member')], //TODO

    ['@babel/plugin-transform-runtime'],
    [
      'babel-plugin-jsx-pragmatic',
      {
        module: 'react',
        import: TRANSFORM_REACT_JSX_PRAGMA,
        export: 'createElement',
      },
    ],
  ];

  if (!es6) {
    plugins.push(['@babel/plugin-transform-shorthand-properties']);
    plugins.push(['@babel/plugin-transform-classes']);
  }
  if (dev) {
    plugins.push(['@babel/plugin-transform-react-jsx-source']);
  }
  return {
    comments: false,
    compact: true,
    plugins,
    // retainLines: true,
    // externalHelpers: true, // 使用@babel/plugin-transform-runtime
  };
}

module.exports = getPreset;
