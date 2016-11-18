'use strict';

// 废弃 已使用extraNodeModules实现

const packagerTransformer = require('../../packager/transformer');

const PACKAGE_ALIAS = Object.create(null, {
  'react-native': {
    value: 'lab-react-native-web',
  },
});

const IMPORT_RE = /(\bimport\s+(?:[^'"]+\s+from\s+)??['"])([^\.\/'"][^\/'"]*)([^'"]*['"])/g;
const EXPORT_RE = /(\bexport\s+(?:[^'"]+\s+from\s+)??['"])([^\.\/'"][^\/'"]*)([^'"]*['"])/g;
const REQUIRE_RE = /(\brequire\s*?\(\s*?['"])([^\.\/'"][^\/'"]*)([^'"]*['"]\s*?\))/g;

function replaceAlias(_0, _1, _2, _3) {
  let alias = PACKAGE_ALIAS[_2];
  return alias ? _1 + alias + _3 : _0;
}

function transform(src, filename, options) {
  //替换代码中指定依赖为别名
  src = src
    .replace(IMPORT_RE, replaceAlias)
    .replace(EXPORT_RE, replaceAlias)
    .replace(REQUIRE_RE, replaceAlias);

  //交给原transformer处理
  return packagerTransformer.transform(src, filename, options);
}

module.exports = function(data, callback) {
  let result;
  try {
    result = transform(data.sourceCode, data.filename, data.options);
  } catch (e) {
    callback(e);
    return;
  }

  callback(null, result);
};

// export for use in jest
module.exports.transform = transform;
