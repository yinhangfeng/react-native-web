'use strict';

const path = require('path');
const fs = require('fs');
const {
  RESOLUTIONS,
} = require('./constants');

const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];

/**
 * 如果引用图片 xxx.png 而本地存在 xxx@2x.png xxx@3x.png
 * 如果没有此插件则会报 xxx.png 不存在
 * 此插件用于查找相关的图片并将 request 修改为该图片
 * 参考 https://github.com/Beven91/image-web-loader/blob/master/src/plugin.js
 */
class RequireImageXAssetPlugin {

  apply(compiler) {
    compiler.plugin('compilation', (compilation, params) => {
      params.normalModuleFactory.plugin('before-resolve', (value, next) => {
        const ext = path.extname(value.request);
        let newRequest;
        if (extensions.includes(ext)) {
          const requestWithoutExt = value.request.slice(0, -ext.length);
          for (let resolution of RESOLUTIONS) {
            newRequest = this.findImage({
              context: value.context,
              requestWithoutExt,
              ext,
              resolution,
            });
            if (newRequest) {
              break;
            }
            newRequest = this.findImage({
              context: value.context,
              requestWithoutExt,
              ext,
              resolution,
              platform: 'web',
            });
            if (newRequest) {
              break;
            }
          }
        }

        if (newRequest) {
          value.request = newRequest;
        }
        next(null, value);
      })
    })
  }

  findImage({context, requestWithoutExt, ext, resolution, platform}) {
    const resolutionStr = (resolution === 1 || resolution == null) ? '' : `@${resolution}x`;
    const platformStr = platform ? `.${platform}` : '';
    const filePath = path.resolve(context, `${requestWithoutExt}${resolutionStr}${platformStr}${ext}`);

    if (fs.existsSync(filePath)) {
      return filePath;
    }
    return null;
  }
}

module.exports = RequireImageXAssetPlugin;