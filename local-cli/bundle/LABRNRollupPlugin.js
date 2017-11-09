'use strict';

const VIRTUAL_INPUT = 'lab-rollup-virtual-input';

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

  let input;
  let inputModule;

  return {
    name: 'LABRN',

    options(options) {
      input = options.input;
      options.input = VIRTUAL_INPUT;
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
      if (importer === VIRTUAL_INPUT) {
        if (importee === input) {
          // input
          inputModule = moduleCache.getModule(importee);
        } else {
          // polyfills
        }
        return importee;
      }
      if (importer === importee) {
        // XXX rollup-plugin-commonjs 引起 如果处理会导致问题
        console.log('importer === importee', importee)
        return;
      }

      let module = moduleCache.getAllModules()[importee];
      if (!module) {
        const importerModule = moduleCache.getAllModules()[importer];
        if (importerModule) {
          // 如果importerModule 是asset 则表示importee是 AssetRegistry
          // 因为rn packager对asset的deps是直接设置的(在Bundler/index.js)， 通过resolutionRequest无法获取，所以需要设置fromeMoudle为entryModule
          module = resolutionRequest.resolveDependency(importerModule.isAsset() ? inputModule : importerModule, importee)
          console.log('resolveId resolveDependency path:', module.path);
        }
      }
      if (module) {
        if (module.isAsset()) {
          // 修改asset module 路径的扩展名 使其能被其他插件处理
          let assetJsName = module.path.slice(0, module.path.lastIndexOf('.')) + '.js';
          moduleCache.getAllModules()[assetJsName] = module;
          return assetJsName;
        }
        return module.path;
      }
    },

    load(id) {
      console.log('load', id);

      if (isPluginsHelpers(id)) {
        return;
      }
      if (id === VIRTUAL_INPUT) {
        // 优先导入polyfills
        const codeArr = polyfills.map((polyfillPath) => `import '${polyfillPath}';`);
        // input
        codeArr.push(`import '${input}';`);
        return codeArr.join('\n');
      }

      const module = moduleCache.getAllModules()[id];
      if (module) {
        if (module.isAsset()) {
          if (!module.generateAssetObjAndCodePromise) {
            module.generateAssetObjAndCodePromise = generateAssetObjAndCode(module, platform)
              .then(({asset, code, meta}) => {
                assetsOutput.push(asset);
                return code;
              });
          }
          return module.generateAssetObjAndCodePromise;
        } else if (module.isMemoryModule) {
          return module.__sourceCode;
        }
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