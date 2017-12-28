/**
 * RW SYNC react-native: 0.49 react-native-web: 0.1.0部分
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ScrollView
 * @flow
 */
'use strict';

const ColorPropType = require('ColorPropType');
const EdgeInsetsPropType = require('EdgeInsetsPropType');
const PointPropType = require('PointPropType');
const PropTypes = require('prop-types');
const React = require('React');
const ReactNative = require('ReactNative');
const ScrollResponder = require('ScrollResponder');
const StyleSheet = require('StyleSheet');
const StyleSheetPropType = require('StyleSheetPropType');
const View = require('View');
const ViewPropTypes = require('ViewPropTypes');
const ViewStylePropTypes = require('ViewStylePropTypes');

const createReactClass = require('create-react-class');
const dismissKeyboard = require('dismissKeyboard');
const flattenStyle = require('flattenStyle');
const invariant = require('fbjs/lib/invariant');
const processDecelerationRate = require('processDecelerationRate');
const requireNativeComponent = require('requireNativeComponent');
const warning = require('fbjs/lib/warning');

const CSSClassNames = require('CSSClassNames');

import type {NativeMethodsMixinType} from 'ReactNativeTypes';

const normalizeScrollEvent = e => {
  e.nativeEvent = {
    contentOffset: {
      get x() {
        return e.target.scrollLeft;
      },
      get y() {
        return e.target.scrollTop;
      }
    },
    contentSize: {
      get height() {
        return e.target.scrollHeight;
      },
      get width() {
        return e.target.scrollWidth;
      }
    },
    layoutMeasurement: {
      get height() {
        return e.target.offsetHeight;
      },
      get width() {
        return e.target.offsetWidth;
      }
    }
  };
};

/**
 * Component that wraps platform ScrollView while providing
 * integration with touch locking "responder" system.
 *
 * Keep in mind that ScrollViews must have a bounded height in order to work,
 * since they contain unbounded-height children into a bounded container (via
 * a scroll interaction). In order to bound the height of a ScrollView, either
 * set the height of the view directly (discouraged) or make sure all parent
 * views have bounded height. Forgetting to transfer `{flex: 1}` down the
 * view stack can lead to errors here, which the element inspector makes
 * easy to debug.
 *
 * Doesn't yet support other contained responders from blocking this scroll
 * view from becoming the responder.
 *
 *
 * `<ScrollView>` vs [`<FlatList>`](/react-native/docs/flatlist.html) - which one to use?
 *
 * `ScrollView` simply renders all its react child components at once. That
 * makes it very easy to understand and use.
 *
 * On the other hand, this has a performance downside. Imagine you have a very
 * long list of items you want to display, maybe several screens worth of
 * content. Creating JS components and native views for everything all at once,
 * much of which may not even be shown, will contribute to slow rendering and
 * increased memory usage.
 *
 * This is where `FlatList` comes into play. `FlatList` renders items lazily,
 * just when they are about to appear, and removes items that scroll way off
 * screen to save memory and processing time.
 *
 * `FlatList` is also handy if you want to render separators between your items,
 * multiple columns, infinite scroll loading, or any number of other features it
 * supports out of the box.
 * 
 * TODO RW
 * 1.scrollEnabled
 * 2.scrollResponder
 * 3.debounce(scrollEventThrottle) 参考react-native-web ScrollViewBase
 * 4.scroll event 的完整兼容
 */
// $FlowFixMe(>=0.41.0)
const ScrollView = createReactClass({
  displayName: 'ScrollView',
  propTypes: {
    ...ViewPropTypes,
    /**
     * Controls whether iOS should automatically adjust the content inset
     * for scroll views that are placed behind a navigation bar or
     * tab bar/ toolbar. The default value is true.
     * @platform ios
     */
    // automaticallyAdjustContentInsets: PropTypes.bool,
    /**
     * The amount by which the scroll view content is inset from the edges
     * of the scroll view. Defaults to `{top: 0, left: 0, bottom: 0, right: 0}`.
     * @platform ios
     */
    // contentInset: EdgeInsetsPropType,
    /**
     * Used to manually set the starting scroll offset.
     * The default value is `{x: 0, y: 0}`.
     * @platform ios
     */
    // contentOffset: PointPropType,
    /**
     * When true, the scroll view bounces when it reaches the end of the
     * content if the content is larger then the scroll view along the axis of
     * the scroll direction. When false, it disables all bouncing even if
     * the `alwaysBounce*` props are true. The default value is true.
     * @platform ios
     */
    bounces: PropTypes.bool,
    /**
     * When true, gestures can drive zoom past min/max and the zoom will animate
     * to the min/max value at gesture end, otherwise the zoom will not exceed
     * the limits.
     * @platform ios
     */
    // bouncesZoom: PropTypes.bool,
    /**
     * When true, the scroll view bounces horizontally when it reaches the end
     * even if the content is smaller than the scroll view itself. The default
     * value is true when `horizontal={true}` and false otherwise.
     * @platform ios
     */
    // alwaysBounceHorizontal: PropTypes.bool,
    /**
     * When true, the scroll view bounces vertically when it reaches the end
     * even if the content is smaller than the scroll view itself. The default
     * value is false when `horizontal={true}` and true otherwise.
     * @platform ios
     */
    // alwaysBounceVertical: PropTypes.bool,
    /**
     * When true, the scroll view automatically centers the content when the
     * content is smaller than the scroll view bounds; when the content is
     * larger than the scroll view, this property has no effect. The default
     * value is false.
     * @platform ios
     */
    // centerContent: PropTypes.bool,
    /**
     * These styles will be applied to the scroll view content container which
     * wraps all of the child views. Example:
     *
     * ```
     * return (
     *   <ScrollView contentContainerStyle={styles.contentContainer}>
     *   </ScrollView>
     * );
     * ...
     * const styles = StyleSheet.create({
     *   contentContainer: {
     *     paddingVertical: 20
     *   }
     * });
     * ```
     */
    contentContainerStyle: StyleSheetPropType(ViewStylePropTypes),
    /**
     * A floating-point number that determines how quickly the scroll view
     * decelerates after the user lifts their finger. You may also use string
     * shortcuts `"normal"` and `"fast"` which match the underlying iOS settings
     * for `UIScrollViewDecelerationRateNormal` and
     * `UIScrollViewDecelerationRateFast` respectively.
     *
     *   - `'normal'`: 0.998 (the default)
     *   - `'fast'`: 0.99
     *
     * @platform ios
     */
    // decelerationRate: PropTypes.oneOfType([
    //   PropTypes.oneOf(['fast', 'normal']),
    //   PropTypes.number,
    // ]),
    /**
     * When true, the scroll view's children are arranged horizontally in a row
     * instead of vertically in a column. The default value is false.
     */
    horizontal: PropTypes.bool,
    /**
     * The style of the scroll indicators.
     *
     *   - `'default'` (the default), same as `black`.
     *   - `'black'`, scroll indicator is black. This style is good against a light background.
     *   - `'white'`, scroll indicator is white. This style is good against a dark background.
     *
     * @platform ios
     */
    // indicatorStyle: PropTypes.oneOf([
    //   'default', // default
    //   'black',
    //   'white',
    // ]),
    /**
     * When true, the ScrollView will try to lock to only vertical or horizontal
     * scrolling while dragging.  The default value is false.
     * @platform ios
     */
    // directionalLockEnabled: PropTypes.bool,
    /**
     * When false, once tracking starts, won't try to drag if the touch moves.
     * The default value is true.
     * @platform ios
     */
    // canCancelContentTouches: PropTypes.bool,
    /**
     * Determines whether the keyboard gets dismissed in response to a drag.
     *
     * *Cross platform*
     *
     *   - `'none'` (the default), drags do not dismiss the keyboard.
     *   - `'on-drag'`, the keyboard is dismissed when a drag begins.
     *
     * *iOS Only*
     *
     *   - `'interactive'`, the keyboard is dismissed interactively with the drag and moves in
     *     synchrony with the touch; dragging upwards cancels the dismissal.
     *     On android this is not supported and it will have the same behavior as 'none'.
     */
    keyboardDismissMode: PropTypes.oneOf([
      'none', // default
      'on-drag', // Cross-platform
      'interactive', // iOS-only
    ]),
    /**
     * Determines when the keyboard should stay visible after a tap.
     *
     *   - `'never'` (the default), tapping outside of the focused text input when the keyboard
     *     is up dismisses the keyboard. When this happens, children won't receive the tap.
     *   - `'always'`, the keyboard will not dismiss automatically, and the scroll view will not
     *     catch taps, but children of the scroll view can catch taps.
     *   - `'handled'`, the keyboard will not dismiss automatically when the tap was handled by
     *     a children, (or captured by an ancestor).
     *   - `false`, deprecated, use 'never' instead
     *   - `true`, deprecated, use 'always' instead
     */
    keyboardShouldPersistTaps: PropTypes.oneOf(['always', 'never', 'handled', false, true]),
    /**
     * The maximum allowed zoom scale. The default value is 1.0.
     * @platform ios
     */
    // maximumZoomScale: PropTypes.number,
    /**
     * The minimum allowed zoom scale. The default value is 1.0.
     * @platform ios
     */
    // minimumZoomScale: PropTypes.number,
    /**
     * Called when the momentum scroll starts (scroll which occurs as the ScrollView glides to a stop).
     */
    onMomentumScrollBegin: PropTypes.func,
    /**
     * Called when the momentum scroll ends (scroll which occurs as the ScrollView glides to a stop).
     */
    onMomentumScrollEnd: PropTypes.func,
    /**
     * Fires at most once per frame during scrolling. The frequency of the
     * events can be controlled using the `scrollEventThrottle` prop.
     */
    onScroll: PropTypes.func,
    /**
     * Called when scrollable content view of the ScrollView changes.
     *
     * Handler function is passed the content width and content height as parameters:
     * `(contentWidth, contentHeight)`
     *
     * It's implemented using onLayout handler attached to the content container
     * which this ScrollView renders.
     */
    onContentSizeChange: PropTypes.func,
    /**
     * When true, the scroll view stops on multiples of the scroll view's size
     * when scrolling. This can be used for horizontal pagination. The default
     * value is false.
     *
     * Note: Vertical pagination is not supported on Android.
     */
    pagingEnabled: PropTypes.bool,
    /**
    * When true, ScrollView allows use of pinch gestures to zoom in and out.
    * The default value is true.
    * @platform ios
    */
    // pinchGestureEnabled: PropTypes.bool,
    /**
     * When false, the view cannot be scrolled via touch interaction.
     * The default value is true.
     *
     * Note that the view can be always be scrolled by calling `scrollTo`.
     */
    scrollEnabled: PropTypes.bool,
    /**
     * This controls how often the scroll event will be fired while scrolling
     * (as a time interval in ms). A lower number yields better accuracy for code
     * that is tracking the scroll position, but can lead to scroll performance
     * problems due to the volume of information being send over the bridge.
     * You will not notice a difference between values set between 1-16 as the
     * JS run loop is synced to the screen refresh rate. If you do not need precise
     * scroll position tracking, set this value higher to limit the information
     * being sent across the bridge. The default value is zero, which results in
     * the scroll event being sent only once each time the view is scrolled.
     * @platform ios
     */
    // scrollEventThrottle: PropTypes.number,
    /**
     * The amount by which the scroll view indicators are inset from the edges
     * of the scroll view. This should normally be set to the same value as
     * the `contentInset`. Defaults to `{0, 0, 0, 0}`.
     * @platform ios
     */
    // scrollIndicatorInsets: EdgeInsetsPropType,
    /**
     * When true, the scroll view scrolls to top when the status bar is tapped.
     * The default value is true.
     * @platform ios
     */
    // scrollsToTop: PropTypes.bool,
    /**
     * When true, shows a horizontal scroll indicator.
     * The default value is true.
     */
    showsHorizontalScrollIndicator: PropTypes.bool,
    /**
     * When true, shows a vertical scroll indicator.
     * The default value is true.
     */
    showsVerticalScrollIndicator: PropTypes.bool,
    /**
     * An array of child indices determining which children get docked to the
     * top of the screen when scrolling. For example, passing
     * `stickyHeaderIndices={[0]}` will cause the first child to be fixed to the
     * top of the scroll view. This property is not supported in conjunction
     * with `horizontal={true}`.
     */
    stickyHeaderIndices: PropTypes.arrayOf(PropTypes.number),
    style: StyleSheetPropType(ViewStylePropTypes),
    /**
     * When set, causes the scroll view to stop at multiples of the value of
     * `snapToInterval`. This can be used for paginating through children
     * that have lengths smaller than the scroll view. Typically used in
     * combination with `snapToAlignment` and `decelerationRate="fast"`.
     * Overrides less configurable `pagingEnabled` prop.
     *
     * @platform ios
     */
    // snapToInterval: PropTypes.number,
    /**
     * When `snapToInterval` is set, `snapToAlignment` will define the relationship
     * of the snapping to the scroll view.
     *
     *   - `'start'` (the default) will align the snap at the left (horizontal) or top (vertical)
     *   - `'center'` will align the snap in the center
     *   - `'end'` will align the snap at the right (horizontal) or bottom (vertical)
     *
     * @platform ios
     */
    // snapToAlignment: PropTypes.oneOf([
    //   'start', // default
    //   'center',
    //   'end',
    // ]),
    /**
     * Experimental: When true, offscreen child views (whose `overflow` value is
     * `hidden`) are removed from their native backing superview when offscreen.
     * This can improve scrolling performance on long lists. The default value is
     * true.
     */
    removeClippedSubviews: PropTypes.bool,
    /**
     * The current scale of the scroll view content. The default value is 1.0.
     * @platform ios
     */
    // zoomScale: PropTypes.number,
    /**
     * This property specifies how the safe area insets are used to modify the
     * content area of the scroll view. The default value of this property is
     * "never". Available on iOS 11 and later.
     * @platform ios
     */
    // contentInsetAdjustmentBehavior: PropTypes.oneOf([
    //   'automatic',
    //   'scrollableAxes',
    //   'never', // default
    //   'always',
    // ]),
    /**
     * A RefreshControl component, used to provide pull-to-refresh
     * functionality for the ScrollView. Only works for vertical ScrollViews
     * (`horizontal` prop must be `false`).
     *
     * See [RefreshControl](docs/refreshcontrol.html).
     */
    refreshControl: PropTypes.element,

    /**
     * Sometimes a scrollview takes up more space than its content fills. When this is
     * the case, this prop will fill the rest of the scrollview with a color to avoid setting
     * a background and creating unnecessary overdraw. This is an advanced optimization
     * that is not needed in the general case.
     * @platform android
     */
    // endFillColor: ColorPropType,

    /**
     * Tag used to log scroll performance on this scroll view. Will force
     * momentum events to be turned on (see sendMomentumEvents). This doesn't do
     * anything out of the box and you need to implement a custom native
     * FpsListener for it to be useful.
     * @platform android
     */
    // scrollPerfTag: PropTypes.string,

     /**
     * Used to override default value of overScroll mode.
     *
     * Possible values:
     *
     *  - `'auto'` - Default value, allow a user to over-scroll
     *    this view only if the content is large enough to meaningfully scroll.
     *  - `'always'` - Always allow a user to over-scroll this view.
     *  - `'never'` - Never allow a user to over-scroll this view.
     *
     * @platform android
     */
    // overScrollMode: PropTypes.oneOf([
    //   'auto',
    //   'always',
    //   'never',
    // ]),
    /**
     * When true, ScrollView will emit updateChildFrames data in scroll events,
     * otherwise will not compute or emit child frame data.  This only exists
     * to support legacy issues, `onLayout` should be used instead to retrieve
     * frame data.
     * The default value is false.
     * @platform ios
     */
    // DEPRECATED_sendUpdatedChildFrames: PropTypes.bool,
  },

  mixins: [ScrollResponder.Mixin],

  getInitialState: function() {
    return this.scrollResponderMixinGetInitialState();
  },

  setNativeProps: function(props: Object) {
    this._ScrollViewRef.setNativeProps(props);
  },

  /**
   * Returns a reference to the underlying scroll responder, which supports
   * operations like `scrollTo`. All ScrollView-like components should
   * implement this method so that they can be composed while providing access
   * to the underlying scroll responder's methods.
   */
  getScrollResponder: function(): ScrollView {
    return this;
  },

  getScrollableNode: function(): any {
    return ReactNative.findNodeHandle(this._scrollViewRef);
  },

  getInnerViewNode: function(): any {
    return ReactNative.findNodeHandle(this._innerViewRef);
  },

  /**
   * Scrolls to a given x, y offset, either immediately or with a smooth animation.
   *
   * Example:
   *
   * `scrollTo({x: 0, y: 0, animated: true})`
   *
   * Note: The weird function signature is due to the fact that, for historical reasons,
   * the function also accepts separate arguments as an alternative to the options object.
   * This is deprecated due to ambiguity (y before x), and SHOULD NOT BE USED.
   */
  scrollTo: function(
    y?: number | { x?: number, y?: number, animated?: boolean },
    x?: number,
    animated?: boolean
  ) {
    if (typeof y === 'number') {
      console.warn('`scrollTo(y, x, animated)` is deprecated. Use `scrollTo({x: 5, y: 5, ' +
        'animated: true})` instead.');
    } else {
      ({x, y, animated} = y || {});
    }

    const scrollViewNode = ReactNative.findNodeHandle(this._scrollViewRef);
    if (scrollViewNode) {
      scrollViewNode.scrollTop = y || 0;
      scrollViewNode.scrollLeft = x || 0;
    }
  },

    /**
   * If this is a vertical ScrollView scrolls to the bottom.
   * If this is a horizontal ScrollView scrolls to the right.
   *
   * Use `scrollToEnd({ animated: true })` for smooth animated scrolling,
   * `scrollToEnd({ animated: false })` for immediate scrolling.
   * If no options are passed, `animated` defaults to true.
   */
  scrollToEnd: function(options?: { animated?: boolean }) {
    // Default to true
    const animated = (options && options.animated) !== false;
    const { horizontal } = this.props;
    const scrollResponder = this.getScrollResponder();
    const scrollResponderNode = scrollResponder.scrollResponderGetScrollableNode();
    const x = horizontal ? scrollResponderNode.scrollWidth : 0;
    const y = horizontal ? 0 : scrollResponderNode.scrollHeight;
    scrollResponder.scrollResponderScrollTo({ x, y, animated });
  },

  /**
   * Deprecated, do not use.
   */
  scrollWithoutAnimationTo: function(y: number = 0, x: number = 0) {
    // console.warn('`scrollWithoutAnimationTo` is deprecated. Use `scrollTo` instead');
    this.scrollTo({ x, y, animated: false });
  },

  _handleScroll(e) {
    // 参考 react-native-web ScrollViewBase
    e.stopPropagation();

    if (this.props.keyboardDismissMode === 'on-drag') {
      dismissKeyboard();
    }
    normalizeScrollEvent(e);
    this.scrollResponderHandleScroll(e);
  },

  _handleContentOnLayout: function(e: Object) {
    const {width, height} = e.nativeEvent.layout;
    this.props.onContentSizeChange && this.props.onContentSizeChange(width, height);
  },

  _scrollViewRef: (null: ?ScrollView),
  _setScrollViewRef: function(ref: ?ScrollView) {
    this._scrollViewRef = ref;
  },

  _innerViewRef: (null: ?NativeMethodsMixinType),
  _setInnerViewRef: function(ref: ?NativeMethodsMixinType) {
    this._innerViewRef = ref;
  },

  render: function() {
    const props = this.props;
    const contentContainer =
      <View
        ref={this._setInnerViewRef}
        className={props.horizontal ? (CSSClassNames.SCROLL_VIEW_CONTENT + ' ' + CSSClassNames.SCROLL_VIEW_CONTENT_H) : CSSClassNames.SCROLL_VIEW_CONTENT}
        style={props.contentContainerStyle}
        // removeClippedSubviews={props.removeClippedSubviews}
        // collapsable={false}
        onLayout={props.onContentSizeChange && this._handleContentOnLayout}>
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

    // const style = flattenStyle([styles.base, props.style]);
    const style = flattenStyle(props.style) || {};
    if (!('flex' in style)) {
      style.flex = 1;
    }
    if (style.flex && !style.flexBasis) {
      //对设置了flex，将flexBasis设为0 解决有些浏览器不可滚动的bug 0, 0px 与0%不同?
      style.flexBasis = 0;
    }

    const containerProps = {
      ...props,
      horizontal: undefined,
      ref: this._setScrollViewRef,
      className,
      style,
      onTouchStart: this.scrollResponderHandleTouchStart,
      onTouchMove: this.scrollResponderHandleTouchMove,
      onTouchEnd: this.scrollResponderHandleTouchEnd,
      onScrollBeginDrag: this.scrollResponderHandleScrollBeginDrag,
      onScrollEndDrag: this.scrollResponderHandleScrollEndDrag,
      onMomentumScrollBegin: this.scrollResponderHandleMomentumScrollBegin,
      onMomentumScrollEnd: this.scrollResponderHandleMomentumScrollEnd,
      onStartShouldSetResponder: this.scrollResponderHandleStartShouldSetResponder,
      onStartShouldSetResponderCapture: this.scrollResponderHandleStartShouldSetResponderCapture,
      onScrollShouldSetResponder: this.scrollResponderHandleScrollShouldSetResponder,
      onScroll: this._handleScroll,
      onResponderGrant: this.scrollResponderHandleResponderGrant,
      onResponderTerminationRequest: this.scrollResponderHandleTerminationRequest,
      onResponderTerminate: this.scrollResponderHandleTerminate,
      onResponderRelease: this.scrollResponderHandleResponderRelease,
      onResponderReject: this.scrollResponderHandleResponderReject,
      // sendMomentumEvents: (props.onMomentumScrollBegin || props.onMomentumScrollEnd) ? true : false,
    };

    // require('RWTouchTest').assignLog(containerProps, 'ScrollView');

    return React.createElement(View, containerProps, contentContainer);
  },
});

// const styles = StyleSheet.create({
//   base: {
//     flex: 1,
//   },
// });

module.exports = ScrollView;
