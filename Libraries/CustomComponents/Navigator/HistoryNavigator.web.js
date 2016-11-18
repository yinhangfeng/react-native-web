/**
 * @providesModule HistoryNavigator
 */
'use strict';

const NavigationContext = require('NavigationContext');
// const NavigatorBreadcrumbNavigationBar = require('NavigatorBreadcrumbNavigationBar');
// const NavigatorNavigationBar = require('NavigatorNavigationBar');
const NavigatorSceneConfigs = require('NavigatorSceneConfigs');
const React = require('React');
const StyleSheet = require('StyleSheet');
const Subscribable = require('Subscribable');
const TimerMixin = require('react-timer-mixin');
const View = require('View');

const flattenStyle = require('flattenStyle');
const invariant = require('fbjs/lib/invariant');

const PropTypes = React.PropTypes;
const createWebCoreElement = require('createWebCoreElement');
const ReactDOM = require('react/lib/ReactDOM');
const CSSClassNames = require('CSSClassNames');
const createHistory = require('history/lib/createBrowserHistory');
const HistoryActions = require('history/lib/Actions');
const ScrollBehavior = require('./ScrollBehavior');

const RWConfig = require('RWConfig');
const BodyScrollHelper = require('RWBodyScrollHelper');

const TRANSITION_DURATION = 350;
const ROUTE_KEY = '__navigatorRouteID'; //标记唯一route 的key 在route 以及location.state上设置

let __uid = 0;
function getuid() {
  return Math.random().toString(36).substr(2, 10) + (++__uid);
}

function definePrivateProperty(obj, key, value) {
  Object.defineProperty(obj, key, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: value,
  });
}

function getRouteID(route) {
  if (route === null || typeof route !== 'object') {
    return String(route);
  }

  if (!route.hasOwnProperty(ROUTE_KEY)) {
    definePrivateProperty(route, ROUTE_KEY, getuid());
  }
  return route[ROUTE_KEY];
}

// styles moved to the top of the file so getDefaultProps can refer to it
const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});

/**
 * 基于history库的Navigator
 * 依赖https://github.com/mjackson/history 3.2.1
 * location: {
 *   pathname,
 *   search,
 *   hash,
 *   state: {
 *     __historyKey, //内部使用用于唯一标记history replaceAtIndex 时新创的location会与原location拥有相同的__historyKey
 *   },
 *   action, //history库内部生成
 *   key, //history 库内部使用 唯一标记一个location
 * }
 *
 * route: {
 * 	 __navigatorRouteID, //内部使用的route 唯一的key 不可枚举
 * 	 __location, //route 对应的location 内部使用 不可枚举
 *   ...自定义属性
 * }
 *
 * NOTE
 * 1.push replace 不支持history 的confirmTransitionTo功能
 * 2.目前sceneConfig 不起作用
 * 3.如果发生了浏览器history stack 与内部维持的routeStack 不一致的情况，则popToRoute可能工作不正常
 * 4.replaceAtIndex 不会立即修改浏览器的history 下一次会退到被修改的index时会触发 replace，所以如果replaceAtIndex之后刷新浏览器再返回是没有效果的
 * 5.jump 相关api 统一使用history.go 所以表现跟popN 相同,处于当前scene之上的不会保持
 * 6.暂不支持navigationBar
 *
 * TODO
 * 在转场动画过程中 阻止body滚动事件向下传递window.addEventListener('scroll', function(e) {console.log('xxx');e.stopPropagation()}, true)
 */
const Navigator = React.createClass({

  propTypes: {
    /**
     * Optional function that allows configuration about scene animations and
     * gestures. Will be invoked with the route and the routeStack and should
     * return a scene configuration object
     *
     * ```
     * (route, routeStack) => Navigator.SceneConfigs.FloatFromRight
     * ```
     *
     * Available options are:
     *
     *  - Navigator.SceneConfigs.PushFromRight (default)
     *  - Navigator.SceneConfigs.FloatFromRight
     *  - Navigator.SceneConfigs.FloatFromLeft
     *  - Navigator.SceneConfigs.FloatFromBottom
     *  - Navigator.SceneConfigs.FloatFromBottomAndroid
     *  - Navigator.SceneConfigs.FadeAndroid
     *  - Navigator.SceneConfigs.HorizontalSwipeJump
     *  - Navigator.SceneConfigs.HorizontalSwipeJumpFromRight
     *  - Navigator.SceneConfigs.VerticalUpSwipeJump
     *  - Navigator.SceneConfigs.VerticalDownSwipeJump
     *
     */
    configureScene: PropTypes.func,

    /**
     * Required function which renders the scene for a given route. Will be
     * invoked with the route and the navigator object
     *
     * ```
     * (route, navigator) =>
     *   <MySceneComponent title={route.title} navigator={navigator} />
     * ```
     */
    renderScene: PropTypes.func.isRequired,

    /**
     * Specify a route to start on. A route is an object that the navigator
     * will use to identify each scene to render. `initialRoute` must be
     * a route in the `initialRouteStack` if both props are provided. The
     * `initialRoute` will default to the last item in the `initialRouteStack`.
     */
    initialRoute: PropTypes.object,

    /**
     * Provide a set of routes to initially mount. Required if no initialRoute
     * is provided. Otherwise, it will default to an array containing only the
     * `initialRoute`
     */
    initialRouteStack: PropTypes.arrayOf(PropTypes.object),

    /**
     * Will emit the target route upon mounting and before each nav transition
     */
    onWillFocus: PropTypes.func,

    /**
     * Will be called with the new route of each scene after the transition is
     * complete or after the initial mounting
     */
    onDidFocus: PropTypes.func,

    /**
     * Optionally provide a component as navigation bar that persists across scene
     * transitions. The component will receive two props: `navigator` and `navState`.
     * It will be rerendered when the routes change.
     */
    navigationBar: PropTypes.node,

    /**
     * Optionally provide the navigator object from a parent Navigator
     */
    navigator: PropTypes.object,

    /**
     * Styles to apply to the container of each scene
     */
    sceneStyle: View.propTypes.style,

    //
    //web下history 扩展
    //

    /**
     * history对象
     */
    history: PropTypes.object.isRequired,

    /**
     * route 转 history location
     * (route) => location
     */
    routeToLocation: PropTypes.func.isRequired,

    /**
     * history location 转 route
     * (location) => route
     * 返回null 表示location 没有对应的route 此时Navigator 不会做处理
     */
    locationToRoute: PropTypes.func.isRequired,

    /**
     * 最大scene历史堆栈的大小
     * 超出之后会删除最底部的scene,返回已被删除的scene 会重新加载,如果需要保持所有可设为Number.MAX_VALUE
     */
    maxSceneStackSize: PropTypes.number,

    /**
     * 是否使用body滚动模式
     * 影响container 和 scene 的布局样式
     */
    bodyScrollMode: PropTypes.bool,

    /**
     * 是否在scene切换时记住滚动位置
     */
    recordScrollPosition: PropTypes.bool,

  },

  statics: {
    // BreadcrumbNavigationBar: NavigatorBreadcrumbNavigationBar,
    // NavigationBar: NavigatorNavigationBar,
    SceneConfigs: NavigatorSceneConfigs,
  },

  mixins: [TimerMixin, Subscribable.Mixin],

  getChildContext(): Object {
    return {_isInAParentNavigator: true};
  },
  childContextTypes: {
    _isInAParentNavigator: React.PropTypes.bool
  },
  contextTypes: {
    _isInAParentNavigator: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      configureScene: () => NavigatorSceneConfigs.PushFromRight,
      maxSceneStackSize: 5,
    };
  },

  _bodyScrollMode: function() {
    if (this.props.bodyScrollMode != null) {
      return this.props.bodyScrollMode;
    }
    return !this.context._isInAParentNavigator && RWConfig.bodyScrollMode;
  },

  _recordScrollPosition: function() {
    if (this.props.recordScrollPosition != null) {
      return this.props.recordScrollPosition;
    }
    return this._bodyScrollMode();
  },

  getInitialState: function() {
    this._navigationBarNavigator = this.props.navigationBarNavigator || this;

    this._renderedSceneMap = new Map();

    let routeStack = this.props.initialRouteStack || [this.props.initialRoute];
    invariant(
      routeStack.length >= 1,
      'Navigator requires props.initialRoute or props.initialRouteStack.'
    );
    let initialRouteIndex = routeStack.length - 1;
    if (this.props.initialRoute) {
      initialRouteIndex = routeStack.indexOf(this.props.initialRoute);
      invariant(
        initialRouteIndex !== -1,
        'initialRoute is not in initialRouteStack.'
      );
    }
    return {
      sceneConfigStack: routeStack.map(
        (route) => this.props.configureScene(route, routeStack)
      ),
      routeStack,
      presentedIndex: initialRouteIndex, //当前scene index
      pendingPresentedIndex: null, //将要显示的index 一般是push目标
      transitionFromIndex: null, //转场动画过程中 from index 目标为presentedIndex
      transitionQueue: [],
    };
  },

  componentWillMount: function() {
    // TODO(t7489503): Don't need this once ES6 Class landed.
    this.__defineGetter__('navigationContext', this._getNavigationContext);

    this._subRouteFocus = [];
    this.parentNavigator = this.props.navigator;
    this._handlers = {};
    this._emitWillFocus(this.state.routeStack[this.state.presentedIndex]);

    //同步浏览器history与初始堆栈 TODO
    let routeStack = this.state.routeStack;
    if (routeStack.length) {
      this._historyTransitionTo(this._getRouteLocation(routeStack[0]), HistoryActions.REPLACE);
      for (let i = 1; i <= this.state.presentedIndex; ++i) {
        this._historyTransitionTo(this._getRouteLocation(routeStack[i]), HistoryActions.PUSH);
      }
    }

    this._unListenHistory = this.props.history.listen((location) => {
      // PUSH 与 REPLACE 直接改变堆栈,不依赖listen
      switch (location.action) {
        case HistoryActions.POP:
          // 浏览器window的 popstate事件,可能是浏览器的前进后退或者js调用history.go等
          this._handlePopState(location);
          break;
      }
    });

    if (this._recordScrollPosition()) {
      this._scrollBehavior = new ScrollBehavior(this.props.history, this.props.history.getCurrentLocation);
      this._scrollBehavior.start();
    }
  },

  componentDidMount: function() {
    this._emitDidFocus(this.state.routeStack[this.state.presentedIndex]);
  },

  componentWillUnmount: function() {
    if (this._navigationContext) {
      this._navigationContext.dispose();
      this._navigationContext = null;
    }

    this._unListenHistory && this._unListenHistory();

    if (this._scrollBehavior) {
      this._scrollBehavior.destroy();
    }
  },

  _handlePopState: function(location) {
    let historyKey = location.state && location.state.__historyKey;
    if (!historyKey) {
      //对不存在historyKey 的不做处理
      //目前发现 在4.4android上 页面加载完成之后会触发一次popstate，其url就是当前页面的url,所以如果做处理push，就会导致错误
      return;
    }
    let routeStack = this.state.routeStack;
    let popIndex = null;
    // 从当前焦点scene 栈底找
    let i = this.state.presentedIndex >= routeStack.length ? routeStack.length - 1 : this.state.presentedIndex;
    for (; i >= 0; --i) {
      if (this._getRouteLocation(routeStack[i]).state.__historyKey === historyKey) {
        popIndex = i;
        break;
      }
    }

    if (popIndex != null) {
      // 存在目标route 一般是浏览器返回或者history.go(-n)
      let targetRoute = this.state.routeStack[popIndex];
      if (this._getRouteLocation(targetRoute).key !== location.key) {
        // pop 目标的route 已被replaceAtIndex,执行延迟replace
        this._historyTransitionTo(this._getRouteLocation(targetRoute), HistoryActions.REPLACE);
      }

      // transition到目标scene
      let presentedRoute = this.state.routeStack[this.state.presentedIndex];
      let popSceneConfig = this.props.configureScene(presentedRoute);
      this._emitWillFocus(this.state.routeStack[popIndex]);
      if (!this.refs['scene_' + popIndex]) {
        // 由于设置了maxSceneStackSize 不会保持所有scene 都处于stack中，所以pop 的目标scene 可能没有mount，
        // 需要先setState 设置pendingPresentedIndex 等待场景渲染完成
        this.setState({
          pendingPresentedIndex: popIndex,
        }, () => {
          this._enableScene(popIndex);
          this.state.pendingPresentedIndex = null;
          this._transitionTo(
            popIndex,
            popSceneConfig.defaultTransitionVelocity,
            null,
            () => {
              if (routeStack === this.state.routeStack) {
                this._cleanScenesPastIndex(popIndex > this.state.presentedIndex ? popIndex : this.state.presentedIndex);
              }
            }
          );
        });
      } else {
        this._enableScene(popIndex);
        this._transitionTo(
          popIndex,
          popSceneConfig.defaultTransitionVelocity,
          null,
          () => {
            if (routeStack === this.state.routeStack) {
              // XXX
              this._cleanScenesPastIndex(popIndex > this.state.presentedIndex ? popIndex : this.state.presentedIndex);
            }
          }
        );
      }
    } else {
      // 不存在目标route 可能是浏览器前进、history.go(n) 或者浏览器history堆栈与routeStack不一致
      let targetRoute = this._locationToRoute(location);
      if (targetRoute) {
        this._push(targetRoute);
      }
    }
  },

  /**
   * 获取route 对应的location
   */
  _getRouteLocation: function(route, historyKey) {
    if (route.__location) {
      return route.__location;
    }
    let location = this.props.routeToLocation(route);
    if (!historyKey) {
      historyKey = getuid();
    }
    location.state = {
      ...location.state,
      __historyKey: historyKey,
    };
    let isPathEmpty = !location.pathname;
    location = this.props.history.createLocation(location, null);
    if (isPathEmpty) {
      // 修改history的默认行为，不给pathname 使用空而不是'/'
      location.pathname = '';
    }
    definePrivateProperty(route, '__location', location);
    return location;
  },

  _locationToRoute: function(location) {
    let route = this.props.locationToRoute(location);
    if (route && !route.__location) {
      definePrivateProperty(route, '__location', location);
    }
    return route;
  },

  _transitionTo: function(destIndex, velocity, jumpSpringTo, cb) {
    if (this.state.presentedIndex === destIndex) {
      let dom = this._getSceneDOM(this.state.presentedIndex);
      if (dom) {
        dom.classList.remove('hide');
      }
      cb && cb();
      return;
    }

    if (this.state.transitionFromIndex !== null) {
      // Navigation is still transitioning, put the `destIndex` into queue.
      this.state.transitionQueue.push({
        destIndex,
        velocity,
        cb,
      });
      return;
    }

    this.state.transitionFromIndex = this.state.presentedIndex;
    this.state.presentedIndex = destIndex;
    this.state.transitionCb = cb;
    this._onAnimationStart();
    let sceneConfig = this.state.sceneConfigStack[this.state.transitionFromIndex] ||
      this.state.sceneConfigStack[this.state.presentedIndex];
    invariant(
      sceneConfig,
      'Cannot configure scene at index ' + this.state.transitionFromIndex
    );

    //转场动画开始 停止scroll 监听
    if (this._scrollBehavior) {
      this._scrollBehavior.stop();
    }
    if (!this.context._isInAParentNavigator) {
      BodyScrollHelper.setScrollEnabled(false);
    }

    this._processSceneTransform(this.state.transitionFromIndex, this.state.transitionFromIndex > this.state.presentedIndex ? 'lrnw-fadeout' : null);
    this._processSceneTransform(this.state.presentedIndex, this.state.presentedIndex > this.state.transitionFromIndex ? 'lrnw-fadein' : null);

    // XXX 暂时使用setTimeout触发动画结束，最好监测css动画
    setTimeout(this._completeTransition, TRANSITION_DURATION);
  },

  _processSceneTransform(index, animClassName) {
    let sceneDOM = this._getSceneDOM(index);
    if (sceneDOM) {
      let sceneScrollTop;
      if (this._scrollBehavior) {
        sceneScrollTop = this._scrollBehavior.getLocationScrollTop(this._getRouteLocation(this.state.routeStack[index]));
      }
      let classList = sceneDOM.classList;
      classList.add('transition');
      classList.remove('hide');
      if (sceneScrollTop && sceneDOM.firstChild) {
        sceneDOM.firstChild.style.transform = `translateY(${-sceneScrollTop}px)`;
      }
      if (animClassName) {
        classList.add(animClassName);
      }
    }
  },

  _getSceneDOM: function(index) {
    let ref = this.refs['scene_' + index];
    if (ref) {
      return ReactDOM.findDOMNode(ref);
    }
  },

  _clearSceneTransition: function(index) {
    let sceneDOM = this._getSceneDOM(index);
    if (sceneDOM) {
      let classList = sceneDOM.classList;
      classList.remove('transition');
      classList.remove('lrnw-fadein');
      classList.remove('lrnw-fadeout');
      if (sceneDOM.firstChild) {
        sceneDOM.firstChild.style.transform = '';
      }
    }
  },

  /**
   * This happens at the end of a transition started by transitionTo, and when the spring catches up to a pending gesture
   */
  _completeTransition: function() {
    if (!this.isMounted()) {
      return;
    }
    this._onAnimationEnd();
    let presentedIndex = this.state.presentedIndex;
    let didFocusRoute = this._subRouteFocus[presentedIndex] || this.state.routeStack[presentedIndex];
    let transitionFromIndex = this.state.transitionFromIndex;

    this.state.transitionFromIndex = null;
    this._hideScenes();
    this._clearSceneTransition(transitionFromIndex);
    this._clearSceneTransition(presentedIndex);

    if (!this.context._isInAParentNavigator) {
      BodyScrollHelper.setScrollEnabled(true);
    }
    if (this._scrollBehavior) {
      //更新scroll位置
      this._updateScroll();
      //重新开始监听scroll
      this._scrollBehavior.start();
    }

    if (this.state.transitionCb) {
      this.state.transitionCb();
      this.state.transitionCb = null;
    }

    this._emitDidFocus(didFocusRoute);

    // 执行队列中的transition
    if (this.state.transitionQueue.length) {
      let queuedTransition = this.state.transitionQueue.shift();
      this._enableScene(queuedTransition.destIndex);
      this._emitWillFocus(this.state.routeStack[queuedTransition.destIndex]);
      this._transitionTo(
        queuedTransition.destIndex,
        queuedTransition.velocity,
        null,
        queuedTransition.cb
      );
    }
  },

  _emitDidFocus: function(route) {
    this.navigationContext.emit('didfocus', {route: route});

    if (this.props.onDidFocus) {
      this.props.onDidFocus(route);
    }
  },

  _emitWillFocus: function(route) {
    this.navigationContext.emit('willfocus', {route: route});

    let navBar = this._navBar;
    if (navBar && navBar.handleWillFocus) {
      navBar.handleWillFocus(route);
    }
    if (this.props.onWillFocus) {
      this.props.onWillFocus(route);
    }
  },

  /**
   * Hides all scenes that we are not currently on, gesturing to, or transitioning from
   */
  _hideScenes: function() {
    for (let i = 0; i < this.state.routeStack.length; i++) {
      if (i === this.state.presentedIndex ||
          i === this.state.transitionFromIndex) {
        continue;
      }
      this._disableScene(i);
    }
  },

  /**
   * Push a scene off the screen, so that opacity:0 scenes will not block touches sent to the presented scenes
   */
  _disableScene: function(sceneIndex) {
    let sceneRef = this.refs['scene_' + sceneIndex];
    if(sceneRef) {
      ReactDOM.findDOMNode(sceneRef).classList.add('hide');
    }
  },

  /**
   * Put the scene back into the state as defined by props.sceneStyle, so transitions can happen normally
   */
  _enableScene: function(sceneIndex) {
    // 在transition中处理
  },

  _onAnimationStart: function() {
    let fromIndex = this.state.presentedIndex;
    let toIndex = this.state.presentedIndex;
    if (this.state.transitionFromIndex != null) {
      fromIndex = this.state.transitionFromIndex;
    }
    let navBar = this._navBar;
    if (navBar && navBar.onAnimationStart) {
      navBar.onAnimationStart(fromIndex, toIndex);
    }
  },

  _onAnimationEnd: function() {
    let navBar = this._navBar;
    if (navBar && navBar.onAnimationEnd) {
      navBar.onAnimationEnd();
    }
  },

  _getDestIndexWithinBounds: function(n) {
    let currentIndex = this.state.presentedIndex;
    let destIndex = currentIndex + n;
    invariant(
      destIndex >= 0,
      'Cannot jump before the first route.'
    );
    let maxIndex = this.state.routeStack.length - 1;
    invariant(
      maxIndex >= destIndex,
      'Cannot jump past the last route.'
    );
    return destIndex;
  },

  /**
   * 为了获取push 或 replace的 location key，所以不使用history.push replace,直接使用transitionTo
   */
  _historyTransitionTo: function(location, action) {
    this.props.history.transitionTo({
      ...location,
      action,
    });
  },

  _updateScroll: function() {
    this._scrollBehavior && this._scrollBehavior.updateScroll();
  },

  /**
   * NOTE 使用history.push 实现 所以可以回退到之前的场景
   */
  immediatelyResetRouteStack: function(nextRouteStack) {
    for (let i = 0; i < nextRouteStack.length; ++i) {
      let location = this._getRouteLocation(nextRouteStack[i]);
      this._historyTransitionTo(location, HistoryActions.PUSH);
    }

    let destIndex = nextRouteStack.length - 1;
    this.setState({
      routeStack: nextRouteStack,
      sceneConfigStack: nextRouteStack.map(
        route => this.props.configureScene(route, nextRouteStack)
      ),
      presentedIndex: destIndex,
      transitionFromIndex: null,
      transitionQueue: [],
    }, () => {
      // 恢复scroll 到最顶部
      this._updateScroll();
      this._navBar && this._navBar.immediatelyRefresh();
      this._emitDidFocus(this.state.routeStack[this.state.presentedIndex]);
    });
  },

  _jumpN: function(n) {
    this.props.history.go(n);
  },

  /**
   * Transition to an existing scene without unmounting.
   * @param {object} route Route to transition to. The specified route must
   * be in the currently mounted set of routes defined in `routeStack`.
   */
  jumpTo: function(route) {
    let destIndex = this.state.routeStack.indexOf(route);
    invariant(
      destIndex !== -1,
      'Cannot jump to route that is not in the route stack'
    );
    this._jumpN(destIndex - this.state.presentedIndex);
  },

  /**
   * Jump forward to the next scene in the route stack.
   */
  jumpForward: function() {
    this._jumpN(1);
  },

  /**
   * Jump backward without unmounting the current scene.
   */
  jumpBack: function() {
    this._jumpN(-1);
  },

  _push: function(route) {
    let activeLength = this.state.presentedIndex + 1;
    let activeStack = this.state.routeStack.slice(0, activeLength);
    let activeAnimationConfigStack = this.state.sceneConfigStack.slice(0, activeLength);
    let nextStack = activeStack.concat([route]);
    let destIndex = nextStack.length - 1;
    let nextSceneConfig = this.props.configureScene(route, nextStack);
    let nextAnimationConfigStack = activeAnimationConfigStack.concat([nextSceneConfig]);
    this._emitWillFocus(nextStack[destIndex]);

    this.setState({
      routeStack: nextStack,
      sceneConfigStack: nextAnimationConfigStack,
      pendingPresentedIndex: destIndex, //设置将要显示的目标场景 保证场景被渲染
    }, () => {
      this._enableScene(destIndex);
      this.state.pendingPresentedIndex = null;
      this._transitionTo(destIndex, nextSceneConfig.defaultTransitionVelocity);
    });
  },

  /**
   * Navigate forward to a new scene, squashing any scenes that you could
   * `jumpForward` to.
   */
  push: function(route) {
    invariant(!!route, 'Must supply route to push');

    let location = this._getRouteLocation(route);
    this._historyTransitionTo(location, HistoryActions.PUSH);

    this._push(route);
  },

  /**
   * Go back N scenes at once. When N=1, behavior matches `pop()`.
   * When N is invalid(negative or bigger than current routes count), do nothing.
   * @param {number} n The number of scenes to pop. Should be an integer.
   */
  popN: function(n) {
    invariant(typeof n === 'number', 'Must supply a number to popN');
    n = parseInt(n, 10);
    if (n <= 0 || this.state.presentedIndex - n < 0) {
      return;
    }

    //在history listen 回调中处理
    this.props.history.go(-n);
  },

  /**
   * Transition back and unmount the current scene.
   */
  pop: function() {
    if (this.state.transitionQueue.length) {
      // This is the workaround to prevent user from firing multiple `pop()`
      // calls that may pop the routes beyond the limit.
      // Because `this.state.presentedIndex` does not update until the
      // transition starts, we can't reliably use `this.state.presentedIndex`
      // to know whether we can safely keep popping the routes or not at this
      //  moment.
      return;
    }

    this.popN(1);
  },

  /**
   * Replace a scene as specified by an index
   *
   * `index` specifies the route in the stack that should be replaced.
   * If it's negative, it counts from the back.
   */
  replaceAtIndex: function(route, index, cb) {
    invariant(!!route, 'Must supply route to replace');
    if (index < 0) {
      index += this.state.routeStack.length;
    }

    if (this.state.routeStack.length <= index) {
      return;
    }

    if (index === this.state.routeStack.length - 1) {
      // replace 栈顶的scene
      this._historyTransitionTo(this._getRouteLocation(route), HistoryActions.REPLACE);
    } else {
      // 对于replace 非栈顶的 让新route 对应的location 与原route对应的location 的historyKey保持一致
      let previousRoute = this.state.routeStack[index];
      this._getRouteLocation(route, this._getRouteLocation(previousRoute).state.__historyKey);
    }

    let nextRouteStack = this.state.routeStack.slice();
    let nextAnimationModeStack = this.state.sceneConfigStack.slice();
    nextRouteStack[index] = route;
    nextAnimationModeStack[index] = this.props.configureScene(route, nextRouteStack);

    if (index === this.state.presentedIndex) {
      this._emitWillFocus(route);
    }

    this.setState({
      routeStack: nextRouteStack,
      sceneConfigStack: nextAnimationModeStack,
    }, () => {
      if (index === this.state.presentedIndex) {
        this._emitDidFocus(route);
      }
      cb && cb();
    });
  },

  /**
   * Replace the current scene with a new route.
   */
  replace: function(route) {
    this.replaceAtIndex(route, this.state.presentedIndex);
  },

  /**
   * Replace the previous scene.
   */
  replacePrevious: function(route) {
    this.replaceAtIndex(route, this.state.presentedIndex - 1);
  },

  /**
   * Pop to the first scene in the stack, unmounting every other scene.
   */
  popToTop: function() {
    this.popToRoute(this.state.routeStack[0]);
  },

  /**
   * Pop to a particular scene, as specified by its route.
   * All scenes after it will be unmounted.
   */
  popToRoute: function(route) {
    let indexOfRoute = this.state.routeStack.indexOf(route);
    invariant(
      indexOfRoute !== -1,
      'Calling popToRoute for a route that doesn\'t exist!'
    );
    let numToPop = this.state.presentedIndex - indexOfRoute;
    this.popN(numToPop);
  },

  /**
   * Replace the previous scene and pop to it.
   */
  replacePreviousAndPop: function(route) {
    if (this.state.routeStack.length < 2) {
      return;
    }
    this.replacePrevious(route);
    this.pop();
  },

  /**
   * Navigate to a new scene and reset route stack.
   * @param {object} route Route to navigate to.
   */
  resetTo: function(route) {
    invariant(!!route, 'Must supply route to push');
    this.immediatelyResetRouteStack([route]);
  },

  /**
   * Returns the current list of routes.
   */
  getCurrentRoutes: function() {
    // Clone before returning to avoid caller mutating the stack
    return this.state.routeStack.slice();
  },

  /**
   * 去除index 之上的所有，在pop 之后使用
   */
  _cleanScenesPastIndex: function(index) {
    let newStackLength = index + 1;
    // Remove any unneeded rendered routes.
    if (newStackLength < this.state.routeStack.length) {
      this.setState({
        sceneConfigStack: this.state.sceneConfigStack.slice(0, newStackLength),
        routeStack: this.state.routeStack.slice(0, newStackLength),
      });
    }
  },

  _renderNavigationBar: function() {
    let { navigationBar } = this.props;
    if (!navigationBar) {
      return null;
    }
    return React.cloneElement(navigationBar, {
      ref: (navBar) => {
        this._navBar = navBar;
        if (navigationBar && typeof navigationBar.ref === 'function') {
          navigationBar.ref(navBar);
        }
      },
      navigator: this._navigationBarNavigator,
      navState: this.state,
    });
  },

  _renderScene: function(route, i) {
    let className = 'lrnw-nav-scene';
    if (i !== this.state.presentedIndex) {
      className += ' hide';
    }
    const sceneProps = {
      key: 'scene_' + getRouteID(route),
      ref: 'scene_' + i,
      className,
      style: this.props.sceneStyle,
      children: this.props.renderScene(route, this),
    };
    if (this._bodyScrollMode()) {
      return createWebCoreElement('div', sceneProps);
    }
    return React.createElement(View, sceneProps);
  },

  _renderOrGetScene: function(route, index) {
    if (this._renderedSceneMap.has(route)) {
      return this._renderedSceneMap.get(route);
    } else {
      return this._renderScene(route, index);
    }
  },

  _handleStartShouldSetResponderCapture:function () {
    return this.state.transitionFromIndex != null;
  },

  render: function() {
    const {
      routeStack,
      presentedIndex,
      pendingPresentedIndex,
      transitionFromIndex,
    } = this.state;
    let renderedSceneCount = 1;
    let sceneIndexMap = Object.create(null);

    sceneIndexMap[presentedIndex] = this._renderScene(routeStack[presentedIndex], presentedIndex);
    if (pendingPresentedIndex != null && !sceneIndexMap[pendingPresentedIndex] && routeStack[pendingPresentedIndex]) {
      //console.log('render pendingPresentedIndex', pendingPresentedIndex, routeStack[pendingPresentedIndex]);
      sceneIndexMap[pendingPresentedIndex] = this._renderOrGetScene(routeStack[pendingPresentedIndex], pendingPresentedIndex);
      ++renderedSceneCount;
    }
    if (transitionFromIndex != null && !sceneIndexMap[transitionFromIndex] && routeStack[transitionFromIndex]) {
      //console.log('render transitionFromIndex', transitionFromIndex, routeStack[transitionFromIndex]);
      // transitionFromIndex scene 的渲染不计入maxSceneStackSize 所以不加renderedSceneCount
      sceneIndexMap[transitionFromIndex] = this._renderOrGetScene(routeStack[transitionFromIndex], transitionFromIndex);
    }

    for (let i = routeStack.length - 1; i >= 0 && renderedSceneCount < this.props.maxSceneStackSize; --i) {
      if (!sceneIndexMap[i] && this._renderedSceneMap.has(routeStack[i])) {
        sceneIndexMap[i] = this._renderedSceneMap.get(routeStack[i]);
        ++renderedSceneCount;
      }
    }

    let scenes = [];
    let newRenderedSceneMap = new Map();
    let indexs = Object.keys(sceneIndexMap).sort((a, b) => Number(a) - Number(b));
    for (let i = 0; i < indexs.length; ++i) {
      let index = indexs[i];
      let scene = sceneIndexMap[index];
      scenes.push(scene);
      newRenderedSceneMap.set(routeStack[index], scene);
    }
    this._renderedSceneMap = newRenderedSceneMap;

    return (
      <View
        className={this._bodyScrollMode() ? 'lrnw-nav-scroll' : 'lrnw-nav'}
        onStartShouldSetResponderCapture={this._handleStartShouldSetResponderCapture}
        style={[!this._bodyScrollMode() && styles.container, this.props.style]}>
        {scenes}
      </View>
    );
  },

  _getNavigationContext: function() {
    if (!this._navigationContext) {
      this._navigationContext = new NavigationContext();
    }
    return this._navigationContext;
  }
});

module.exports = Navigator;
