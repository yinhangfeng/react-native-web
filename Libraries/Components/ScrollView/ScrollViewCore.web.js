'use strict';

const ReactNative = require('ReactNative');
const React = require('React');
const View = require('View');
const StyleSheet = require('StyleSheet');
const flattenStyle = require('flattenStyle');
const CSSClassNames = require('CSSClassNames');

class ScrollViewCore {
  constructor(scrollView) {
    this._scrollView = scrollView;

    this._handleScroll = this._handleScroll.bind(this);
  }

  getScrollableNode() {
    return this._scrollView._scrollViewNode;
  }

  getInnerViewNode() {
    return this._scrollView._innerViewNode;
  }

  scrollTo(x, y, animated) {
    let scrollView = this._scrollView._scrollViewNode;
    scrollView.scrollTop = y || 0;
    scrollView.scrollLeft = x || 0;
  }

  _handleScroll(e) {
    let nativeEvent = e.nativeEvent;
    if (!nativeEvent) {
      nativeEvent = e.nativeEvent = {};
    }
    let scrollView = this._scrollView._scrollViewNode;
    nativeEvent.contentOffset = {
      x: scrollView.scrollLeft,
      y: scrollView.scrollTop,
    };
    nativeEvent.layoutMeasurement = {
      width: scrollView.clientWidth,
      height: scrollView.clientHeight,
    };
    nativeEvent.contentSize = {
      width: scrollView.scrollWidth,
      height: scrollView.scrollHeight,
    };
    this._scrollView.scrollResponderHandleScroll(e);
  }

  destroy() {
  }

  render() {
    let props = this._scrollView.props;
    let contentContainer =
      <View
        className={props.horizontal ? (CSSClassNames.SCROLL_VIEW_CONTENT + ' ' + CSSClassNames.SCROLL_VIEW_CONTENT_H) : CSSClassNames.SCROLL_VIEW_CONTENT}
        ref={this._scrollView._setContainerRef}
        style={props.contentContainerStyle}
        removeClippedSubviews={props.removeClippedSubviews}
        collapsable={false}
        onLayout={props.onContentSizeChange && this._scrollView._handleContentOnLayout}>
        {props.children}
      </View>;

    let className = CSSClassNames.SCROLL_VIEW;
    if (props.horizontal) {
      className += ' ' + CSSClassNames.SCROLL_VIEW_H;
    }
    if (props.horizontal ? (!props.showsHorizontalScrollIndicator) : (!props.showsVerticalScrollIndicator)) {
      //web 滚动条效果不好 默认隐藏 有需要再显示
      className += ' ' + CSSClassNames.SCROLLBAR_NONE;
    }
    if (props.className) {
      className += ' ' + props.className;
    }

    let style = flattenStyle([styles.base, props.style]);
    if (style.flex && !style.flexBasis) {
      //对设置了flex，将flexBasis设为0 解决有些浏览器不可滚动的bug 0, 0px 与0%不同?
      style.flexBasis = 0;
    }

    let containerProps = {
      ...props,
      ref: this._scrollView._setContainerRef,
      className: className,
      style: style,
      onTouchStart: this._scrollView.scrollResponderHandleTouchStart,
      onTouchMove: this._scrollView.scrollResponderHandleTouchMove,
      onTouchEnd: this._scrollView.scrollResponderHandleTouchEnd,
      onScrollBeginDrag: this._scrollView.scrollResponderHandleScrollBeginDrag,
      onScrollEndDrag: this._scrollView.scrollResponderHandleScrollEndDrag,
      onMomentumScrollBegin: this._scrollView.scrollResponderHandleMomentumScrollBegin,
      onMomentumScrollEnd: this._scrollView.scrollResponderHandleMomentumScrollEnd,
      onStartShouldSetResponder: this._scrollView.scrollResponderHandleStartShouldSetResponder,
      onStartShouldSetResponderCapture: this._scrollView.scrollResponderHandleStartShouldSetResponderCapture,
      onScrollShouldSetResponder: this._scrollView.scrollResponderHandleScrollShouldSetResponder,
      onScroll: this._handleScroll,
      onResponderGrant: this._scrollView.scrollResponderHandleResponderGrant,
      onResponderTerminationRequest: this._scrollView.scrollResponderHandleTerminationRequest,
      onResponderTerminate: this._scrollView.scrollResponderHandleTerminate,
      onResponderRelease: this._scrollView.scrollResponderHandleResponderRelease,
      onResponderReject: this._scrollView.scrollResponderHandleResponderReject,
      // sendMomentumEvents: (props.onMomentumScrollBegin || props.onMomentumScrollEnd) ? true : false,
    };

    //containerProps = require('RWTouchTest').assignLog(containerProps, 'ScrollView');

    return (
      <View
        {...containerProps}>
        {contentContainer}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
});

module.exports = ScrollViewCore;
