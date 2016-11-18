// Created by running:
var a = require('babel-core').buildExternalHelpers('_extends classCallCheck createClass createRawReactElement defineProperty get inherits  interopRequireDefault interopRequireWildcard objectWithoutProperties possibleConstructorReturn slicedToArray taggedTemplateLiteral toArray toConsumableArray typeof '.split(' '))
console.log(a);
// then replacing the `global` reference in the last line to also use `this`.
