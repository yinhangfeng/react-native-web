'use strict';

const { plugin } = require('metro-bundler/src/JSTransformer/worker/inline');
const babel = require('babel-core');

/**
 * 
 * @param {Object} options {
 *   dev,
 *   platform,
 * }
 */
module.exports = function RNInline(options) {

  return {
    name: 'RNInline',

    transform(source, id) {
      const babelOptions = {
        filename: id,
        plugins: [[plugin, options]],
        sourceMaps: true,
        sourceFileName: id,
        babelrc: false,
        compact: true,
      };
    
      const result = babel.transform(source, babelOptions);
      return {
        code: result.code,
        map: result.map,
      };
    },
  };
}