/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule StyleSheetPropType
 * @flow
 */
'use strict';

var PropTypes = require('prop-types');

function StyleSheetPropType(
  shape: {[key: string]: ReactPropsCheckType}
): ReactPropsCheckType {
  //RW web环境不检查style了 1.web调试比较方便，2.可节省性能消耗 3.可能需要设置一些react-native 不支持的属性
  return PropTypes.any;
}

module.exports = StyleSheetPropType;
