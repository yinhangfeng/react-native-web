'use strict';

const VIRTUAL_INPUT = 'lab-rollup-virtual-input';

const isWin = process.platform === 'win32';

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
 *   runBeforeMainModule,
 * }
 */
module.exports = function LABRN({
  bundleSession,
  dev,
  platform,
  assetsOutput,
  polyfills,
  runBeforeMainModule = [],
}) {
  const {
    resolutionRequest,
    moduleCache,
    generateAssetObjAndCode,
  } = bundleSession;

  let input;
  let inputModule;
  runBeforeMainModule.forEach((modulePath) => moduleCache.getModule(modulePath));

  return {
    name: 'LABRN',

    options(options) {
      input = options.input;
      options.input = VIRTUAL_INPUT;

      inputModule = moduleCache.getModule(input);
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
        } else {
          // polyfills runBeforeMainModule
        }
        return;
      }
      if (importer === importee) {
        // XXX rollup-plugin-commonjs 引起 如果处理会导致问题
        console.log('importer === importee', importee)
        return;
      }

      let module = moduleCache.getAllModules()[importee];
      if (!module) {
        let fromModule = moduleCache.getAllModules()[importer];
        // 如果importerModule 是asset 则表示importee是 AssetRegistry
        // 因为metro-bundler 对 asset 的 deps 是直接设置的(在Bundler/index.js)， 通过resolutionRequest无法获取，所以需要设置 fromModule 为 inputModule
        if (!fromModule || fromModule.isAsset()) {
          fromModule = inputModule;
        }
        module = resolutionRequest.resolveDependency(fromModule, importee)
        console.log('resolveId resolveDependency path:', module.path);
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
        // 导入polyfills
        const codeArr = polyfills.map((polyfillPath) => `import '${isWin ? polyfillPath.replace(/\\/g, '\\\\') : polyfillPath}';`);
        // 导入runBeforeMainModule
        runBeforeMainModule.forEach((modulePath) => {
          codeArr.push(`import '${isWin ? modulePath.replace(/\\/g, '\\\\') : modulePath}';`);
        });
        // input
        codeArr.push(`import '${isWin ? input.replace(/\\/g, '\\\\') : input}';`);
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