'use strict';

const getVendorPropertyName = require('domkit/getVendorPropertyName');

const flattenStyle = require('flattenStyle');
const {
  convertTransform,
  convertTransformMatrix,
} = require('./convertTransform');
const {
  prefixOldFlexbox,
  flexboxProperties,
} = require('./prefixOldFlexbox');

//将react-native 的style转换为reactjs 支持的inline style,并做适当的浏览器兼容

const boxProperties = {
  paddingHorizontal: true,
  paddingVertical: true,
  marginHorizontal: true,
  marginVertical: true,
};

function processBoxProperties(property, value, result) {
  switch (property) {
    case 'paddingHorizontal':
      result['paddingLeft'] = result['paddingRight'] = value;
      break;
    case 'paddingVertical':
      result['paddingTop'] = result['paddingBottom'] = value;
      break;
    case 'marginHorizontal':
      result['marginLeft'] = result['marginRight'] = value;
      break;
    case 'marginVertical':
      result['marginTop'] = result['marginBottom'] = value;
      break;
  }
}

// some number that react not auto add px
// TODO 是否有必要，还有其它属性么?
const numberProperties = {
  lineHeight: true,
};

function normalizeValue(property, value) {
  if (numberProperties[property] && typeof value === 'number') {
    value = `${value}px`;
  }
  return value;
}

module.exports = function(style) {
  style = flattenStyle(style);
  let result = {};
  let property;
  let value;

  for (property in style) {
    value = style[property];
    if (value == null) {
      continue;
    }

    if (property in flexboxProperties) {
      //TODO React Native treats `flex:1` like `flex:1 1 auto`? https://github.com/necolas/react-native-web/blob/master/src/apis/StyleSheet/expandStyle.js
      prefixOldFlexbox(property, value, result);
    } else if (boxProperties[property]) {
      //paddingHorizontal 优先级高于paddingLeft paddingRight ...
      processBoxProperties(property, value, result);
    } else {
      if (property === 'transform') {
        // 处理react native 的transform格式
        value = convertTransform(value);
      } else if (property === 'transformMatrix') {
        property = transform;
        value = convertTransformMatrix(value);
      } else {
        value = normalizeValue(property, value);
      }
      result[getVendorPropertyName(property)] = value;
    }
  }

  // TODO processTextShadow https://github.com/necolas/react-native-web/blob/master/src/apis/StyleSheet/processTextShadow.js
  // TODO 对新的浏览器 flex 解析成flexGrow flexShrink flexBasis 的组合

  return result;
};
