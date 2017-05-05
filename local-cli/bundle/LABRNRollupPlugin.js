'use strict';

const VIRTUAL_ENTRY = 'lab-rollup-virtual-entry';

function isPluginsHelpers(id) {
  // plugins helpers 比如 rollup-plugin-commonjs
  return id[0] === '\0';
}

/**
 * config:
 * {
 *   resolutionRequest,
 *   bundler,
 *   dev,
 *   assetsOutput,
 *   polyfills,
 * }
 */
module.exports = function LABRN(config) {
  const resolutionRequest = config.resolutionRequest;
  const moduleCache = resolutionRequest.getModuleCache();
  const bundler = config.bundler;
  const dev = config.dev;
  const assetsOutput = config.assetsOutput;
  const platform = config.platform;
  const polyfills = config.polyfills;

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

      const importerModule = moduleCache._moduleCache[importer];
      if (importerModule) {
        // 如果importerModule 是asset 则表示importee是 AssetRegistry
        // 因为rn packager对asset的deps是直接设置的(在Bundler/index.js)， 通过resolutionRequest无法获取，所以需要设置fromeMoudle为entryModule
        return resolutionRequest.resolveDependency(importerModule.isAsset() ? entryModule : importerModule, importee)
          .then((module) => {
            console.log('resolveId resolveDependency path:', module.path);
            if (module.isAsset()) {
              // 修改asset module 路径的扩展名 使其能被其他插件处理
              let assetJsName = module.path.slice(0, module.path.lastIndexOf('.')) + '.js';
              moduleCache._moduleCache[assetJsName] = module;
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

      const module = moduleCache._moduleCache[id];
      if (module && module.isAsset()) {
        if (!module.generateAssetObjAndCodePromise) {
          module.generateAssetObjAndCodePromise = bundler.generateAssetObjAndCode(module, [] /* assetPlugins */, platform)
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
      return `(function(global) { var babelHelpers; ${source} })(window);`;
    },
  };
}