## fork说明
lab-master 分支最初checkout 自 fackbook/0.36-stable，所有修改统一在该分支进行，
该分支版本保持与当前最新的react-native 稳定版一致,
通过 git merge facebook/xxx-stable
实现与最新分支的合并。
通过 git branch lab-xxx-stable 创建新的lab稳定分支,xxx 版本号与当前
lab-master合并的最新react-native 版本号一致,在lab-xxx-stable 分支通过
git merge origin/lab-master 实现与lab-master 同步

## 修改记录
所有修改以注释 'LAB modify'  标记
### js
* InitializeCore.js 修改Promise 使用bluebird
* Libraries/polyfills/polyfills.js __requireDefault
* Libraries/polyfills/polyfills.js Object.is
* ViewPagerAndroid.android.js 去除child 必须为View 的警告
### Android
* 修改android TextInput 减少在 oppo 上无法弹出键盘的问题(还是有问题) ReactAndroid/src/**/ReactEditText.java
* ReactViewPager.java 修复ViewPagerAndroid 在父View 为removeClippedSubviews 时 无法populate 的BUG
* PageScrollEvent.java 增加scroll value 为 mPosition + mOffset
* UIImplementation 对外暴露resolveShadowNode resolveView dispatchViewUpdatesIfNeeded
* TouchableNativeFeedback ReactViewGroup TNFHolder ReactViewCornerRippleDrawable (TODO flat/RCTView)
### cli
* react-native link 支持配置忽略某个平台 local-cli/core/config.index.js
* react-native link 支持配置android moduleName 代替默认的 'app' local-cli/core/config/android/index.js
* 修改 local-cli/link/android/patches/makeSettingsPatch.js 应用0.40 的方式
* 修改 local-cli/link/android/patches/makeImportPatch.js
* bundleCommandLineArgs.js 增加 --extra-build-options 参数
* rn-cli.config.js 增加 plugins 支持
### other
* .gitignore 未忽略android maven目录，使得npm可直接依赖该git分支，在发布前运行./gradlew installArchives

# TODO
extraBuildOptions 的完整支持 目前只支持 bundle