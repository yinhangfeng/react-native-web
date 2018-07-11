/**
 * https://github.com/webpack/webpack-dev-server/blob/v3.1.4/bin/webpack-dev-server.js
 * 去除了 yargs argv 解析 改为直接由外部传入
 * 去除了 wpOpt 的解析创建 直接由外部提供
 */
'use strict';

const fs = require('fs');
const net = require('net');
const path = require('path');
const open = require('opn');
const portfinder = require('portfinder');
const addDevServerEntrypoints = require('webpack-dev-server/lib/util/addDevServerEntrypoints');
const createDomain = require('webpack-dev-server/lib/util/createDomain');
const createLog = require('webpack-dev-server/lib/createLog');

const Server = require('webpack-dev-server');
const webpack = require('webpack');

function colorInfo(useColor, msg) {
  if (useColor) {
    // Make text blue and bold, so it *pops*
    return `\u001b[1m\u001b[34m${msg}\u001b[39m\u001b[22m`;
  }
  return msg;
}

function colorError(useColor, msg) {
  if (useColor) {
    // Make text red and bold, so it *pops*
    return `\u001b[1m\u001b[31m${msg}\u001b[39m\u001b[22m`;
  }
  return msg;
}

// eslint-disable-next-line
const defaultTo = (value, def) => value == null ? def : value;

const DEFAULT_PORT = 8080;

function processOptions(webpackOptions, argv) {
  // process Promise
  // if (typeof webpackOptions.then === 'function') {
  //   webpackOptions.then(processOptions).catch((err) => {
  //     console.error(err.stack || err);
  //     process.exit(); // eslint-disable-line
  //   });
  //   return;
  // }

  const firstWpOpt = Array.isArray(webpackOptions) ? webpackOptions[0] : webpackOptions;

  const options = webpackOptions.devServer || firstWpOpt.devServer || {};

  if (argv.bonjour) { options.bonjour = true; }

  if (argv.host !== 'localhost' || !options.host) { options.host = argv.host; }

  if (argv['allowed-hosts']) { options.allowedHosts = argv['allowed-hosts'].split(','); }

  if (argv.public) { options.public = argv.public; }

  if (argv.socket) { options.socket = argv.socket; }

  if (argv.progress) { options.progress = argv.progress; }

  if (!options.publicPath) {
    // eslint-disable-next-line
    options.publicPath = firstWpOpt.output && firstWpOpt.output.publicPath || '';
    if (!/^(https?:)?\/\//.test(options.publicPath) && options.publicPath[0] !== '/') {
      options.publicPath = `/${options.publicPath}`;
    }
  }

  if (!options.filename) { options.filename = firstWpOpt.output && firstWpOpt.output.filename; }

  if (!options.watchOptions) { options.watchOptions = firstWpOpt.watchOptions; }

  if (argv.stdin) {
    process.stdin.on('end', () => {
      process.exit(0); // eslint-disable-line no-process-exit
    });
    process.stdin.resume();
  }

  if (!options.hot) { options.hot = argv.hot; }

  if (!options.hotOnly) { options.hotOnly = argv['hot-only']; }

  if (!options.clientLogLevel) { options.clientLogLevel = argv['client-log-level']; }

  // eslint-disable-next-line
  if (options.contentBase === undefined) {
    if (argv['content-base']) {
      options.contentBase = argv['content-base'];
      if (Array.isArray(options.contentBase)) {
        options.contentBase = options.contentBase.map(val => path.resolve(val));
      } else if (/^[0-9]$/.test(options.contentBase)) { options.contentBase = +options.contentBase; } else if (!/^(https?:)?\/\//.test(options.contentBase)) { options.contentBase = path.resolve(options.contentBase); }
      // It is possible to disable the contentBase by using `--no-content-base`, which results in arg["content-base"] = false
    } else if (argv['content-base'] === false) {
      options.contentBase = false;
    }
  }

  if (argv['watch-content-base']) { options.watchContentBase = true; }

  if (!options.stats) {
    options.stats = {
      cached: false,
      cachedAssets: false
    };
  }

  if (typeof options.stats === 'object' && typeof options.stats.colors === 'undefined') {
    options.stats = Object.assign({}, options.stats, { colors: argv.color });
  }

  if (argv.lazy) { options.lazy = true; }

  if (!argv.info) { options.noInfo = true; }

  if (argv.quiet) { options.quiet = true; }

  if (argv.https) { options.https = true; }

  if (argv.cert) { options.cert = fs.readFileSync(path.resolve(argv.cert)); }

  if (argv.key) { options.key = fs.readFileSync(path.resolve(argv.key)); }

  if (argv.cacert) { options.ca = fs.readFileSync(path.resolve(argv.cacert)); }

  if (argv.pfx) { options.pfx = fs.readFileSync(path.resolve(argv.pfx)); }

  if (argv['pfx-passphrase']) { options.pfxPassphrase = argv['pfx-passphrase']; }

  if (argv.inline === false) { options.inline = false; }

  if (argv['history-api-fallback']) { options.historyApiFallback = true; }

  if (argv.compress) { options.compress = true; }

  if (argv['disable-host-check']) { options.disableHostCheck = true; }

  if (argv['open-page']) {
    options.open = true;
    options.openPage = argv['open-page'];
  }

  if (typeof argv.open !== 'undefined') {
    options.open = argv.open !== '' ? argv.open : true;
  }

  if (options.open && !options.openPage) { options.openPage = ''; }

  if (argv.useLocalIp) { options.useLocalIp = true; }

  // Kind of weird, but ensures prior behavior isn't broken in cases
  // that wouldn't throw errors. E.g. both argv.port and options.port
  // were specified, but since argv.port is 8080, options.port will be
  // tried first instead.
  options.port = argv.port === DEFAULT_PORT ? defaultTo(options.port, argv.port) : defaultTo(argv.port, options.port);

  if (options.port != null) {
    startDevServer(webpackOptions, options, argv);
    return;
  }

  portfinder.basePort = DEFAULT_PORT;
  portfinder.getPort((err, port) => {
    if (err) throw err;
    options.port = port;
    startDevServer(webpackOptions, options, argv);
  });
}

function startDevServer(webpackOptions, options, argv) {
  const log = createLog(options);
  addDevServerEntrypoints(webpackOptions, options);

  let compiler;
  try {
    compiler = webpack(webpackOptions);
  } catch (e) {
    if (e instanceof webpack.WebpackOptionsValidationError) {
      log.error(colorError(options.stats.colors, e.message));
      process.exit(1); // eslint-disable-line
    }
    throw e;
  }

  if (options.progress) {
    new webpack.ProgressPlugin({
      profile: argv.profile
    }).apply(compiler);
  }

  const suffix = (options.inline !== false || options.lazy === true ? '/' : '/webpack-dev-server/');

  let server;
  try {
    server = new Server(compiler, options, log);
  } catch (e) {
    const OptionsValidationError = require('../lib/OptionsValidationError');
    if (e instanceof OptionsValidationError) {
      log.error(colorError(options.stats.colors, e.message));
          process.exit(1); // eslint-disable-line
    }
    throw e;
  }

  ['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig, () => {
      server.close(() => {
        process.exit(); // eslint-disable-line no-process-exit
      });
    });
  });

  if (options.socket) {
    server.listeningApp.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        const clientSocket = new net.Socket();
        clientSocket.on('error', (clientError) => {
          if (clientError.code === 'ECONNREFUSED') {
            // No other server listening on this socket so it can be safely removed
            fs.unlinkSync(options.socket);
            server.listen(options.socket, options.host, (err) => {
              if (err) throw err;
            });
          }
        });
        clientSocket.connect({ path: options.socket }, () => {
          throw new Error('This socket is already used');
        });
      }
    });
    server.listen(options.socket, options.host, (err) => {
      if (err) throw err;
      // chmod 666 (rw rw rw)
      const READ_WRITE = 438;
      fs.chmod(options.socket, READ_WRITE, (fsError) => {
        if (fsError) throw fsError;

        const uri = createDomain(options, server.listeningApp) + suffix;
        reportReadiness(uri, options, log, argv.color);
      });
    });
  } else {
    server.listen(options.port, options.host, (err) => {
      if (err) throw err;
      if (options.bonjour) broadcastZeroconf(options);

      const uri = createDomain(options, server.listeningApp) + suffix;
      reportReadiness(uri, options, log, argv.color);
    });
  }
}

function reportReadiness(uri, options, log, useColor) {
  const contentBase = Array.isArray(options.contentBase) ? options.contentBase.join(', ') : options.contentBase;

  if (options.socket) {
    log.info(`Listening to socket at ${colorInfo(useColor, options.socket)}`);
  } else {
    log.info(`Project is running at ${colorInfo(useColor, uri)}`);
  }

  log.info(`webpack output is served from ${colorInfo(useColor, options.publicPath)}`);

  if (contentBase) { log.info(`Content not from webpack is served from ${colorInfo(useColor, contentBase)}`); }

  if (options.historyApiFallback) { log.info(`404s will fallback to ${colorInfo(useColor, options.historyApiFallback.index || '/index.html')}`); }

  if (options.bonjour) { log.info('Broadcasting "http" with subtype of "webpack" via ZeroConf DNS (Bonjour)'); }

  if (options.open) {
    let openOptions = {};
    let openMessage = 'Unable to open browser';

    if (typeof options.open === 'string') {
      openOptions = { app: options.open };
      openMessage += `: ${options.open}`;
    }

    open(uri + (options.openPage || ''), openOptions).catch(() => {
      log.warn(`${openMessage}. If you are running in a headless environment, please do not use the open flag.`);
    });
  }
}

function broadcastZeroconf(options) {
  const bonjour = require('bonjour')();
  bonjour.publish({
    name: 'Webpack Dev Server',
    port: options.port,
    type: 'http',
    subtypes: ['webpack']
  });
  process.on('exit', () => {
    bonjour.unpublishAll(() => {
      bonjour.destroy();
    });
  });
}

/**
 * options: 参考 https://github.com/webpack/webpack-dev-server/blob/v3.1.4/bin/webpack-dev-server.js yargs.options
 */
function start(webpackConfig, options) {
  options = {
    // yargs.options 中的默认值
    inline: true,
    color: require('supports-color'),
    info: true,
    'client-log-level': 'info',
    host: 'localhost',
    ...options,
  };

  processOptions(webpackConfig, options);
}

module.exports = start;