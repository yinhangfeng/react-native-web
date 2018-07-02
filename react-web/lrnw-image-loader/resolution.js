'use strict';

const path = require('path')
const fs = require('fs')
// const dantejs = require('dantejs')
// const imagemin = require('imagemin')
// const imageminGifsicle = require('imagemin-gifsicle')
// const imageminMozjpeg = require('imagemin-mozjpeg')
// const imageminOptipng = require('imagemin-optipng')
// const imageminSvgo = require('imagemin-svgo')
// const imageminPngquant = require('imagemin-pngquant')
const getImageSize = require('image-size')
const loaderUtils = require('loader-utils')
// const assign = require('object-assign');

/**
 * 构造函数
 * @param abspath require引用的图片的原始路径
 * @param publicPath  图片引用的url路径
 * @param plugin  webpack loader执行上下文对象
 */
function Resolution(abspath, publicPath, plugin) {
  this.abspath = abspath
  this.publicPath = publicPath
  this.ext = path.extname(abspath)
  this.name = abspath.split('.')[0]
  this.plugin = plugin
  this.data = {}
  // this.readyImageMinPlugins(plugin)
}

/**
 * 获取当前所支持的引用配置
 */
Resolution.prototype.getResolution = function () {
  let thisContext = this
  let promises = [
    this.resolutionBy('', '@1x'),
    this.resolutionBy('@1.5x'),
    this.resolutionBy('@2x'),
    this.resolutionBy('@3x'),
    this.resolutionBy('@4x')
  ]
  return Promise.all(promises).then(function () {
    return thisContext.data
  })
}

/**
 * 同步获取
 */
Resolution.prototype.getResolutionSync = function () {
  this.resolutionOf('', '@1x');
  this.resolutionOf('@1.5x');
  this.resolutionOf('@2x');
  this.resolutionOf('@3x');
  this.resolutionOf('@4x');
  return this.data;
}

/**
 * 根据传入的设备像素比来生成对应的图片信息
 */
Resolution.prototype.resolutionBy = function (resolution, alias) {
  let thisContext = this
  return new Promise(function (resolve, reject) {
    let info = thisContext.resolutionOf(resolution, alias);
    if (info) {
      let x = fs.readFileSync(info.abspath)
      thisContext.plugin.emitFile(info.xName, data)
      resolve()
      // thisContext.imageMin(x, function (err, data) {
      //   if (err) {
      //     thisContext.plugin.emitWarning(err)
      //   } else {
      //     thisContext.plugin.emitFile(info.xName, data)
      //   }
      //   resolve()
      // })
    } else {
      resolve()
    }
  })
}

Resolution.prototype.resolutionOf = function (resolution, alias) {
  let ext = this.ext
  let name = this.name
  let abspath = name + resolution + ext
  if (fs.existsSync(abspath)) {
    let image = getImageSize(abspath)
    let xName = this.publicPath.replace(ext, resolution + ext)
    this.data[(resolution || alias)] = {
      width: image.width,
      height: image.height,
      src: xName
    }
    return {
      abspath: abspath,
      xName: xName
    };
  }
}

Resolution.prototype.imageMin = function (x, callback) {
  imagemin
    .buffer(x, { plugins: this.imageMinPlugins })
    .then(function (data) {
      callback(null, data)
    })
    .catch(function (err) {
      callback(err)
    })
}

Resolution.prototype.readyImageMinPlugins = function (thisContext) {
  // see https://github.com/tcoopman/image-webpack-loader/blob/master/index.js
  let config = (thisContext.version === 2 ? loaderUtils.getOptions(thisContext) : getLegacyLoaderConfig(thisContext, 'imageWebpackLoader')) || {}
  let options = {
    bypassOnDebug: config.bypassOnDebug || false,
    gifsicle: config.gifsicle || {},
    mozjpeg: config.mozjpeg || {},
    pngquant: config.pngquant || {},
    optipng: config.optipng || {},
    svgo: config.svgo || {}
  }
  // Remove in interlaced and optimizationLevel checks in new major version
  if (config.hasOwnProperty('interlaced')) {
    options.gifsicle.interlaced = config.interlaced
    thisContext.emitWarning("DEPRECATED. Configure gifsicle's interlaced option in its own options. (gifsicle.interlaced)")
  }
  if (config.hasOwnProperty('optimizationLevel')) {
    options.optipng.optimizationLevel = config.optimizationLevel
    thisContext.emitWarning("DEPRECATED. Configure optipng's optimizationLevel option in its own options. (optipng.optimizationLevel)")
  }
  let plugins = this.imageMinPlugins = []
  if (options.gifsicle.enabled !== false)
    //plugins.push(imageminGifsicle(options.gifsicle))
  if (options.mozjpeg.enabled !== false)
    plugins.push(imageminMozjpeg(options.mozjpeg))
  if (options.svgo.enabled !== false)
    plugins.push(imageminSvgo(options.svgo))
  if (options.pngquant.enabled !== false)
    plugins.push(imageminPngquant(options.pngquant))
  if (options.optipng.enabled !== false)
    plugins.push(imageminOptipng(options.optipng))
}

/**
 * Basically the getLoaderConfig() function from loader-utils v0.2.
 */
function getLegacyLoaderConfig(loaderContext, defaultConfigKey) {
  let options = loaderUtils.getOptions(loaderContext);
  let configKey = options ? options.config : defaultConfigKey;
  if (configKey) {
    return assign({}, options, loaderContext.options[configKey]);
  }
  return options;
}

module.exports = Resolution