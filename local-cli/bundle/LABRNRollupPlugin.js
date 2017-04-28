'use strict';

module.exports = function LABRN(config) {
  const resolutionRequest = config.resolutionRequest;
  const moduleCache = resolutionRequest.getModuleCache();
  const bundler = config.bundler;

  return {
    name: 'LABRN',
    
    resolveId(importee, importer) {
      console.log('resolveId', importee, importer);
      if (importer == null) {
        const entryModule = moduleCache.getModule(importee);
        return importee;
      }
      return resolutionRequest.resolveDependency(moduleCache.getModule(importer), importee)
        .then((module) => module.path);
    },

    load(id) {
      console.log('load', id);
      const module = moduleCache.getModule(id);
      if (module.isAsset()) {
        return bundler.generateAssetObjAndCode(module, null /* assetPlugins */, platform)
          .then(([name, {asset, code, meta}]) => {
            return code;
          });
      }
    }
  };
}