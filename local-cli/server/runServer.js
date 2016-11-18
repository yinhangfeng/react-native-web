/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

const attachHMRServer = require('./util/attachHMRServer');
const connect = require('connect');
const cpuProfilerMiddleware = require('./middleware/cpuProfilerMiddleware');
const getDevToolsMiddleware = require('./middleware/getDevToolsMiddleware');
const http = require('http');
const jscProfilerMiddleware = require('./middleware/jscProfilerMiddleware');
const loadRawBodyMiddleware = require('./middleware/loadRawBodyMiddleware');
const messageSocket = require('./util/messageSocket.js');
const openStackFrameInEditorMiddleware = require('./middleware/openStackFrameInEditorMiddleware');
const copyToClipBoardMiddleware = require('./middleware/copyToClipBoardMiddleware');
const path = require('path');
const ReactPackager = require('../../packager/react-packager');
const statusPageMiddleware = require('./middleware/statusPageMiddleware.js');
const indexPageMiddleware = require('./middleware/indexPage');
const systraceProfileMiddleware = require('./middleware/systraceProfileMiddleware.js');
const heapCaptureMiddleware = require('./middleware/heapCaptureMiddleware.js');
const webSocketProxy = require('./util/webSocketProxy.js');
const defaultAssetExts = require('../../packager/defaultAssetExts');

const httpProxy = require('http-proxy');
const proxy = new httpProxy.createProxyServer({
  changeOrigin: true,
});

function runServer(args, config, readyCallback) {
  var wsProxy = null;
  var ms = null;
  const packagerServer = getPackagerServer(args, config);
  const app = connect()
    // TODO RW loadRawBodyMiddleware 会导致无法代理POST请求 暂时将禁用
    //.use(loadRawBodyMiddleware)
    .use(connect.compress())
    .use(getDevToolsMiddleware(args, () => wsProxy && wsProxy.isChromeConnected()))
    .use(getDevToolsMiddleware(args, () => ms && ms.isChromeConnected()))
    // RW web环境下 不需要下面的Middleware
    // .use(openStackFrameInEditorMiddleware(args))
    // .use(copyToClipBoardMiddleware)
    // .use(statusPageMiddleware)
    // .use(systraceProfileMiddleware)
    // .use(heapCaptureMiddleware)
    // .use(cpuProfilerMiddleware)
    // .use(jscProfilerMiddleware)
    .use(indexPageMiddleware)
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

  return ReactPackager.createServer({
    nonPersistent: args.nonPersistent,
    projectRoots: args.projectRoots,
    //RW runServer没有platform参数，原本服务器运行后是可以获取任意平台的bundle的，但RW中需要配置特定的blacklistRE，所以这里传入web (其实是blacklistRE获取机制设计不完善导致的后续react-native应该会改)
    blacklistRE: config.getBlacklistRE('web'),
    cacheVersion: '3',
    getTransformOptionsModulePath: config.getTransformOptionsModulePath,
    transformModulePath: transformModulePath,
    extraNodeModules: config.extraNodeModules,
    assetRoots: args.assetRoots,
    assetExts: defaultAssetExts.concat(args.assetExts),
    resetCache: args.resetCache,
    verbose: args.verbose,
  });
}

module.exports = runServer;
