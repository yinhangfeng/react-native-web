所有修改以注释 'LAB modify'  标记
lab-master 分支最初checkout 自 fackbook/0.36-stable，所有修改统一在该分支进行，
该分支版本保持与当前最新的react-native 稳定版一致,通过 git merge facebook/xxx-stable
实现与最新分支的合并，通过 git branch lab-xxx-stable 创建新的lab稳定分支,xxx 版本号与当前
lab-master合并的最新react-native 版本号一致,在lab-xxx-stable 分支通过
git merge origin/lab-master 实现与lab-master 同步

切出的发布分支lab-xxx-stable 中未忽略android maven目录，使得npm可直接依赖该git分支，在发布前运行./gradlew installArchives
