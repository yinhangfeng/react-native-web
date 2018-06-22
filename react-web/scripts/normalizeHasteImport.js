'use strict';

const fs = require('fs');
const path = require('path');
const JestHasteMap = require('jest-haste-map');

const projectRoot = path.resolve(__dirname, '../../');
const librariesDir = path.resolve(projectRoot, 'Libraries');

const IMPORT_RE = /(\bimport\s+(?:[^'"]+\s+from\s+)??)(['"])([^'"\/]+)(\2)/g;
const REQUIRE_RE = /(\brequire\s*?\(\s*?)(['"])([^'"\/]+)(\2\s*?\))/g;

async function normalizeHasteImport() {
  const useWatchman = true;
  const haste = new JestHasteMap({
    computeSha1: true,
    extensions: ['js'],
    forceNodeFilesystemAPI: !useWatchman,
    hasteImplModulePath: require.resolve('../../jest/hasteImpl'),
    ignorePattern: / ^/,
    maxWorkers: 1,
    mocksPattern: '',
    name: 'metro-normalizeHasteImport',
    platforms: ['android', 'ios', 'web'],
    providesModuleNodeModules: ['react-native'],
    retainAllFiles: true,
    roots: [path.resolve(__dirname, '../../')],
    throwOnModuleCollision: true,
    useWatchman,
    watch: false,
    resetCache: true,
  });

  const {hasteFS, moduleMap} = await haste.build();

  function normalizeFile(file) {
    const fileStat = fs.lstatSync(file);
    if (fileStat.isDirectory()) {
      const children = fs.readdirSync(file);
      for (const child of children) {
        normalizeFile(path.resolve(file, child));
      }
    } else if (file.endsWith('.js')) {
      replaceHasteImport(file);
    }
  }
  
  function replaceHasteImport(file) {
    console.log('replaceHasteImport', file);
  
    let platform;
    if (file.endsWith('.ios.js')) {
      platform = 'ios';
    } else if (file.endsWith('.android.js')) {
      platform = 'android';
    } else if (file.endsWith('.web.js')) {
      platform = 'web';
    } else {
      platform = 'web';
    }

    function replaceFunc(match, pre, quot, dep, post) {
      const depModule = moduleMap.getModule(dep, platform, true);
      if (!depModule) {
        return match;
      }
      
      let depRn = `react-native/${path.relative(projectRoot, depModule)}`;
      depRn = depRn.replace(/(?:\.(?:android|ios|web|native))?\.js$/, '');

      console.log('replace haste dependency:', dep, depRn);

      return `${pre}${quot}${depRn}${post}`;
    }

    let code = fs.readFileSync(file, 'utf8');
    code = code
      .replace(IMPORT_RE, replaceFunc)
      .replace(REQUIRE_RE, replaceFunc);

    fs.writeFileSync(file, code, 'utf8');

    console.log();
  }

  normalizeFile(librariesDir);
  normalizeFile(path.resolve(projectRoot, 'lib'));
  normalizeFile(path.resolve(projectRoot, 'RNTester'));
}

normalizeHasteImport().then(() => {
  console.log('normalizeHasteImport success');
});