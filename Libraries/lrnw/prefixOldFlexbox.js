'use strict';

// 处理flex 的向下兼容
// TODO flexboxSpec 貌似UC浏览器不能这么判断? https://github.com/taobaofed/react-web/blob/master/Libraries/StyleSheet/extendProperties.web.js (FIXME: UCBrowser is cheat)
// TODO react-native-web 处理css兼容 使用inline-style-prefixer 但 这个库会生成fallback values数组，而React@15开始不兼容，等待更好的React用的css兼容库
// https://github.com/necolas/react-native-web/blob/master/src/apis/StyleSheet/processVendorPrefixes.js

let flexboxProperties = {
  flex: 'WebkitBoxFlex',
  order: 'WebkitBoxOrdinalGroup',
  // https://github.com/postcss/autoprefixer/blob/master/lib/hacks/flex-direction.coffee
  flexDirection: 'WebkitBoxOrient',
  // https://github.com/postcss/autoprefixer/blob/master/lib/hacks/align-items.coffee
  alignItems: 'WebkitBoxAlign',
  // https://github.com/postcss/autoprefixer/blob/master/lib/hacks/justify-content.coffee
  justifyContent: 'WebkitBoxPack',
  flexWrap: null,
  alignSelf: null,
};

let flexboxSpec;
let prefixOldFlexbox;
let builtinStyle = document.createElement('div').style;
if ('alignSelf' in builtinStyle) {
  flexboxSpec = 'final';
  prefixOldFlexbox = function(property, value, result) {
    result[property] = value;
  };
} else {
  // XXX 临时措施 对不支持flexGrow 的浏览器，将flexGrow 转为flex TODO
  flexboxProperties.flexGrow = 'WebkitBoxFlex';
  if ('WebkitAlignSelf' in builtinStyle) {
    flexboxSpec = 'finalVendor';
    let supportFlexGrow = 'WebkitFlexGrow' in builtinStyle;
    const getVendorPropertyName = require('domkit/getVendorPropertyName');
    prefixOldFlexbox = function(property, value, result) {
      if (property === 'flexGrow' && !supportFlexGrow) {
        result[getVendorPropertyName('flex')] = value;
      } else {
        result[getVendorPropertyName(property)] = value;
      }
    };
  } else {
    flexboxSpec = '2009';
    const oldFlexboxValues = {
      'flex-end': 'end',
      'flex-start': 'start',
      'space-between': 'justify',
      'space-around': 'distribute',
    };
    // TODO 遇到flexBasis 0 可以使用width 0% height 0% 来兼容
    // 但由于这里无法确认容器的flex 方向 所以可以给父容器加上表示方向的 class 子容器加上表示 flexBasis 的 class 来实现
    // http://taobaofed.org/blog/2015/11/11/flexbox-in-mobile-web/
    prefixOldFlexbox = function(property, value, result) {
      let oldProperty = flexboxProperties[property] || property;
      let oldValue = oldFlexboxValues[value] || value;
      if (oldProperty === 'WebkitBoxOrient') {
        // boxOrient
        if (value.indexOf('row') != -1) {
          oldValue = 'horizontal';
        } else {
          oldValue = 'vertical';
        }
        // boxDirection
        if (value.indexOf('reverse') != -1) {
          result.WebkitBoxDirection = 'reverse';
        } else {
          result.WebkitBoxDirection = 'normal';
        }
      }
      return result[oldProperty] = oldValue;
    };
  }
}
builtinStyle = null;

module.exports = {
  prefixOldFlexbox,
  flexboxProperties,
  flexboxSpec,
};
