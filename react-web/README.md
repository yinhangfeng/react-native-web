# 升级流程

更新svn中的react-native仓库(http://svn.studyinhand.com/appbuilder/lab4/reactweb/react-native-origin-master)到最新的稳定版
```
cd react-native-origin-master/react-native

//备份
svn cp http://svn.studyinhand.com/appbuilder/lab4/reactweb/react-native-origin-master/react-native http://svn.studyinhand.com/appbuilder/lab4/reactweb/react-native-origin-master/react-native-xxx-backup

//git 更新
git checkout master
git pull
git branch -b xxx-stable origin/xxx-stable

//svn 提交
svn ci -m 'xxx-stable'
```

merge http://svn.studyinhand.com/appbuilder/lab4/reactweb/react-native-origin-master 与 http://svn.studyinhand.com/appbuilder/lab4/reactweb/react-web-trunk
```
cd react-web-trunk
svn merge http://svn.studyinhand.com/appbuilder/lab4/reactweb/react-native-origin-master/react-native
// ... 解决合并冲突
```


# 当前版本
react-native 0.32.0同步完成
react-native-web 0.0.26 => 0.0.44
StyleSheet 相关完成
injectResponderEventPlugin 相关完成
