/**
 */
'use strict';

const flatten = require('flattenStyle');

const hairlineWidth = 1; //网页环境直接用1px

const absoluteFillObject = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};
const absoluteFill = absoluteFillObject;

module.exports = {
  hairlineWidth,

  flatten,

  absoluteFill,

  absoluteFillObject,

  create(obj: {[key: string]: any}): {[key: string]: number} {
    return obj;
  },
};
