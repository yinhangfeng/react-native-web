'use strict';

const ReactDOM = require('react-dom');
const getLayout = require('./getLayout');

function layoutHandle() {
  const layout = getLayout(ReactDOM.findDOMNode(this));
  const lastLayout = this.$$lastLayout;
  if (!lastLayout || lastLayout.x !== layout.x || lastLayout.y !== layout.y || lastLayout.width !== layout.width || lastLayout.height !== layout.height) {
    this.props.onLayout({nativeEvent: {layout}});
    this.$$lastLayout = layout;
  }
}

// 让组件具有onLayout回调功能
// TODO 在componentDidMount和componentDidUpdate触发判断可能不合理
const LayoutMixin = {

  componentDidMount: function() {
    if (this.props.onLayout) {
      // TODO requestAnimationFrame 是否有必要?
      requestAnimationFrame(() => {
        // __isMounted 变量来自 create-react-class@15.6 IsMountedPreMixin IsMountedPostMixin
        if (this.__isMounted) {
          layoutHandle.call(this);
        }
      });
    }
  },

  componentDidUpdate: function() {
    if (this.props.onLayout) {
      layoutHandle.call(this);
    }
  },
};

module.exports = LayoutMixin;

