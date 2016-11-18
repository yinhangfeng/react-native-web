/**
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 * Facebook, Inc. ("Facebook") owns all right, title and interest, including
 * all intellectual property and other proprietary rights, in and to the React
 * Native CustomComponents software (the "Software").  Subject to your
 * compliance with these terms, you are hereby granted a non-exclusive,
 * worldwide, royalty-free copyright license to (1) use and copy the Software;
 * and (2) reproduce and distribute the Software as part of your own software
 * ("Your Software").  Facebook reserves all rights not expressly granted to
 * you in this license agreement.
 *
 * THE SOFTWARE AND DOCUMENTATION, IF ANY, ARE PROVIDED "AS IS" AND ANY EXPRESS
 * OR IMPLIED WARRANTIES (INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE) ARE DISCLAIMED.
 * IN NO EVENT SHALL FACEBOOK OR ITS AFFILIATES, OFFICERS, DIRECTORS OR
 * EMPLOYEES BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THE SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @providesModule Navigator
 */
 /* eslint-disable no-extra-boolean-cast*/
'use strict';

//var AnimationsDebugModule = require('NativeModules').AnimationsDebugModule;
var Dimensions = require('Dimensions');
var InteractionMixin = require('InteractionMixin');
var NavigationContext = require('NavigationContext');
var NavigatorBreadcrumbNavigationBar = require('NavigatorBreadcrumbNavigationBar');
var NavigatorNavigationBar = require('NavigatorNavigationBar');
var NavigatorSceneConfigs = require('NavigatorSceneConfigs');
//var PanResponder = require('PanResponder');
var React = require('React');
var StyleSheet = require('StyleSheet');
var Subscribable = require('Subscribable');
var TimerMixin = require('react-timer-mixin');
var View = require('View');

//var clamp = require('clamp');
var flattenStyle = require('flattenStyle');
var invariant = require('fbjs/lib/invariant');
//var rebound = require('rebound');

var ReactDOM = require('react/lib/ReactDOM');
var CSSClassNames = require('CSSClassNames');
import createHistory from 'history/lib/createBrowserHistory';

var PropTypes = React.PropTypes;

const TRANSITION_DURATION = 400;//Transition动画时间 CSS动画时间

var __uid = 0;
function getuid() {
  return __uid++;
}

function getRouteID(route) {
  if (route === null || typeof route !== 'object') {
    return String(route);
  }

  var key = '__navigatorRouteID';

  if (!route.hasOwnProperty(key)) {
    Object.defineProperty(route, key, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: getuid(),
    });
  }
  return route[key];
}

// styles moved to the top of the file so getDefaultProps can refer to it
var styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  defaultSceneStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  baseScene: {
    position: 'absolute',
    overflow: 'hidden',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  // disabledScene: {
  //   top: SCREEN_HEIGHT,
  //   bottom: -SCREEN_HEIGHT,
  // },
  transitioner: {
    flex: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  }
});

var GESTURE_ACTIONS = [
  'pop',
  'jumpBack',
  'jumpForward',
];

/**
 * Use `Navigator` to transition between different scenes in your app. To
 * accomplish this, provide route objects to the navigator to identify each
 * scene, and also a `renderScene` function that the navigator can use to
 * render the scene for a given route.
 *
 * To change the animation or gesture properties of the scene, provide a
 * `configureScene` prop to get the config object for a given route. See
 * `Navigator.SceneConfigs` for default animations and more info on
 * scene config options.
 *
 * ### Basic Usage
 *
 * ```
 *   <Navigator
 *     initialRoute={{name: 'My First Scene', index: 0}}
 *     renderScene={(route, navigator) =>
 *       <MySceneComponent
 *         name={route.name}
 *         onForward={() => {
 *           var nextIndex = route.index + 1;
 *           navigator.push({
 *             name: 'Scene ' + nextIndex,
 *             index: nextIndex,
 *           });
 *         }}
 *         onBack={() => {
 *           if (route.index > 0) {
 *             navigator.pop();
 *           }
 *         }}
 *       />
 *     }
 *   />
 * ```
 */
 //TODO RW 1.快速点击push 会出问题 2.history 绑定前进
var Navigator = React.createClass({

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
    //RW web下history 扩展
    //

    //是否将navigator与浏览器history绑定
    useHistory: PropTypes.bool,

    //创建location对象 Function(route, index)
    createLocation: PropTypes.func,

  },

  statics: {
    BreadcrumbNavigationBar: NavigatorBreadcrumbNavigationBar,
    NavigationBar: NavigatorNavigationBar,
    SceneConfigs: NavigatorSceneConfigs,
  },

  mixins: [TimerMixin, InteractionMixin, Subscribable.Mixin],

  getDefaultProps: function() {
    return {
      configureScene: () => NavigatorSceneConfigs.PushFromRight,
      sceneStyle: styles.defaultSceneStyle,
      useHistory: false,
      createLocation: (route, index) => {
        return {
          pathname: '#scene_' + index,
        }
      }
    };
  },

  getInitialState: function() {
    this._navigationBarNavigator = this.props.navigationBarNavigator || this;

    this._renderedSceneMap = new Map();

    var routeStack = this.props.initialRouteStack || [this.props.initialRoute];
    invariant(
      routeStack.length >= 1,
      'Navigator requires props.initialRoute or props.initialRouteStack.'
    );
    var initialRouteIndex = routeStack.length - 1;
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
      presentedIndex: initialRouteIndex,
      transitionFromIndex: null,
      //activeGesture: null,
      //pendingGestureProgress: null,
      transitionQueue: [],
    };
  },

  componentWillMount: function() {
    // TODO(t7489503): Don't need this once ES6 Class landed.
    this.__defineGetter__('navigationContext', this._getNavigationContext);

    this._subRouteFocus = [];
    this.parentNavigator = this.props.navigator;
    this._handlers = {};
    // this.springSystem = new rebound.SpringSystem();
    // this.spring = this.springSystem.createSpring();
    // this.spring.setRestSpeedThreshold(0.05);
    // this.spring.setCurrentValue(0).setAtRest();
    // this.spring.addListener({
    //   onSpringEndStateChange: () => {
    //     if (!this._interactionHandle) {
    //       this._interactionHandle = this.createInteractionHandle();
    //     }
    //   },
    //   onSpringUpdate: () => {
    //     this._handleSpringUpdate();
    //   },
    //   onSpringAtRest: () => {
    //     this._completeTransition();
    //   },
    // });
    // this.panGesture = PanResponder.create({
    //   onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
    //   onPanResponderRelease: this._handlePanResponderRelease,
    //   onPanResponderMove: this._handlePanResponderMove,
    //   onPanResponderTerminate: this._handlePanResponderTerminate,
    // });
    this._interactionHandle = null;
    this._emitWillFocus(this.state.routeStack[this.state.presentedIndex]);
  },

  componentDidMount: function() {
    //this._handleSpringUpdate();
    if(this.props.useHistory) {
      this._historyActionCount = 0;
      this._history = createHistory();
      //XXX 如果打开网页时初始就带有hash,会立即调用一次回调
      var _firstMark = true;
      this._unListenHistory = this._history.listen((location) => {
        if (_firstMark) {
          return;
        }
        //console.log('_history.listen _historyActionCount', this._historyActionCount, 'location', location, 'presentedIndex', this.state.presentedIndex);
        if(this._historyActionCount) {
          //主动改变history 不需要重复调用navigator
          --this._historyActionCount;
          return;
        }
        var index = location.state && location.state.index;
        if (index == null) {
          return;
        }
        if(index < this.state.presentedIndex) {
          //XXX RW 目前不考虑history的前进
          this._isListenAction = true;
          this.popN(this.state.presentedIndex - index);
          this._isListenAction = false;
        }
        //TODO 除了浏览器返回按钮引起的history变化处理
      });
      _firstMark = false;
    }
    this._emitDidFocus(this.state.routeStack[this.state.presentedIndex]);
  },

  componentWillUnmount: function() {
    if (this._navigationContext) {
      this._navigationContext.dispose();
      this._navigationContext = null;
    }

    //this.spring.destroy();

    if (this._interactionHandle) {
      this.clearInteractionHandle(this._interactionHandle);
    }

    this._unListenHistory && this._unListenHistory();
  },

  /**
   * Reset every scene with an array of routes.
   *
   * @param {RouteStack} nextRouteStack Next route stack to reinitialize. This
   * doesn't accept stack item `id`s, which implies that all existing items are
   * destroyed, and then potentially recreated according to `routeStack`. Does
   * not animate, immediately replaces and rerenders navigation bar and stack
   * items.
   */
  immediatelyResetRouteStack: function(nextRouteStack) {
    var destIndex = nextRouteStack.length - 1;
    this.setState({
      routeStack: nextRouteStack,
      sceneConfigStack: nextRouteStack.map(
        route => this.props.configureScene(route, nextRouteStack)
      ),
      presentedIndex: destIndex,
      //activeGesture: null,
      transitionFromIndex: null,
      transitionQueue: [],
    }, () => {
      //this._handleSpringUpdate();
      this._navBar && this._navBar.immediatelyRefresh();
      this._emitDidFocus(this.state.routeStack[this.state.presentedIndex]);
    });
  },

  _createLocation: function(route, index) {
    var location = this.props.createLocation(route, index);
    location.state = location.state || {};
    location.state.index = index;
    return location;
  },

  _transitionTo: function(destIndex, velocity, jumpSpringTo, cb) {
    if (this.state.presentedIndex === destIndex) {
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
    this.state.presentedIndex = destIndex; //在transition 开始之前将presentedIndex设为目标index
    this.state.transitionCb = cb;
    this._onAnimationStart();
    // if (AnimationsDebugModule) {
    //   AnimationsDebugModule.startRecordingFps();
    // }
    var sceneConfig = this.state.sceneConfigStack[this.state.transitionFromIndex] ||
      this.state.sceneConfigStack[this.state.presentedIndex];
    invariant(
      sceneConfig,
      'Cannot configure scene at index ' + this.state.transitionFromIndex
    );
    // if (jumpSpringTo != null) {
    //   this.spring.setCurrentValue(jumpSpringTo);
    // }
    // this.spring.setOvershootClampingEnabled(true);
    // this.spring.getSpringConfig().friction = sceneConfig.springFriction;
    // this.spring.getSpringConfig().tension = sceneConfig.springTension;
    // this.spring.setVelocity(velocity || sceneConfig.defaultTransitionVelocity);
    // this.spring.setEndValue(1);

    //XXX 开始动画
    if (!this._interactionHandle) {
      //开始InteractionManager TODO 如果使用CSS动画 是否需要
      this._interactionHandle = this.createInteractionHandle();
    }
    var fromSceneRef = this.refs['scene_' + this.state.transitionFromIndex];
    if(fromSceneRef) {
      ReactDOM.findDOMNode(fromSceneRef).style.opacity = 0;
    }
    var toSceneRef = this.refs['scene_' + this.state.presentedIndex];
    var toSceneDOM;
    if(toSceneRef) {
      toSceneDOM = ReactDOM.findDOMNode(toSceneRef);
      if(toSceneDOM.style.opacity === '') {
        toSceneDOM.style.opacity = 0.2;
        setTimeout(() => {
          toSceneDOM.style.opacity = 1; //XXX 触发css动画  需要更好的方式
        });
      } else {
        toSceneDOM.style.opacity = 1;
      }
    }
    setTimeout(this._completeTransition, TRANSITION_DURATION);
  },

  /**
   * This happens for each frame of either a gesture or a transition. If both are
   * happening, we only set values for the transition and the gesture will catch up later
   */
  // _handleSpringUpdate: function() {
  //   if (!this.isMounted()) {
  //     return;
  //   }
  //   // Prioritize handling transition in progress over a gesture:
  //   if (this.state.transitionFromIndex != null) {
  //     this._transitionBetween(
  //       this.state.transitionFromIndex,
  //       this.state.presentedIndex,
  //       this.spring.getCurrentValue()
  //     );
  //   } else if (this.state.activeGesture != null) {
  //     var presentedToIndex = this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
  //     this._transitionBetween(
  //       this.state.presentedIndex,
  //       presentedToIndex,
  //       this.spring.getCurrentValue()
  //     );
  //   }
  // },

  /**
   * This happens at the end of a transition started by transitionTo, and when the spring catches up to a pending gesture
   */
  _completeTransition: function() {
    if (!this.isMounted()) {
      return;
    }

    // if (this.spring.getCurrentValue() !== 1 && this.spring.getCurrentValue() !== 0) {
    //   // The spring has finished catching up to a gesture in progress. Remove the pending progress
    //   // and we will be in a normal activeGesture state
    //   if (this.state.pendingGestureProgress) {
    //     this.state.pendingGestureProgress = null;
    //   }
    //   return;
    // }
    this._onAnimationEnd();
    var presentedIndex = this.state.presentedIndex;
    var didFocusRoute = this._subRouteFocus[presentedIndex] || this.state.routeStack[presentedIndex];

    // if (AnimationsDebugModule) {
    //   AnimationsDebugModule.stopRecordingFps(Date.now());
    // }
    this.state.transitionFromIndex = null;
    //this.spring.setCurrentValue(0).setAtRest();
    this._hideScenes();
    if (this.state.transitionCb) {
      this.state.transitionCb();
      this.state.transitionCb = null;
    }

    this._emitDidFocus(didFocusRoute);

    if (this._interactionHandle) {
      this.clearInteractionHandle(this._interactionHandle);
      this._interactionHandle = null;
    }
    // if (this.state.pendingGestureProgress) {
    //   // A transition completed, but there is already another gesture happening.
    //   // Enable the scene and set the spring to catch up with the new gesture
    //   var gestureToIndex = this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
    //   this._enableScene(gestureToIndex);
    //   this.spring.setEndValue(this.state.pendingGestureProgress);
    //   return;
    // }

    if (this.state.transitionQueue.length) {
      var queuedTransition = this.state.transitionQueue.shift();
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

    var navBar = this._navBar;
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
    var gesturingToIndex = null;
    // if (this.state.activeGesture) {
    //   gesturingToIndex = this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
    // }
    for (var i = 0; i < this.state.routeStack.length; i++) {
      if (i === this.state.presentedIndex ||
          i === this.state.transitionFromIndex ||
          i === gesturingToIndex) {
        continue;
      }
      this._disableScene(i);
    }
  },

  /**
   * Push a scene off the screen, so that opacity:0 scenes will not block touches sent to the presented scenes
   */
  _disableScene: function(sceneIndex) {
    // this.refs['scene_' + sceneIndex] &&
    //   this.refs['scene_' + sceneIndex].setNativeProps(SCENE_DISABLED_NATIVE_PROPS);
    var sceneRef = this.refs['scene_' + sceneIndex];
    if(sceneRef) {
      ReactDOM.findDOMNode(sceneRef).classList.add(CSSClassNames.HIDE);
    }
  },

  /**
   * Put the scene back into the state as defined by props.sceneStyle, so transitions can happen normally
   */
  _enableScene: function(sceneIndex) {
    // First, determine what the defined styles are for scenes in this navigator
    // var sceneStyle = flattenStyle([styles.baseScene, this.props.sceneStyle]);
    // // Then restore the pointer events and top value for this scene
    // var enabledSceneNativeProps = {
    //   pointerEvents: 'auto',
    //   style: {
    //     top: sceneStyle.top,
    //     bottom: sceneStyle.bottom,
    //   },
    // };
    // if (sceneIndex !== this.state.transitionFromIndex &&
    //     sceneIndex !== this.state.presentedIndex) {
    //   // If we are not in a transition from this index, make sure opacity is 0
    //   // to prevent the enabled scene from flashing over the presented scene
    //   enabledSceneNativeProps.style.opacity = 0;
    // }
    // this.refs['scene_' + sceneIndex] &&
    //   this.refs['scene_' + sceneIndex].setNativeProps(enabledSceneNativeProps);

    var sceneRef = this.refs['scene_' + sceneIndex];
    if(sceneRef) {
      ReactDOM.findDOMNode(sceneRef).classList.remove(CSSClassNames.HIDE);
    }
  },

  _onAnimationStart: function() {
    var fromIndex = this.state.presentedIndex;
    var toIndex = this.state.presentedIndex;
    if (this.state.transitionFromIndex != null) {
      fromIndex = this.state.transitionFromIndex;
    }
    // else if (this.state.activeGesture) {
    //   toIndex = this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
    // }
    // this._setRenderSceneToHardwareTextureAndroid(fromIndex, true);
    // this._setRenderSceneToHardwareTextureAndroid(toIndex, true);
    var navBar = this._navBar;
    if (navBar && navBar.onAnimationStart) {
      navBar.onAnimationStart(fromIndex, toIndex);
    }
  },

  _onAnimationEnd: function() {
    // var max = this.state.routeStack.length - 1;
    // for (var index = 0; index <= max; index++) {
    //   this._setRenderSceneToHardwareTextureAndroid(index, false);
    // }

    var navBar = this._navBar;
    if (navBar && navBar.onAnimationEnd) {
      navBar.onAnimationEnd();
    }
  },

  _doesGestureOverswipe: function(gestureName) {
    var wouldOverswipeBack = this.state.presentedIndex <= 0 &&
      (gestureName === 'pop' || gestureName === 'jumpBack');
    var wouldOverswipeForward = this.state.presentedIndex >= this.state.routeStack.length - 1 &&
      gestureName === 'jumpForward';
    return wouldOverswipeForward || wouldOverswipeBack;
  },

  _deltaForGestureAction: function(gestureAction) {
    switch (gestureAction) {
      case 'pop':
      case 'jumpBack':
        return -1;
      case 'jumpForward':
        return 1;
      default:
        invariant(false, 'Unsupported gesture action ' + gestureAction);
        return;
    }
  },

  _transitionSceneStyle: function(fromIndex, toIndex, progress, index) {
    var viewAtIndex = this.refs['scene_' + index];
    if (viewAtIndex === null || viewAtIndex === undefined) {
      return;
    }
    // Use toIndex animation when we move forwards. Use fromIndex when we move back
    var sceneConfigIndex = fromIndex < toIndex ? toIndex : fromIndex;
    var sceneConfig = this.state.sceneConfigStack[sceneConfigIndex];
    // this happens for overswiping when there is no scene at toIndex
    if (!sceneConfig) {
      sceneConfig = this.state.sceneConfigStack[sceneConfigIndex - 1];
    }
    var styleToUse = {};
    var useFn = index < fromIndex || index < toIndex ?
      sceneConfig.animationInterpolators.out :
      sceneConfig.animationInterpolators.into;
    var directionAdjustedProgress = fromIndex < toIndex ? progress : 1 - progress;
    var didChange = useFn(styleToUse, directionAdjustedProgress);
    if (didChange) {
      viewAtIndex.setNativeProps({style: styleToUse});
    }
  },

  _transitionBetween: function(fromIndex, toIndex, progress) {
    this._transitionSceneStyle(fromIndex, toIndex, progress, fromIndex);
    this._transitionSceneStyle(fromIndex, toIndex, progress, toIndex);
    var navBar = this._navBar;
    if (navBar && navBar.updateProgress && toIndex >= 0 && fromIndex >= 0) {
      navBar.updateProgress(progress, fromIndex, toIndex);
    }
  },

  _getDestIndexWithinBounds: function(n) {
    var currentIndex = this.state.presentedIndex;
    var destIndex = currentIndex + n;
    invariant(
      destIndex >= 0,
      'Cannot jump before the first route.'
    );
    var maxIndex = this.state.routeStack.length - 1;
    invariant(
      maxIndex >= destIndex,
      'Cannot jump past the last route.'
    );
    return destIndex;
  },

  _jumpN: function(n) {
    var destIndex = this._getDestIndexWithinBounds(n);
    this._enableScene(destIndex);
    this._emitWillFocus(this.state.routeStack[destIndex]);

    //RW history
    if(this._history && !this._isListenAction) {
      this._historyActionCount++;
      this._history.go(n);
    }

    this._transitionTo(destIndex);
  },

  /**
   * Transition to an existing scene without unmounting.
   * @param {object} route Route to transition to. The specified route must
   * be in the currently mounted set of routes defined in `routeStack`.
   */
  jumpTo: function(route) {
    var destIndex = this.state.routeStack.indexOf(route);
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

  /**
   * Navigate forward to a new scene, squashing any scenes that you could
   * `jumpForward` to.
   */
  push: function(route) {
    invariant(!!route, 'Must supply route to push');
    var activeLength = this.state.presentedIndex + 1;
    var activeStack = this.state.routeStack.slice(0, activeLength);
    var activeAnimationConfigStack = this.state.sceneConfigStack.slice(0, activeLength);
    var nextStack = activeStack.concat([route]);
    var destIndex = nextStack.length - 1;
    var nextSceneConfig = this.props.configureScene(route, nextStack);
    var nextAnimationConfigStack = activeAnimationConfigStack.concat([nextSceneConfig]);
    this._emitWillFocus(nextStack[destIndex]);

    //RW history
    if(this._history && !this._isListenAction) {
      this._historyActionCount++;
      this._history.push(this._createLocation(route, destIndex));
    }

    this.setState({
      routeStack: nextStack,
      sceneConfigStack: nextAnimationConfigStack,
    }, () => {
      this._enableScene(destIndex);
      this._transitionTo(destIndex, nextSceneConfig.defaultTransitionVelocity);
    });
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
    var popIndex = this.state.presentedIndex - n;
    var presentedRoute = this.state.routeStack[this.state.presentedIndex];
    var popSceneConfig = this.props.configureScene(presentedRoute); // using the scene config of the currently presented view
    this._enableScene(popIndex);
    this._emitWillFocus(this.state.routeStack[popIndex]);

    //RW history
    if(this._history && !this._isListenAction) {
      this._historyActionCount++;
      this._history.go(-n);
    }

    this._transitionTo(
      popIndex,
      popSceneConfig.defaultTransitionVelocity,
      null, // no spring jumping
      () => {
        this._cleanScenesPastIndex(popIndex);
      }
    );
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

    var nextRouteStack = this.state.routeStack.slice();
    var nextAnimationModeStack = this.state.sceneConfigStack.slice();
    nextRouteStack[index] = route;
    nextAnimationModeStack[index] = this.props.configureScene(route, nextRouteStack);

    if (index === this.state.presentedIndex) {
      this._emitWillFocus(route);
    }

    //TODO RW history

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
    var indexOfRoute = this.state.routeStack.indexOf(route);
    invariant(
      indexOfRoute !== -1,
      'Calling popToRoute for a route that doesn\'t exist!'
    );
    var numToPop = this.state.presentedIndex - indexOfRoute;
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
    this.replaceAtIndex(route, 0, () => {
      // Do not use popToRoute here, because race conditions could prevent the
      // route from existing at this time. Instead, just go to index 0
      this.popN(this.state.presentedIndex);
    });
  },

  /**
   * Returns the current list of routes.
   */
  getCurrentRoutes: function() {
    // Clone before returning to avoid caller mutating the stack
    return this.state.routeStack.slice();
  },

  _cleanScenesPastIndex: function(index) {
    var newStackLength = index + 1;
    // Remove any unneeded rendered routes.
    if (newStackLength < this.state.routeStack.length) {
      this.setState({
        sceneConfigStack: this.state.sceneConfigStack.slice(0, newStackLength),
        routeStack: this.state.routeStack.slice(0, newStackLength),
      });
    }
  },

  _renderScene: function(route, i) {
    //var disabledSceneStyle = null;
    var className = 'lrnw-nav-scene-anim';
    //var disabledScenePointerEvents = 'auto';
    if (i !== this.state.presentedIndex) {
      //disabledSceneStyle = styles.disabledScene;
      //disabledScenePointerEvents = 'none';
      className += ' ' + CSSClassNames.HIDE;
    }
    //pointerEvents={disabledScenePointerEvents}
    return (
      <View
        key={'scene_' + getRouteID(route)}
        ref={'scene_' + i}
        onStartShouldSetResponderCapture={() => {
          return (this.state.transitionFromIndex != null) || (this.state.transitionFromIndex != null);
        }}
        className={className}
        style={[styles.baseScene, this.props.sceneStyle]}>
        {this.props.renderScene(
          route,
          this
        )}
      </View>
    );
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

  render: function() {
    var newRenderedSceneMap = new Map();
    var scenes = this.state.routeStack.map((route, index) => {
      var renderedScene;
      if (this._renderedSceneMap.has(route) &&
          index !== this.state.presentedIndex) {
        renderedScene = this._renderedSceneMap.get(route);
      } else {
        renderedScene = this._renderScene(route, index);
      }
      newRenderedSceneMap.set(route, renderedScene);
      return renderedScene;
    });
    this._renderedSceneMap = newRenderedSceneMap;
    // return (
    //   <View style={[styles.container, this.props.style]}>
    //     <View
    //       style={styles.transitioner}
    //       {...this.panGesture.panHandlers}
    //       onTouchStart={this._handleTouchStart}
    //       onResponderTerminationRequest={
    //         this._handleResponderTerminationRequest
    //       }>
    //       {scenes}
    //     </View>
    //     {this._renderNavigationBar()}
    //   </View>
    // );
    //RW 去掉手势系统 为web 环境优化 没有navigationBar时减少嵌套
    let navigationBar = this._renderNavigationBar();
    if (navigationBar) {
      return (
        <View
          style={[styles.container, this.props.style]}>
          <View
            style={styles.transitioner}>
            {scenes}
          </View>
          {navigationBar}
        </View>
      );
    }
    return (
      <View
        style={[styles.container, styles.transitioner, this.props.style]}>
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
