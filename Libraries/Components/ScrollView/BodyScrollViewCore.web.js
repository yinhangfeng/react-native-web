'use strict';

const ReactNative = require('ReactNative');
const React = require('React');
const View = require('View');
const CSSClassNames = require('CSSClassNames');
const BodyScrollHelper = require('RWBodyScrollHelper');

class BodyScrollViewCore {
  constructor(scrollView) {
    this._scrollView = scrollView;

    this._handleScroll = this._handleScroll.bind(this);
    this._getContainerElement = this._getContainerElement.bind(this);
  }

  getScrollableNode() {
    // XXX
    return document.body;
  }

  getInnerViewNode() {
    // XXX
    return this._scrollView._innerViewNode;
  }

  scrollTo(x, y, animated) {
    // TODO
    document.body.scrollTop = y;
  }

  _handleScroll(e) {
    let nativeEvent = e.nativeEvent;
    if (!nativeEvent) {
      nativeEvent = e.nativeEvent = {};
    }
    let scrollView = this._scrollView._scrollViewNode;
    nativeEvent.contentOffset = {
      x: 0,
      y: document.body.scrollTop,
    };
    nativeEvent.layoutMeasurement = {
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    };
    nativeEvent.contentSize = {
      width: document.body.scrollWidth,
      height: document.body.scrollHeight,
    };
    this._scrollView.props.onScroll && this._scrollView.props.onScroll(e);
  }

  _getContainerElement() {
    return this._scrollView._scrollViewNode;
  }

  destroy() {
    if (this._isScrollListened) {
      this._isScrollListened = false;
      BodyScrollHelper.removeScrollListener(this._handleScroll);
    }
  }

  render() {
    let props = this._scrollView.props;
    let contentContainer =
      <View
        ref={this._scrollView._setInnerRef}
        style={props.contentContainerStyle}
        removeClippedSubviews={props.removeClippedSubviews}
        collapsable={false}
        onLayout={props.onContentSizeChange && this._scrollView._handleContentOnLayout}>
        {props.children}
      </View>;

    let className = 'lrnw-body-scroll-view';
    if (props.className) {
      className += ' ' + props.className;
    }

    if (props.onScroll) {
      if (!this._isScrollListened) {
        this._isScrollListened = true;
        BodyScrollHelper.addScrollListener(this._handleScroll, this._getContainerElement);
      }
    } else {
      if (this._isScrollListened) {
        this._isScrollListened = false;
        BodyScrollHelper.removeScrollListener(this._handleScroll);
      }
    }

    return (
      <View
        {...props}
        ref={this._scrollView._setContainerRef}
        className={className}
        style={props.style}>
        {contentContainer}
      </View>
    );
  }
}

module.exports = BodyScrollViewCore;
