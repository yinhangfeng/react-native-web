/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

'use strict';

const PropTypes = require('prop-types');

let PointPropType;
if (__DEV__) {
PointPropType = PropTypes.shape({
  x: PropTypes.number,
  y: PropTypes.number,
});
}

export type PointProp = $ReadOnly<{
  x: number,
  y: number,
}>;

module.exports = PointPropType;
