/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule AssetSourceResolver
 * @flow
 */
'use strict';

export type ResolvedAssetSource = {
  __packager_asset: boolean,
  width: ?number,
  height: ?number,
  uri: string,
  scale: number,
};

import type { PackagerAsset } from 'AssetRegistry';

const PixelRatio = require('PixelRatio');
// const Platform = require('Platform');

//const assetPathUtils = require('../../local-cli/bundle/assetPathUtils');
// const invariant = require('fbjs/lib/invariant');

// function assetPathUtilsGetBasePath(asset) {
//   var basePath = asset.httpServerLocation;
//   if (basePath[0] === '/') {
//     basePath = basePath.substr(1);
//   }
//   return basePath;
// }

/**
 * Returns a path like 'assets/AwesomeModule/icon@2x.png'
 */
function getScaledAssetPath(asset): string {
  // var scale = AssetSourceResolver.pickScale(asset.scales, PixelRatio.get());
  var scale = AssetSourceResolver.pickScale(asset.s, PixelRatio.get());
  var scaleSuffix = scale === 1 ? '' : '@' + scale + 'x';
  // var assetDir = assetPathUtilsGetBasePath(asset);
  // return assetDir + '/' + asset.name + scaleSuffix + '.' + asset.type;
  return '/assets' + asset.l + '/' + asset.n + scaleSuffix + '.' + asset.t;
}

/**
 * Returns a path like 'drawable-mdpi/icon.png'
 */
// function getAssetPathInDrawableFolder(asset): string {
//   var scale = AssetSourceResolver.pickScale(asset.scales, PixelRatio.get());
//   var drawbleFolder = assetPathUtils.getAndroidDrawableFolderName(asset, scale);
//   var fileName =  assetPathUtils.getAndroidResourceIdentifier(asset);
//   return drawbleFolder + '/' + fileName + '.' + asset.type;
// }

/**
 * 
 * asset: {
 *   l: fileSystemLocation,
 *   w: width,
 *   h: height,
 *   s: scales,
 *   a: hash,
 *   n: name,
 *   t: type,
 * }
 */
class AssetSourceResolver {

  serverUrl: ?string;
  // where the bundle is being run from
  bundlePath: ?string;
  // the asset to resolve
  asset: PackagerAsset;

  constructor(devServerUrl: ?string, serverUrl: ?string, asset: PackagerAsset) {
    this.devServerUrl = devServerUrl;
    this.serverUrl = serverUrl;
    this.asset = asset;
  }

  isLoadedFromServer(): boolean {
    return true;
  }

  isLoadedFromFileSystem(): boolean {
    return false;
  }

  defaultAsset(): ResolvedAssetSource {
    // RW modify 增加缓存 PixelRatio 改变?
    if (this.asset.__default) {
      return this.asset.__default;
    }
    let url = this.devServerUrl;
    if (url == null) {
      url = this.serverUrl;
    }
    const resolved = this.fromSource(
      // url + '/' + getScaledAssetPath(this.asset) + '?hash=' + this.asset.hash
      url + getScaledAssetPath(this.asset) + '?hash=' + this.asset.a
    );
    this.asset.__default = resolved;
    if (__DEV__) {
      Object.freeze(resolved);
    }
    return resolved;
  }

  /**
   * Returns an absolute URL which can be used to fetch the asset
   * from the devserver
   */
  // assetServerURL(): ResolvedAssetSource {
  //   invariant(!!this.serverUrl, 'need server to load from');
  //   return this.fromSource(
  //     this.serverUrl + getScaledAssetPath(this.asset) +
  //     '?platform=' + Platform.OS + '&hash=' + this.asset.hash
  //   );
  // }

  // /**
  //  * Resolves to just the scaled asset filename
  //  * E.g. 'assets/AwesomeModule/icon@2x.png'
  //  */
  // scaledAssetPath(): ResolvedAssetSource {
  //   return this.fromSource(getScaledAssetPath(this.asset));
  // }
  //
  // /**
  //  * Resolves to where the bundle is running from, with a scaled asset filename
  //  * E.g. '/sdcard/bundle/assets/AwesomeModule/icon@2x.png'
  //  */
  // scaledAssetPathInBundle(): ResolvedAssetSource {
  //   const path = this.bundlePath || '';
  //   return this.fromSource(path + getScaledAssetPath(this.asset));
  // }
  //
  // /**
  //  * The default location of assets bundled with the app, located by
  //  * resource identifier
  //  * The Android resource system picks the correct scale.
  //  * E.g. 'assets_awesomemodule_icon'
  //  */
  // resourceIdentifierWithoutScale(): ResolvedAssetSource {
  //   invariant(Platform.OS === 'android', 'resource identifiers work on Android');
  //   return this.fromSource(assetPathUtils.getAndroidResourceIdentifier(this.asset));
  // }
  //
  // /**
  //  * If the jsbundle is running from a sideload location, this resolves assets
  //  * relative to its location
  //  * E.g. 'file:///sdcard/AwesomeModule/drawable-mdpi/icon.png'
  //  */
  // drawableFolderInBundle(): ResolvedAssetSource {
  //   const path = this.bundlePath || '';
  //   return this.fromSource(
  //     'file://' + path + getAssetPathInDrawableFolder(this.asset)
  //   );
  // }

  fromSource(source: string): ResolvedAssetSource {
    return {
      __packager_asset: true,
      // width: this.asset.width,
      width: this.asset.w,
      // height: this.asset.height,
      height: this.asset.h,
      uri: source,
      // scale: AssetSourceResolver.pickScale(this.asset.scales, PixelRatio.get()),
      scale: AssetSourceResolver.pickScale(this.asset.s, PixelRatio.get()),
    };
  }

  static pickScale(scales: Array<number>, deviceScale: number): number {
    // Packager guarantees that `scales` array is sorted
    for (var i = 0; i < scales.length; i++) {
      if (scales[i] >= deviceScale) {
        return scales[i];
      }
    }

    // If nothing matches, device scale is larger than any available
    // scales, so we return the biggest one. Unless the array is empty,
    // in which case we default to 1
    return scales[scales.length - 1] || 1;
  }

}

 module.exports = AssetSourceResolver;
