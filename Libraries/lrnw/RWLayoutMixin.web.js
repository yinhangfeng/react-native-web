/**
 * @providesModule RWLayoutMixin
 */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import getLayout from 'RWGetLayout';

function layoutHandle() {
  let layout = getLayout(ReactDOM.findDOMNode(this));
  let lastLayout = this.$$lastLayout;
  if (!lastLayout || lastLayout.x !== layout.x || lastLayout.y !== layout.y || lastLayout.width !== layout.width || lastLayout.height !== layout.height) {
    this.props.onLayout({nativeEvent: {layout}});
    this.$$lastLayout = layout;
  }
}

//让组件具有onLayout回调功能，在componentDidMount和componentDidUpdate触发判断可能不合理 TODO
const LayoutMixin = {

  componentDidMount: function() {
    if (this.props.onLayout) {
      requestAnimationFrame(() => {
        if (this.isMounted()) {
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

export { LayoutMixin };
export default LayoutMixin;

