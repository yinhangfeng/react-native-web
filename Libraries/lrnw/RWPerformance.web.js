/**
 * @providesModule RWPerformance
 */
'use strict';

const bowser = require('bowser');
const prefixOldFlexbox = require('./prefixOldFlexbox');

const LOW = 1;
const MEDIUM = 5;
const HEIGH = 10;

let level = MEDIUM;
if (prefixOldFlexbox.flexboxSpec === 'final') {
  if (bowser.chrome && bowser.compareVersions([bowser.version, '47']) >= 0) {
    level = 7;
  } else if (bowser.android) {
    if (bowser.compareVersions([bowser.osversion, '5']) >= 0) {
      level = 7;
    } else if (bowser.compareVersions([bowser.osversion, '4.4']) >= 0) {
      level = MEDIUM;
    } else {
      level = LOW;
    }
  } else if (bowser.ios) {
    level = 7;
  }
} else if (prefixOldFlexbox.flexboxSpec === 'finalVendor') {
  level = 4;
} else {
  level = LOW;
}

/**
 * 性能level 范围 [1,10]
 * 暂时使用flexboxSpec 来判断
 */
module.exports = {
  LOW,
  MEDIUM,
  HEIGH,
  level,
  bowser,
};
