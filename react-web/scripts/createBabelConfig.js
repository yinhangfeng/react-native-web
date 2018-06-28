'use strict';

/**
 * https://github.com/facebook/react-native/blob/master/babel-preset/configs/main.js
 * https://github.com/umijs/umi/blob/master/packages/babel-preset-umi/src/index.js
 * https://github.com/facebook/create-react-app/blob/next/packages/babel-preset-react-app/index.js
 * 
 * https://github.com/babel/babel/blob/master/packages/babel-preset-env/package.json
 * https://github.com/babel/babel/blob/master/packages/babel-preset-stage-3/package.json
 * https://github.com/babel/babel/blob/master/packages/babel-preset-stage-2/package.json
 * https://github.com/babel/babel/blob/master/packages/babel-preset-stage-1/package.json
 * https://github.com/babel/babel/blob/master/packages/babel-preset-stage-0/package.json
 * 
 * TODO https://github.com/jamiebuilds/babel-react-optimize
 * TODO https://github.com/facebook/react-native/blob/master/babel-preset/transforms/transform-symbol-member.js
 */
module.exports = function({ isDev, targets, browsers }) {
  return {
    presets: [
      [
        // Latest stable ECMAScript features
        // 包括的插件 https://github.com/babel/babel/blob/master/packages/babel-preset-env/data/plugins.json
        // 包括的 built-ins https://github.com/babel/babel/blob/master/packages/babel-preset-env/data/built-ins.json
        // 包括 transform-regenerator transform-async-to-generator
        // https://babeljs.io/docs/en/next/babel-preset-env.html
        require('@babel/preset-env').default,
        {
          // react-native plugin-transform-for-of plugin-transform-template-literals 使用了 loose
          // 如果对所有都 loose 可能有兼容性问题?
          loose: true,
          targets: targets || { browsers },
          // `entry` transforms `@babel/polyfill` into individual requires for
          // the targeted browsers. This is safer than `usage` which performs
          // static code analysis to determine what's required.
          // This is probably a fine default to help trim down bundles when
          // end-users inevitably import '@babel/polyfill'.
          // preset-env 的 useBuiltIns 不为 false 会给内部所有插件传递 useBuiltIns true
          useBuiltIns: 'entry',
          // Do not transform modules to CJS
          modules: false,
          exclude: [
            // promise 使用 bluebird
            'es6.promise',
            'es7.promise.finally',

            // 不常用或者可能会引起问题的 es6+ 特性
            'transform-typeof-symbol',
            // react-native 包括了这个插件
            'transform-unicode-regex',
            // react-native 包括了这个插件
            'transform-sticky-regex',
            'transform-object-super',
            'transform-new-target',
            'transform-modules-umd',
            'transform-modules-systemjs',
            'transform-modules-amd',
            // react-native 包括了这个插件
            'transform-literals',
            'transform-duplicate-keys',
          ],
        },
      ],
      [
        require('@babel/preset-react').default,
        {
          // Adds component stack to warning messages
          // Adds __self attribute to JSX which React will use for some warnings
          development: isDev,
          // Will use the native built-in instead of trying to polyfill
          // behavior for any plugins that require one.
          useBuiltIns: true,
        },
      ],
      [require('@babel/preset-flow').default],
    ],
    plugins: [
        // Necessary to include regardless of the environment because
        // in practice some other transforms (such as object-rest-spread)
        // don't work without it: https://github.com/babel/babel/issues/7215
        // TODO 上面的 BUG 还在?
        // require('@babel/plugin-transform-destructuring').default,
        // decorators 目前必须 legacy: true 需要保证在 plugin-proposal-class-properties 前面
        // https://babeljs.io/docs/en/next/babel-plugin-proposal-decorators.html
        // babel-preset-stage-2
        [
          require('@babel/plugin-proposal-decorators').default,
          {
            legacy: true
          }
        ],
        // class { handleClick = () => { } }
        // Enable loose mode to use assignment instead of defineProperty
        // See discussion in https://github.com/facebook/create-react-app/issues/4263
        // babel-preset-stage-3
        [
          require('@babel/plugin-proposal-class-properties').default,
          {
            loose: true,
          },
        ],
        // The following two plugins use Object.assign directly, instead of Babel's
        // extends helper. Note that this assumes `Object.assign` is available.
        // { ...todo, completed: true }
        // 虽然包括在 babel-preset-env 中 但需要开启 shippedProposals
        [
          require('@babel/plugin-proposal-object-rest-spread').default,
          {
            useBuiltIns: true,
          },
        ],
        // Polyfills the runtime needed for async/await and generators https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html
        [
          require('@babel/plugin-transform-runtime').default,
          {
            helpers: true,
            polyfill: false,
            regenerator: true,
          },
        ],
        // Adds syntax support for import()
        require('@babel/plugin-syntax-dynamic-import').default,

        // optimize react

        !isDev && [
          // Remove PropTypes from production build
          // TODO doNotCheckReactClass
          require('babel-plugin-transform-react-remove-prop-types').default,
          {
            removeImport: true,
          },
        ],
        !isDev && require('@babel/plugin-transform-react-constant-elements').default,
        !isDev && require('@babel/plugin-transform-react-inline-elements').default,

        // react-native

        // babel-preset-stage-1
        require('plugin-proposal-optional-chaining').default,
      ].filter(Boolean),
    babelrc: false,
  };
};
