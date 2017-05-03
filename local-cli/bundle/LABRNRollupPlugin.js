'use strict';

const VIRTUAL_ENTRY = 'lab-rollup-virtual-entry';

const polyfills = [
  require.resolve('../../packager/react-packager/src/Resolver/polyfills/polyfills.js'),
  require.resolve('../../packager/react-packager/src/Resolver/polyfills/error-guard.js'),
  require.resolve('../../packager/react-packager/src/Resolver/polyfills/Number.es6.js'),
  require.resolve('../../packager/react-packager/src/Resolver/polyfills/String.prototype.es6.js'),
  require.resolve('../../packager/react-packager/src/Resolver/polyfills/Array.prototype.es6.js'),
  require.resolve('../../packager/react-packager/src/Resolver/polyfills/Array.es6.js'),
  require.resolve('../../packager/react-packager/src/Resolver/polyfills/Object.es7.js'),
  // require.resolve('../../react-packager/src/Resolver/polyfills/babelHelpers.js'), // babel plugin 内置
];

const prelude = require.resolve('../../packager/react-packager/src/Resolver/polyfills/prelude.js');
const prelude_dev = require.resolve('../../packager/react-packager/src/Resolver/polyfills/prelude_dev.js');

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
 * }
 */
module.exports = function LABRN(config) {
  const resolutionRequest = config.resolutionRequest;
  const moduleCache = resolutionRequest.getModuleCache();
  const bundler = config.bundler;
  const dev = config.dev;
  const assetsOutput = config.assetsOutput;
  const platform = config.platform;

  let entry;

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
          moduleCache.getModule(importee);
        } else {
          // polyfills
        }
        return importee;
      }
      if (moduleCache._moduleCache[importer]) {
        return resolutionRequest.resolveDependency(moduleCache.getModule(importer), importee)
          .then((module) => {
            console.log('resolveId resolveDependency path:', module.path);
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
        let codeArr;
        let pfs = dev ? [prelude_dev] : [prelude];
        pfs = pfs.concat(polyfills);
        codeArr = pfs.map((polyfillPath, idx) => `import x${idx} from '${polyfillPath}';`);
        codeArr.push(`import entry from '${entry}';`);
        return codeArr.join('\n');
      }
      if (moduleCache._moduleCache[id]) {
        const module = moduleCache.getModule(id);
        if (module.isAsset()) {
          return bundler.generateAssetObjAndCode(module, [] /* assetPlugins */, platform)
            .then(({asset, code, meta}) => {
              assetsOutput.push(asset);
              return code;
            });
        }
      }
    },

    // transformBundle(source, { format }) {
    //   return `(function(global) { ${source} })(window);`;
    // },
  };
}