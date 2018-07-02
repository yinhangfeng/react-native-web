'use strict'

const loaderUtils = require('loader-utils')
const Resolution = require('./resolution.js')
const RequireImageXAssetPlugin = require('./plugin.js')

module.exports = function (content) {
  if (this.cacheable) {
    this.cacheable()
  }
  content = handleContent(content);
  let context = this;
  let callback = this.async()
  let publicPath = content.replace(/;$/, '')
  let absoluteFile = this.resourcePath;
  new Resolution(absoluteFile, publicPath, this).getResolution().then(function (resolution) {
    callback(null, createModule(context, resolution,publicPath));
  }).catch(callback)
}

module.exports.sync = function (content) {
  if (this.cacheable) {
    this.cacheable()
  }
  content = handleContent(content);
  let publicPath = content.replace(/;$/, '')
  let absoluteFile = this.resourcePath;
  let resolution = new Resolution(absoluteFile, publicPath, this).getResolutionSync();
  return createModule(this, resolution,publicPath);
}

function handleContent(content) {
  if (content.indexOf('module.exports') > -1) {
    let md = {}
    new Function('module,__webpack_public_path__', content)(md, '')
    content = md.exports
  }
  return content;
}

function createModule(context, resolution,publicPath) {
  let compiler = context._compiler;
  let query = loaderUtils.getOptions(context) || {}
  let assets = query.assets || process.cwd()
  let assetsPath = (context.options || compiler.options).output.publicPath
  let cdnUriName = query.contextName || '""';
  let onlyWeb = query.onlyWeb;
  let exportCode = 'module.exports ={"__packager_asset":true,"uri":baseUri+"' + assetsPath + '"+rect.src,"width":rect.width,"height":rect.height,"deprecated":true}';
  let onlyWebCode = 'module.exports =baseUri+"' + assetsPath + '"+rect.src;';
  return [
    'let resolution=' + JSON.stringify(resolution) + ';',
    'let dpr = "@"+(global.devicePixelRatio || 1)+"x";',
    'let rect = resolution[dpr] || resolution["@1x"];',
    'let baseUri = ' + cdnUriName + ';',
    onlyWeb ? onlyWebCode : exportCode
  ].join(' ')
}

module.exports.RequireImageXAssetPlugin = RequireImageXAssetPlugin