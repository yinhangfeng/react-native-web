## fork说明

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
* UIImplementation 对外暴露 resolveView dispatchViewUpdatesIfNeeded
* TouchableNativeFeedback ReactViewGroup TNFHolder ReactViewCornerRippleDrawable (TODO flat/RCTView)
* ReactImageView.java loadingIndicatorAnimated 在 mLoadingImageDrawable 变为null 时 正确设置PlaceholderImage
### cli
* react-native link 支持配置忽略某个平台 local-cli/core/config.index.js
* react-native link 支持配置android moduleName 代替默认的 'app' local-cli/core/config/android/index.js
* 修改 local-cli/link/android/patches/makeSettingsPatch.js 应用0.40 的方式
* 修改 local-cli/link/android/patches/makeImportPatch.js
* local-cli/util/Config.js findOptional 只查找项目根目录(与yarn本地git安装 npm5 本地安装兼容)
### other
* .gitignore 未忽略android maven目录，使得npm可直接依赖该git分支，在发布前运行./gradlew installArchives

# TODO
extraBuildOptions 的完整支持 目前只支持 bundle