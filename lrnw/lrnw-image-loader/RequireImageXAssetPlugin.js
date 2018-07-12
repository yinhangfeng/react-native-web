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
 * 
 * TODO 不支持 alias 需要寻找更好的替换 request 的方式
 */
class RequireImageXAssetPlugin {

  constructor({
    projectRoot,
  }) {
    this._projectRoot = projectRoot;
  }

  apply(compiler) {
    compiler.plugin('compilation', (compilation, params) => {
      params.normalModuleFactory.plugin('before-resolve', (value, next) => {
        const ext = path.extname(value.request);
        let newRequest;
        if (extensions.includes(ext)) {
          let requestWithoutExt = value.request.slice(0, -ext.length);
          if (requestWithoutExt[0] !== '.' && requestWithoutExt[0] !== '/') {
            let packageNameSepIndex = requestWithoutExt.indexOf(path.sep);
            if (packageNameSepIndex < 0) {
              packageNameSepIndex = requestWithoutExt.length;
            }
            const packageName = requestWithoutExt.slice(0, packageNameSepIndex);
            let packagePath = this.findPackage(packageName, value.context, this._projectRoot);
            if (!packagePath) {
              // XXX 支持 packageName 为当前项目
              packagePath = this._projectRoot;
            }
            requestWithoutExt = path.resolve(packagePath, requestWithoutExt.slice(packageNameSepIndex + 1));
          } else {
            requestWithoutExt = path.resolve(value.context, requestWithoutExt);
          }
          for (let resolution of RESOLUTIONS) {
            newRequest = this.findImage({
              requestWithoutExt,
              ext,
              resolution,
            });
            if (newRequest) {
              break;
            }
            newRequest = this.findImage({
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

  findPackage(packageName, dir, projectRoot) {
    let currDir = dir;
    let root = path.parse(dir).root;
    let projectRootParent = path.dirname(projectRoot);
    let packagePath;
    for (
      ;
      currDir !== '.' && currDir !== root && currDir !== projectRootParent;
      currDir = path.dirname(currDir)
    ) {
      packagePath = path.join(currDir, 'node_modules', packageName);
      if (fs.existsSync(packagePath)) {
        return packagePath;
      }
    }
  }

  findImage({requestWithoutExt, ext, resolution, platform}) {
    const resolutionStr = (resolution === 1 || resolution == null) ? '' : `@${resolution}x`;
    const platformStr = platform ? `.${platform}` : '';
    const filePath = `${requestWithoutExt}${resolutionStr}${platformStr}${ext}`;

    if (fs.existsSync(filePath)) {
      return filePath;
    }
    return null;
  }
}

module.exports = RequireImageXAssetPlugin;