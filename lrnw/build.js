'use strict';

const chalk = require('chalk');
const webpack = require('webpack');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printBuildError = require('react-dev-utils/printBuildError');
const Config = require('./Config');
const buildWebpackConfig = require('./buildWebpackConfig');

// https://github.com/facebook/create-react-app/blob/next/packages/react-scripts/scripts/build.js
function build({
  cliConfig = Config,
} = {}) {
  console.log('Creating an optimized production build...');

  const webpackConfig = buildWebpackConfig({
    env: 'production',
    cliConfig,
  });
  const compiler = webpack(webpackConfig);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }
      const messages = formatWebpackMessages(stats.toJson({}, true));
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 2) {
          messages.errors.length = 2;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }

      const resolveArgs = {
        stats,
        warnings: messages.warnings,
      };

      return resolve(resolveArgs);
    });
  });
}

function run(options) {
  build(options).then(
    ({ stats, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        );
        console.log(
          'To ignore, add ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' to the line before.\n'
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }
    },
    err => {
      console.log(chalk.red('Failed to compile.\n'));
      printBuildError(err);
      process.exit(1);
    }
  )
  .catch(err => {
    throw err;
    process.exit(1);
  });
}

module.exports = run;