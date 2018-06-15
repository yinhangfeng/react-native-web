/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

module.exports = function makeImportPatch(packageImportPath) {
  return {
    // LAB modify
    //pattern: 'import com.facebook.react.ReactApplication;',
    pattern: /(import com\.facebook\.react\.shell\.MainReactPackage;)|(import com\.facebook\.react\.ReactApplication;)/,
    patch: '\n' + packageImportPath,
  };
};
