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

const createStrictShapeTypeChecker = require('react-native/Libraries/Utilities/createStrictShapeTypeChecker');
const flattenStyle = require('react-native/Libraries/StyleSheet/flattenStyle');

function StyleSheetPropType(shape: {
  [key: string]: ReactPropsCheckType,
}): ReactPropsCheckType {
  const shapePropType = createStrictShapeTypeChecker(shape);
  return function(props, propName, componentName, location?, ...rest) {
    let newProps = props;
    if (props[propName]) {
      // Just make a dummy prop object with only the flattened style
      newProps = {};
      newProps[propName] = flattenStyle(props[propName]);
    }
    return shapePropType(newProps, propName, componentName, location, ...rest);
  };
}

module.exports = StyleSheetPropType;
