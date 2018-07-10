/**
 * https://github.com/facebook/create-react-app/blob/next/packages/react-scripts/bin/react-scripts.js
 */

'use strict';

const build = require('./build');
const start = require('./start');

const args = process.argv.slice(2);
const scriptIndex = args.findIndex(
  x => x === 'build' || x === 'start'
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];

switch (script) {
  case 'build':
    build();
    break;
  case 'start':
    start();
    break;
  default:
    break;
} 