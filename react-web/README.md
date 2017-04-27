# 修改记录
* 对源代码增加最外层闭包 涉及文件 Resolver/index.js Resolver/polyfills/require.js Resolver/polyfills/babelHelpers.js Bundler/Bundle.js
* 图片资源asset中去掉不必要的字段__packager_asset fileSystemLocation hash 涉及文件 resolveAssetSource.web.js AssetSourceResolver.web.js Bundler/index.js

## rollup
rollup cli参数 配置是否使用rollup打包
Bundler/index.js createModuleIdFactory getModuleId 增加第二个参数name,可根据是否rollup 决定moduleId name或者数字
Resolver/index.js wrapModule 相应处理
buildBundle.js saveBundle 根据是否使用rollup 选择不同的output

# 升级流程
* 切出新的分支
* 与lab-xxx-stable 分支合并

# 版本升级
## 0.32
react-native 0.32.0同步完成
react-native-web 0.0.26 => 0.0.44
StyleSheet 相关完成
injectResponderEventPlugin 相关完成

## 0.40
初步可运行，结构调整完成，但所有.web.js 未与对应组件同步
