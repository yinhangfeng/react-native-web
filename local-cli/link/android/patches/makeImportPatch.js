module.exports = function makeImportPatch(packageImportPath) {
  return {
    // LAB modify
    //pattern: 'import com.facebook.react.ReactApplication;',
    pattern: /(import com\.facebook\.react\.shell\.MainReactPackage;)|(import com\.facebook\.react\.ReactApplication;)/,
    patch: '\n' + packageImportPath,
  };
};
