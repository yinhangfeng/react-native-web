'use strict';

const path = require('path');
const DependencyGraph = require('node-haste');
const {
  FileWatcher,
  Cache,
} = DependencyGraph;
const process = require('process');
const Transformer = require('../../packager/react-packager/src/JSTransformer');

const projectRoot = process.cwd();
const platform = 'android';
const entryPath = 'Libraries/react-native/react-native.js';
const blacklistRE = require('../../packager/blacklist')(platform);

const transformer = new Transformer({
  transformModulePath: require.resolve('../../packager/transformer'),
});

console.log('blacklistRE ', blacklistRE);

const cache = new Cache({
  cacheKey: '$$cacheKey$$',
});

let depGraph = new DependencyGraph({
  //activity: Activity,
  roots: [projectRoot],
  // assetRoots_DEPRECATED: opts.assetRoots,
  // assetExts: opts.assetExts,
  ignoreFilePath: function(filepath) {
    return filepath.indexOf('__tests__') !== -1 ||
      (blacklistRE.test(filepath));
  },
  providesModuleNodeModules: [
    'react',
    'react-native',
    // Parse requires AsyncStorage. They will
    // change that to require('react-native') which
    // should work after this release and we can
    // remove it from here.
    'parse',
  ],
  platforms: ['ios', 'android'],
  preferNativePlatform: true,
  fileWatcher: FileWatcher.createDummyWatcher(),
  cache,
  shouldThrowOnUnresolvedErrors: (_, platform) => platform === 'ios',
  transformCode: (module, code, options) => {
    return transformer.transformFile(module.path, code, options);
  },
  assetDependencies: ['react-native/Libraries/Image/AssetRegistry'],
});

depGraph.getDependencies({
  entryPath,
  platform,
  transformOptions: {
    minify: false,
    dev: true,
    platform,
  },
  recursive: true,
  onProgress: (e) => {
    //console.log('depGraph.getDependencies onProgress', e);
  },
}).then(
  resolutionResponse => {
    console.log('depGraph.getDependencies success:', resolutionResponse);
  },
  err => {
    console.log('depGraph.getDependencies error:', err);
  }
);
