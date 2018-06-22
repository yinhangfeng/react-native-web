/**
 */

'use strict';

function isElementVisible(ele) {
  return ele && ele.clientHeight && (getComputedStyle(ele).visibility !== 'hidden');
}

let BodyScrollHelper = {

  _enabled: true,
  _listeners: [],

  /**
   * 添加scroll listener
   * @param listener body scroll 回调
   *     参数 event: scroll event
   *         scrollTop: body.scrollTop
   * @param getElement 获取组件根dom元素,用于判断是否可见
   * 通过clientHeight与visibility 判断是否可见
   */
  addScrollListener(listener, getElement) {
    if (this._listenerIndex(listener) >= 0) {
      return;
    }
    this._listeners.push({
      listener,
      getElement,
    });
    if (this._listeners.length === 1) {
      window.addEventListener('scroll', this._onBodyScroll);
    }
  },

  removeScrollListener(listener) {
    let index = this._listenerIndex(listener);
    if (index >= 0) {
      this._listeners.splice(index, 1);
      if (!this._listeners.length) {
        window.removeEventListener('scroll', this._onBodyScroll);
      }
    }
  },

  /**
   * 设置scroll事件是否回调,用于在navigator转场动画过程中临时关闭作用
   */
  setScrollEnabled(enabled) {
    this._enabled = enabled;
  },

  _listenerIndex(listener) {
    for (let i = 0; i < this._listeners.length; ++i) {
      if (listener === this._listeners[i].listener) {
        return i;
      }
    }
    return -1;
  },

  _onBodyScroll(e) {
    // console.log('_onBodyScroll ', this._enabled);
    if (!this._enabled) {
      return;
    }
    if (!this._current || !isElementVisible(this._current.getElement())) {
      this._current = null;
      for (let i = 0; i < this._listeners.length; ++i) {
        let listenerConfig = this._listeners[i];
        if (isElementVisible(listenerConfig.getElement())) {
          this._current = listenerConfig;
        }
      }
    }
    if (this._current) {
      this._current.listener(e);
    }
  },

};

BodyScrollHelper._onBodyScroll = BodyScrollHelper._onBodyScroll.bind(BodyScrollHelper);

module.exports = BodyScrollHelper;
