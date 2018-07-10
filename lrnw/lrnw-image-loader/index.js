'use strict';

const path = require('path');
const fs = require('fs');
const loaderUtils = require('loader-utils');
const getImageSize = require('image-size');
const RequireImageXAssetPlugin = require('./RequireImageXAssetPlugin');
const {
  RESOLUTIONS,
} = require('./constants');

const LRNW_ASSETS_PATH = 'assets';
const RESOLUTION_REGEX = /(@[^x]+x)?\.[^\.]+$/;

// https://github.com/webpack-contrib/file-loader/blob/master/src/index.js
function loader(content) {
  const options = loaderUtils.getOptions(this) || {};

  const context =
    options.context ||
    this.rootContext ||
    (this.options && this.options.context);

  let ext = path.extname(this.resourcePath);
  if (!ext) {
    throw new Error('lrnw-image-loader image must have ext!');
  }
  const imagePathWithoutExt = this.resourcePath.replace(RESOLUTION_REGEX, '');
  ext = ext.slice(1);

  const handleOptions = {
    options,
    context,
    loaderContext: this,
    imagePathWithoutExt,
    ext,
    platform: 'web',
  };

  const assetData = RESOLUTIONS.reduce((assetData, resolution) => {
    handleOptions.resolution = resolution;
    const resolutionResult = handleResolution(handleOptions);
    if (resolutionResult == null) {
      return assetData;
    }
    const {
      file,
      filePath,
    } = resolutionResult;
    assetData.files.push(file);
    assetData.scales.push(resolution);
    if (assetData.width == null) {
      const {
        width,
        height,
      } = getImageSize(filePath);
      // 可能有小数
      assetData.width = width / resolution;
      assetData.height = height / resolution;
    }
    return assetData;
  }, {
    files: [],
    scales: [],
  });

  if (!assetData.scales.length) {
    throw new Error(`lrnw-image-loader image not exists! ${this.resourcePath}`);
  }

  if (assetData.scales.length === 1) {
    assetData.scales = assetData.scales[0];
    assetData.files = assetData.files[0];
  }

  // console.log('assetData', assetData);

  return `module.exports = require('react-native/Libraries/Image/AssetRegistry')
  .registerImage(${assetData.width}, ${assetData.height}, ${JSON.stringify(assetData.scales)}, ${JSON.stringify(assetData.files)});`;
}

function handleResolution({
  options,
  context,
  loaderContext,
  imagePathWithoutExt,
  ext,
  resolution,
  platform,
}) {
  const resolutionStr = resolution === 1 ? '' : `@${resolution}x`;
  let resourcePath = `${imagePathWithoutExt}${resolutionStr}.${platform}.${ext}`;
  if (!fs.existsSync(resourcePath)) {
    resourcePath = `${imagePathWithoutExt}${resolutionStr}.${ext}`;
    if (!fs.existsSync(resourcePath)) {
      return null;
    }
  }

  const fakeLoaderContext = {
    options: loaderContext.options,
    resourcePath,
  };

  const content = fs.readFileSync(resourcePath);

  // interpolateName 只需要 loaderContext 的 options resourcePath
  const url = loaderUtils.interpolateName(fakeLoaderContext, options.name, {
    context,
    content,
    regExp: options.regExp,
  });

  let outputPath = url;

  if (options.outputPath) {
    if (typeof options.outputPath === 'function') {
      outputPath = options.outputPath(url);
    } else {
      outputPath = path.posix.join(options.outputPath, url);
    }
  }

  if (options.useRelativePath) {
    const filePath = resourcePath;

    const issuer = options.context
      ? context
      : loaderContext._module && loaderContext._module.issuer && loaderContext._module.issuer.context;

    const relativeUrl =
      issuer &&
      path
        .relative(issuer, filePath)
        .split(path.sep)
        .join('/');

    const relativePath = relativeUrl && `${path.dirname(relativeUrl)}/`;
    // eslint-disable-next-line no-bitwise
    if (~relativePath.indexOf('../')) {
      outputPath = path.posix.join(outputPath, relativePath, url);
    } else {
      outputPath = path.posix.join(relativePath, url);
    }
  }

  // let publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;
  // if (options.publicPath) {
  //   if (typeof options.publicPath === 'function') {
  //     publicPath = options.publicPath(url);
  //   } else if (options.publicPath.endsWith('/')) {
  //     publicPath = options.publicPath + url;
  //   } else {
  //     publicPath = `${options.publicPath}/${url}`;
  //   }

  //   publicPath = JSON.stringify(publicPath);
  // }

  if (options.emitFile === undefined || options.emitFile) {
    loaderContext.emitFile(outputPath, content);
  }

  let file = outputPath;
  if (file.startsWith(LRNW_ASSETS_PATH + '/')) {
    file = file.slice(LRNW_ASSETS_PATH.length + 1);
  }
  
  return {
    file,
    filePath: resourcePath,
  };
}

module.exports = loader;

module.exports.RequireImageXAssetPlugin = RequireImageXAssetPlugin;