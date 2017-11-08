'use strict';

const VIRTUAL_ENTRY = 'lab-rollup-virtual-entry';

function isPluginsHelpers(id) {
  // plugins helpers 比如 rollup-plugin-commonjs
  return id[0] === '\0';
}

/**
 * config:
 * {
 *   bundleSession,
 *   dev,
 *   platform,
 *   assetsOutput,
 *   polyfills,
 * }
 */
module.exports = function LABRN({
  bundleSession,
  dev,
  platform,
  assetsOutput,
  polyfills,
}) {
  const {
    resolutionRequest,
    moduleCache,
    generateAssetObjAndCode,
  } = bundleSession;

  let entry;
  let entryModule;

  return {
    name: 'LABRN',

    options(options) {
      entry = options.entry;
      options.entry = VIRTUAL_ENTRY;
    },
    
    resolveId(importee, importer) {
      console.log('resolveId', importee, importer);

      if (isPluginsHelpers(importee)) {
        return;
      }
      if (importer == null) {
        // importee VIRTUAL_ENTRY
        return importee;
      }
      if (importer === VIRTUAL_ENTRY) {
        if (importee === entry) {
          // entry
          entryModule = moduleCache.getModule(importee);
        } else {
          // polyfills
        }
        return importee;
      }
      if (importer === importee) {
        return;
      }

      const importerModule = moduleCache.getAllModules()[importer];
      if (importerModule) {
        // 如果importerModule 是asset 则表示importee是 AssetRegistry
        // 因为rn packager对asset的deps是直接设置的(在Bundler/index.js)， 通过resolutionRequest无法获取，所以需要设置fromeMoudle为entryModule
        return resolutionRequest.resolveDependency(importerModule.isAsset() ? entryModule : importerModule, importee)
          .then((module) => {
            console.log('resolveId resolveDependency path:', module.path);
            if (module.isAsset()) {
              // 修改asset module 路径的扩展名 使其能被其他插件处理
              let assetJsName = module.path.slice(0, module.path.lastIndexOf('.')) + '.js';
              moduleCache.getAllModules()[assetJsName] = module;
              return assetJsName;
            }
            return module.path;
          });
      }
    },

    load(id) {
      console.log('load', id);

      if (isPluginsHelpers(id)) {
        return;
      }
      if (id === VIRTUAL_ENTRY) {
        // 优先导入polyfills
        const codeArr = polyfills.map((polyfillPath) => `import '${polyfillPath}';`);
        // entry
        codeArr.push(`import '${entry}';`);
        return codeArr.join('\n');
      }

      const module = moduleCache.getAllModules()[id];
      if (module && module.isAsset()) {
        if (!module.generateAssetObjAndCodePromise) {
          module.generateAssetObjAndCodePromise = generateAssetObjAndCode(module, platform)
            .then(({asset, code, meta}) => {
              assetsOutput.push(asset);
              return code;
            });
        }
        return module.generateAssetObjAndCodePromise;
      }
    },

    // transform(source, id) {
    //   return `/** ${id} **/\n${source}`;
    // },

    transformBundle(source, options) {
      // console.log('transformBundle', source.slice(0, 20), options);
      return `(function(global) { ${source} })(window);`;
    },
  };
}