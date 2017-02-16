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
* .gitignore
未忽略android maven目录，使得npm可直接依赖该git分支，在发布前运行./gradlew installArchives
### js
* 修复NavigationTransitioner push过程中replace 引起的并发问题this._isTransitioning
### react-native link
* react-native link 支持忽略 local-cli/core/config.index.js
* react-native link 支持配置android moduleName 代替默认的'app' local-cli/core/config/android/index.js
* 修改 local-cli/link/android/patches/makeSettingsPatch.js  应用0.40 的方式
* 修改 local-cli/link/android/patches/makeImportPatch.js
### Android
* 修改android TextInput 减少在oppo上无法弹出键盘的问题(还是有问题) ReactAndroid/src/**/ReactEditText.java
* 修改ARTShapeShadowNode.java 修复绘制时的PATH_TYPE_ARC错误
* ReactViewPager.java 修复ViewPagerAndroid 在父View为removeClippedSubviews时 无法populate的BUG
* ViewPagerAndroid 
### other
* 修改packager Server 支持serverBuildBundleInterceptor  packager/react-packager/src/Server/index.js