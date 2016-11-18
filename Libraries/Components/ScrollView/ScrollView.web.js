/**
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
const React = require('React');
const ReactNative = require('ReactNative');
const ScrollResponder = require('ScrollResponder');
const StyleSheet = require('StyleSheet');
const StyleSheetPropType = require('StyleSheetPropType');
const View = require('View');
const ViewStylePropTypes = require('ViewStylePropTypes');

const PropTypes = React.PropTypes;

const RWConfig = require('RWConfig');

const ScrollViewCore = require('./ScrollViewCore');
const BodyScrollViewCore = require('./BodyScrollViewCore');

/**
 * TODO RW
 * 1.scrollEnabled
 * 2.scrollResponder
 * 3.debounce(scrollEventThrottle)
 * 4.scroll event 的完整兼容
 * 5.body scroll 时scrollResponder
 */
const ScrollView = React.createClass({
  propTypes: {
    ...View.propTypes,
    /**
     * Controls whether iOS should automatically adjust the content inset
     * for scroll views that are placed behind a navigation bar or
     * tab bar/ toolbar. The default value is true.
     * @platform ios
     */
    automaticallyAdjustContentInsets: PropTypes.bool,
    /**
     * The amount by which the scroll view content is inset from the edges
     * of the scroll view. Defaults to `{top: 0, left: 0, bottom: 0, right: 0}`.
     * @platform ios
     */
    contentInset: EdgeInsetsPropType,
    /**
     * Used to manually set the starting scroll offset.
     * The default value is `{x: 0, y: 0}`.
     * @platform ios
     */
    contentOffset: PointPropType,
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
    bouncesZoom: PropTypes.bool,
    /**
     * When true, the scroll view bounces horizontally when it reaches the end
     * even if the content is smaller than the scroll view itself. The default
     * value is true when `horizontal={true}` and false otherwise.
     * @platform ios
     */
    alwaysBounceHorizontal: PropTypes.bool,
    /**
     * When true, the scroll view bounces vertically when it reaches the end
     * even if the content is smaller than the scroll view itself. The default
     * value is false when `horizontal={true}` and true otherwise.
     * @platform ios
     */
    alwaysBounceVertical: PropTypes.bool,
    /**
     * When true, the scroll view automatically centers the content when the
     * content is smaller than the scroll view bounds; when the content is
     * larger than the scroll view, this property has no effect. The default
     * value is false.
     * @platform ios
     */
    centerContent: PropTypes.bool,
    /**
     * These styles will be applied to the scroll view content container which
     * wraps all of the child views. Example:
     *
     *   return (
     *     <ScrollView contentContainerStyle={styles.contentContainer}>
     *     </ScrollView>
     *   );
     *   ...
     *   var styles = StyleSheet.create({
     *     contentContainer: {
     *       paddingVertical: 20
     *     }
     *   });
     */
    contentContainerStyle: StyleSheetPropType(ViewStylePropTypes),
    /**
     * A floating-point number that determines how quickly the scroll view
     * decelerates after the user lifts their finger. You may also use string
     * shortcuts `"normal"` and `"fast"` which match the underlying iOS settings
     * for `UIScrollViewDecelerationRateNormal` and
     * `UIScrollViewDecelerationRateFast` respectively.
     *   - normal: 0.998 (the default)
     *   - fast: 0.99
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
     *   - `default` (the default), same as `black`.
     *   - `black`, scroll indicator is black. This style is good against a white content background.
     *   - `white`, scroll indicator is white. This style is good against a black content background.
     * @platform ios
     */
    indicatorStyle: PropTypes.oneOf([
      'default', // default
      'black',
      'white',
    ]),
    /**
     * When true, the ScrollView will try to lock to only vertical or horizontal
     * scrolling while dragging.  The default value is false.
     * @platform ios
     */
    directionalLockEnabled: PropTypes.bool,
    /**
     * When false, once tracking starts, won't try to drag if the touch moves.
     * The default value is true.
     * @platform ios
     */
    canCancelContentTouches: PropTypes.bool,
    /**
     * Determines whether the keyboard gets dismissed in response to a drag.
     *   - 'none' (the default), drags do not dismiss the keyboard.
     *   - 'on-drag', the keyboard is dismissed when a drag begins.
     *   - 'interactive', the keyboard is dismissed interactively with the drag and moves in
     *     synchrony with the touch; dragging upwards cancels the dismissal.
     *     On android this is not supported and it will have the same behavior as 'none'.
     */
    keyboardDismissMode: PropTypes.oneOf([
      'none', // default
      'interactive',
      'on-drag',
    ]),
    /**
     * When false, tapping outside of the focused text input when the keyboard
     * is up dismisses the keyboard. When true, the scroll view will not catch
     * taps, and the keyboard will not dismiss automatically. The default value
     * is false.
     */
    keyboardShouldPersistTaps: PropTypes.bool,
    /**
     * The maximum allowed zoom scale. The default value is 1.0.
     * @platform ios
     */
    maximumZoomScale: PropTypes.number,
    /**
     * The minimum allowed zoom scale. The default value is 1.0.
     * @platform ios
     */
    minimumZoomScale: PropTypes.number,
    /**
     * Fires at most once per frame during scrolling. The frequency of the
     * events can be controlled using the `scrollEventThrottle` prop.
     */
    onScroll: PropTypes.func,
    /**
     * Called when a scrolling animation ends.
     * @platform ios
     */
    onScrollAnimationEnd: PropTypes.func,
    /**
     * The amount by which the scroll view content is inset from the edges
     * of the scroll view. Defaults to `{top: 0, left: 0, bottom: 0, right: 0}`.
     * @platform ios
     */
    onContentSizeChange: PropTypes.func,
    /**
     * When true, the scroll view stops on multiples of the scroll view's size
     * when scrolling. This can be used for horizontal pagination. The default
     * value is false.
     * @platform ios
     */
    pagingEnabled: PropTypes.bool,
    /**
     * When false, the content does not scroll.
     * The default value is true.
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
    scrollEventThrottle: PropTypes.number,
    /**
     * The amount by which the scroll view indicators are inset from the edges
     * of the scroll view. This should normally be set to the same value as
     * the `contentInset`. Defaults to `{0, 0, 0, 0}`.
     * @platform ios
     */
    scrollIndicatorInsets: EdgeInsetsPropType,
    /**
     * When true, the scroll view scrolls to top when the status bar is tapped.
     * The default value is true.
     * @platform ios
     */
    scrollsToTop: PropTypes.bool,
    /**
     * When true, shows a horizontal scroll indicator.
     */
    showsHorizontalScrollIndicator: PropTypes.bool,
    /**
     * When true, shows a vertical scroll indicator.
     */
    showsVerticalScrollIndicator: PropTypes.bool,
    /**
     * An array of child indices determining which children get docked to the
     * top of the screen when scrolling. For example, passing
     * `stickyHeaderIndices={[0]}` will cause the first child to be fixed to the
     * top of the scroll view. This property is not supported in conjunction
     * with `horizontal={true}`.
     * @platform ios
     */
    stickyHeaderIndices: PropTypes.arrayOf(PropTypes.number),
    style: StyleSheetPropType(ViewStylePropTypes),
    /**
     * When set, causes the scroll view to stop at multiples of the value of
     * `snapToInterval`. This can be used for paginating through children
     * that have lengths smaller than the scroll view. Used in combination
     * with `snapToAlignment`.
     * @platform ios
     */
    snapToInterval: PropTypes.number,
    /**
     * When `snapToInterval` is set, `snapToAlignment` will define the relationship
     * of the snapping to the scroll view.
     *   - `start` (the default) will align the snap at the left (horizontal) or top (vertical)
     *   - `center` will align the snap in the center
     *   - `end` will align the snap at the right (horizontal) or bottom (vertical)
     * @platform ios
     */
    snapToAlignment: PropTypes.oneOf([
      'start', // default
      'center',
      'end',
    ]),
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
    zoomScale: PropTypes.number,

    /**
     * A RefreshControl component, used to provide pull-to-refresh
     * functionality for the ScrollView.
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
    endFillColor: ColorPropType,

    /**
     * 是否使用body滚动模式
     * 如果为horizontal则该属性无效
     */
    bodyScrollMode: PropTypes.bool,
  },

  mixins: [ScrollResponder.Mixin],

  getDefaultProps: function() {
    return {
      bodyScrollMode: RWConfig.bodyScrollMode,
    };
  },

  getInitialState: function() {
    if (this.props.bodyScrollMode && !this.props.horizontal) {
      this._scrollViewCore = new BodyScrollViewCore(this);
    } else {
      this._scrollViewCore = new ScrollViewCore(this);
    }

    return this.scrollResponderMixinGetInitialState();
  },

  componentWillReceiveProps: function(nextProps) {
    let curIsBodyScroll = this.props.bodyScrollMode && !this.props.horizontal;
    let nextIsBodyScroll = nextProps.bodyScrollMode && !nextProps.horizontal;
    if (curIsBodyScroll !== nextIsBodyScroll) {
      this._scrollViewCore.destroy();
      if (nextIsBodyScroll) {
        this._scrollViewCore = new BodyScrollViewCore(this);
      } else {
        this._scrollViewCore = new ScrollViewCore(this);
      }
    }
  },

  componentWillUnmount: function() {
    this._scrollViewCore.destroy();
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
  getScrollResponder: function(): ReactComponent {
    return this;
  },

  getScrollableNode: function(): any {
    return this._scrollViewCore.getScrollableNode();
  },

  getInnerViewNode: function(): any {
    return this._scrollViewCore.getInnerViewNode();
  },

  /**
   * Scrolls to a given x, y offset, either immediately or with a smooth animation.
   *
   * Syntax:
   *
   * `scrollTo(options: {x: number = 0; y: number = 0; animated: boolean = true})`
   *
   * Note: The weird argument signature is due to the fact that, for historical reasons,
   * the function also accepts separate arguments as as alternative to the options object.
   * This is deprecated due to ambiguity (y before x), and SHOULD NOT BE USED.
   */
  scrollTo: function(
    y?: number | { x?: number, y?: number, animated?: boolean },
    x?: number,
    animated?: boolean
  ) {
    if (typeof y === 'number') {
      console.warn('`scrollTo(y, x, animated)` is deprecated. Use `scrollTo({x: 5, y: 5, animated: true})` instead.');
    } else {
      ({x, y, animated} = y || {});
    }

    this._scrollViewCore.scrollTo(x, y, animated);
  },

  _handleContentOnLayout: function(e: Object) {
    var {width, height} = e.nativeEvent.layout;
    this.props.onContentSizeChange && this.props.onContentSizeChange(width, height);
  },

  _setContainerRef: function(ref) {
    this._ScrollViewRef = ref;
    this._scrollViewNode = ref ? ReactNative.findNodeHandle(ref) : null;
  },

  _setInnerRef: function(ref) {
    this._InnerScrollViewRef = ref;
    this._innerViewNode = ref ? ReactNative.findNodeHandle(ref) : null;
  },

  render: function() {
    return this._scrollViewCore.render();
  }
});

module.exports = ScrollView;
