/**
 * @providesModule RWLayoutMixin
 */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import getLayout from 'RWGetLayout';

//让组件具有onLayout回调功能，在componentDidMount和componentDidUpdate触发判断可能不合理 TODO
var LayoutMixin = {

  componentDidMount: function() {
    if (this.props.onLayout) {
      setTimeout(this.$$layoutHandle);
    }
  },

  componentDidUpdate: function() {
    if (this.props.onLayout) {
      this.$$layoutHandle();
    }
  },

  $$layoutHandle: function() {
    let layout = getLayout(ReactDOM.findDOMNode(this));
    let lastLayout = this.$$lastLayout;
    if (!lastLayout || lastLayout.x !== layout.x || lastLayout.y !== layout.y || lastLayout.width !== layout.width || lastLayout.height !== layout.height) {
      this.props.onLayout({nativeEvent: {layout}});
      this.$$lastLayout = layout;
    }
  }
};

module.exports = LayoutMixin;
