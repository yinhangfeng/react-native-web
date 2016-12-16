const path = require('path');

const android = require('./android');
const ios = require('./ios');
const findAssets = require('./findAssets');
const wrapCommands = require('./wrapCommands');

const getRNPMConfig = (folder) =>
  require(path.join(folder, './package.json')).rnpm || {};

/**
 * Returns project config from the current working directory
 * @return {Object}
 */
exports.getProjectConfig = function getProjectConfig() {
  const folder = process.cwd();
  const rnpm = getRNPMConfig(folder);

  return Object.assign({}, rnpm, {
    ios: ios.projectConfig(folder, rnpm.ios || {}),
    android: android.projectConfig(folder, rnpm.android || {}),
    assets: findAssets(folder, rnpm.assets),
  });
};

/**
 * Returns a dependency config from node_modules/<package_name>
 * @param {String} packageName Dependency name
 * @return {Object}
 */
exports.getDependencyConfig = function getDependencyConfig(packageName) {
  const folder = path.join(process.cwd(), 'node_modules', packageName);
  const rnpm = getRNPMConfig(
    path.join(process.cwd(), 'node_modules', packageName)
  );

  // LAB modify 如果package.json 中rnpm android 和 ios 为false, 则跳过
  return Object.assign({}, rnpm, {
    ios: rnpm.ios === false ? null : ios.dependencyConfig(folder, rnpm.ios || {}),
    android: rnpm.android === false ? null : android.dependencyConfig(folder, rnpm.android || {}),
    assets: findAssets(folder, rnpm.assets),
    commands: wrapCommands(rnpm.commands),
    params: rnpm.params || [],
  });
};
