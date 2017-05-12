/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

const InspectorProxy = require('./util/inspectorProxy.js');
const ReactPackager = require('../../packager/react-packager');
const TerminalReporter = require('../../packager/src/lib/TerminalReporter');

const attachHMRServer = require('./util/attachHMRServer');
const connect = require('connect');
const copyToClipBoardMiddleware = require('./middleware/copyToClipBoardMiddleware');
const cpuProfilerMiddleware = require('./middleware/cpuProfilerMiddleware');
const defaultAssetExts = require('../../packager/defaults').assetExts;
const defaultPlatforms = require('../../packager/defaults').platforms;
const defaultProvidesModuleNodeModules = require('../../packager/defaults').providesModuleNodeModules;
const getDevToolsMiddleware = require('./middleware/getDevToolsMiddleware');
const heapCaptureMiddleware = require('./middleware/heapCaptureMiddleware.js');
const http = require('http');
const indexPageMiddleware = require('./middleware/indexPage');
const loadRawBodyMiddleware = require('./middleware/loadRawBodyMiddleware');
const messageSocket = require('./util/messageSocket.js');
const openStackFrameInEditorMiddleware = require('./middleware/openStackFrameInEditorMiddleware');
const path = require('path');
const statusPageMiddleware = require('./middleware/statusPageMiddleware.js');
const systraceProfileMiddleware = require('./middleware/systraceProfileMiddleware.js');
const unless = require('./middleware/unless');
const webSocketProxy = require('./util/webSocketProxy.js');

const httpProxy = require('http-proxy');
const proxy = new httpProxy.createProxyServer({
  changeOrigin: true,
});

function runServer(args, config, readyCallback) {
  var wsProxy = null;
  var ms = null;
  const packagerServer = getPackagerServer(args, config);
  const inspectorProxy = new InspectorProxy();
  const app = connect()
    // TODO RW loadRawBodyMiddleware 会导致无法代理POST请求 暂时将禁用
    //.use(loadRawBodyMiddleware)
    .use(connect.compress())
    .use(getDevToolsMiddleware(args, () => wsProxy && wsProxy.isChromeConnected()))
    .use(getDevToolsMiddleware(args, () => ms && ms.isChromeConnected()))
    // RW modify web环境下 不需要下面的Middleware
    // .use(openStackFrameInEditorMiddleware(args))
    // .use(copyToClipBoardMiddleware)
    // .use(statusPageMiddleware)
    // .use(systraceProfileMiddleware)
    // .use(heapCaptureMiddleware)
    // .use(cpuProfilerMiddleware)
    .use(indexPageMiddleware)
    .use(unless('/inspector', inspectorProxy.processRequest.bind(inspectorProxy)))
    .use(packagerServer.processRequest.bind(packagerServer));

  args.projectRoots.forEach(root => app.use(connect.static(root)));

  //RW 代理 将其他请求(非静态资源 非打包数据)代理到指定的服务器
  if(args['lrnwProxy']) {
    app.use((req, res, next) => {
      console.log('lrnwProxy: ' + args['lrnwProxy'] + req.url);
      proxy.web(req, res, {
        target: args['lrnwProxy']
      });
    });
  }

  app.use(connect.logger())
    .use(connect.errorHandler());

  //使用node 自带的http
  const serverInstance = http.createServer(app).listen(
    args.port,
    args.host,
    function() {
      attachHMRServer({
        httpServer: serverInstance,
        path: '/hot',
        packagerServer,
      });

      wsProxy = webSocketProxy.attachToServer(serverInstance, '/debugger-proxy');
      ms = messageSocket.attachToServer(serverInstance, '/message');
      webSocketProxy.attachToServer(serverInstance, '/devtools');
      inspectorProxy.attachToServer(serverInstance, '/inspector');
      readyCallback();
    }
  );
  // Disable any kind of automatic timeout behavior for incoming
  // requests in case it takes the packager more than the default
  // timeout of 120 seconds to respond to a request.
  serverInstance.timeout = 0;
}

function getPackagerServer(args, config) {
  const transformModulePath =
    args.transformer ? path.resolve(args.transformer) :
    typeof config.getTransformModulePath === 'function' ? config.getTransformModulePath() :
    undefined;

  const providesModuleNodeModules =
    args.providesModuleNodeModules || defaultProvidesModuleNodeModules;

  return ReactPackager.createServer({
    assetExts: defaultAssetExts.concat(args.assetExts),
    blacklistRE: config.getBlacklistRE(),
    cacheVersion: '3',
    extraNodeModules: config.extraNodeModules,
    getTransformOptions: config.getTransformOptions,
    platforms: defaultPlatforms.concat(args.platforms),
    projectRoots: args.projectRoots,
    providesModuleNodeModules: providesModuleNodeModules,
    reporter: new TerminalReporter(),
    resetCache: args.resetCache,
    transformModulePath: transformModulePath,
    verbose: args.verbose,
    // LAB modify
    serverBuildBundleInterceptorModulePath: config.serverBuildBundleInterceptorModulePath,
    watch: !args.nonPersistent,
  });
}

module.exports = runServer;
