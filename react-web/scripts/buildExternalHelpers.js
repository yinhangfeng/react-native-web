'use strict';

const babelCore = require('@babel/core');
const code = babelCore.buildExternalHelpers();

console.log(code);

const imports = [];
const helpers = ['window.babelHelpers = {'];
code.replace(/\n\s\sbabelHelpers\.(\S+)\s=.+;/g, (match, helperName) => {
  // imports.push(`import ${helperName} from '@babel/runtime/helpers/${helperName}';`);
  helpers.push(`  ${helperName}: require('@babel/runtime/helpers/${helperName}'),`);
  return match;
});
helpers.push('};');

console.log(imports.concat(helpers).join('\n'));