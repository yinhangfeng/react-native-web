/**
 * 通过 buildExternalHelpers.js 生成修改
 * 通过引用 @babel/runtime 而不是直接将 babelHelpers 放在这里可以与第三方库公用 @babel/runtime 代码
 * 完整 helpers 参考 https://github.com/babel/babel/blob/master/packages/babel-helpers/src/helpers.js
 * 目前与 Jul 7, 2018 c0c13ae30fc1209c543ac9a34ace2cad8035ec27 同步 可通过 History 查看是否增加了新的 helpers
 * 
 * 参考 rn polyfills/babelHelpers 注释掉了一些 需要时再加上去
 * NOTE: @babel/runtime/helpers 内部某些模块引用了 @babel/runtime/core-js/promise
 * 所以在 webpack 配置中将 core-js promise 指向了 bluebird
 */


'use strict';

window.babelHelpers = {
  typeof: require('@babel/runtime/helpers/typeof'),
  jsx: require('@babel/runtime/helpers/jsx'),
  // asyncIterator: require('@babel/runtime/helpers/asyncIterator'),
  // AwaitValue: require('@babel/runtime/helpers/AwaitValue'),
  // AsyncGenerator: require('@babel/runtime/helpers/AsyncGenerator'),
  // wrapAsyncGenerator: require('@babel/runtime/helpers/wrapAsyncGenerator'),
  // awaitAsyncGenerator: require('@babel/runtime/helpers/awaitAsyncGenerator'),
  // asyncGeneratorDelegate: require('@babel/runtime/helpers/asyncGeneratorDelegate'),
  asyncToGenerator: require('@babel/runtime/helpers/asyncToGenerator'),
  classCallCheck: require('@babel/runtime/helpers/classCallCheck'),
  createClass: require('@babel/runtime/helpers/createClass'),
  // defineEnumerableProperties: require('@babel/runtime/helpers/defineEnumerableProperties'),
  // defaults: require('@babel/runtime/helpers/defaults'),
  defineProperty: require('@babel/runtime/helpers/defineProperty'),
  extends: require('@babel/runtime/helpers/extends'),
  objectSpread: require('@babel/runtime/helpers/objectSpread'),
  inherits: require('@babel/runtime/helpers/inherits'),
  inheritsLoose: require('@babel/runtime/helpers/inheritsLoose'),
  getPrototypeOf: require('@babel/runtime/helpers/getPrototypeOf'),
  setPrototypeOf: require('@babel/runtime/helpers/setPrototypeOf'),
  construct: require('@babel/runtime/helpers/construct'),
  wrapNativeSuper: require('@babel/runtime/helpers/wrapNativeSuper'),
  // instanceof: require('@babel/runtime/helpers/instanceof'),
  interopRequireDefault: require('@babel/runtime/helpers/interopRequireDefault'),
  interopRequireWildcard: require('@babel/runtime/helpers/interopRequireWildcard'),
  // newArrowCheck: require('@babel/runtime/helpers/newArrowCheck'),
  // objectDestructuringEmpty: require('@babel/runtime/helpers/objectDestructuringEmpty'),
  // TODO beta.54 新增
  objectWithoutPropertiesLoose: require('@babel/runtime/helpers/objectWithoutPropertiesLoose'),
  objectWithoutProperties: require('@babel/runtime/helpers/objectWithoutProperties'),
  assertThisInitialized: require('@babel/runtime/helpers/assertThisInitialized'),
  possibleConstructorReturn: require('@babel/runtime/helpers/possibleConstructorReturn'),
  superPropBase: require('@babel/runtime/helpers/superPropBase'),
  get: require('@babel/runtime/helpers/get'),
  set: require('@babel/runtime/helpers/set'),
  taggedTemplateLiteral: require('@babel/runtime/helpers/taggedTemplateLiteral'),
  taggedTemplateLiteralLoose: require('@babel/runtime/helpers/taggedTemplateLiteralLoose'),
  // temporalRef: require('@babel/runtime/helpers/temporalRef'),
  // readOnlyError: require('@babel/runtime/helpers/readOnlyError'),
  // classNameTDZError: require('@babel/runtime/helpers/classNameTDZError'),
  // temporalUndefined: require('@babel/runtime/helpers/temporalUndefined'),
  slicedToArray: require('@babel/runtime/helpers/slicedToArray'),
  slicedToArrayLoose: require('@babel/runtime/helpers/slicedToArrayLoose'),
  toArray: require('@babel/runtime/helpers/toArray'),
  toConsumableArray: require('@babel/runtime/helpers/toConsumableArray'),
  arrayWithoutHoles: require('@babel/runtime/helpers/arrayWithoutHoles'),
  arrayWithHoles: require('@babel/runtime/helpers/arrayWithHoles'),
  iterableToArray: require('@babel/runtime/helpers/iterableToArray'),
  iterableToArrayLimit: require('@babel/runtime/helpers/iterableToArrayLimit'),
  iterableToArrayLimitLoose: require('@babel/runtime/helpers/iterableToArrayLimitLoose'),
  nonIterableSpread: require('@babel/runtime/helpers/nonIterableSpread'),
  nonIterableRest: require('@babel/runtime/helpers/nonIterableRest'),
  // skipFirstGeneratorNext: require('@babel/runtime/helpers/skipFirstGeneratorNext'),
  // toPropertyKey: require('@babel/runtime/helpers/toPropertyKey'),
  // initializerWarningHelper: require('@babel/runtime/helpers/initializerWarningHelper'),
  // initializerDefineProperty: require('@babel/runtime/helpers/initializerDefineProperty'),
  // applyDecoratedDescriptor: require('@babel/runtime/helpers/applyDecoratedDescriptor'),
  // classPrivateFieldLooseKey: require('@babel/runtime/helpers/classPrivateFieldLooseKey'),
  // classPrivateFieldLooseBase: require('@babel/runtime/helpers/classPrivateFieldLooseBase'),
  // classPrivateFieldGet: require('@babel/runtime/helpers/classPrivateFieldGet'),
  // classPrivateFieldSet: require('@babel/runtime/helpers/classPrivateFieldSet'),
};