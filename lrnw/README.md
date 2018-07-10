# 修改记录

## Libraries

* flow class 成员变量定义问题 当前 babel 设置与 RN 不同 导致代码转换之后 在调用 super constructor 之后会执行 this.xxx = void 0
  * VirtualizedList 注释掉 props: Props; 定义
  * createAnimatedComponent AnimatedComponent 注释掉 _setComponentRef

## rollup 已废弃
rollup cli参数 配置是否使用rollup打包
buildBundle.js saveBundle 根据是否使用rollup 选择不同的output
