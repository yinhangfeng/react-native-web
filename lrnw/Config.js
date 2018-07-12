'use strict';

const path = require('path');
const fs = require('fs');

const RN_CLI_CONFIG = 'lrnw-cli.config.js';

let projectRoot;

function getProjectRoot() {
  if (!projectRoot) {
    if (__dirname.match(/node_modules[/\\]lab-react-native-web[/\\]lrnw$/)) {
      projectRoot = path.resolve(__dirname, '../../..');
    } else {
      projectRoot = path.resolve(__dirname, '..');
    }
  }
  return projectRoot;
}

function loadConfig() {
  const projectRoot = getProjectRoot();
  const configPath = path.join(projectRoot, RN_CLI_CONFIG);
  if (fs.existsSync(configPath)) {
    return require(configPath);
  }
  return null;
}

module.exports = {
  getProjectRoot,

  ...loadConfig(),
};