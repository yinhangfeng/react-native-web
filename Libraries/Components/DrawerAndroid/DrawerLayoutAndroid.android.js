/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

'use strict';

const ColorPropType = require('react-native/Libraries/StyleSheet/ColorPropType');
const NativeMethodsMixin = require('react-native/Libraries/Renderer/shims/NativeMethodsMixin');
const Platform = require('react-native/Libraries/Utilities/Platform');
const React = require('react-native/Libraries/react-native/React');
const PropTypes = require('prop-types');
const ReactNative = require('react-native/Libraries/Renderer/shims/ReactNative');
const StatusBar = require('react-native/Libraries/Components/StatusBar/StatusBar');
const StyleSheet = require('react-native/Libraries/StyleSheet/StyleSheet');
const UIManager = require('react-native/Libraries/ReactNative/UIManager');
const View = require('react-native/Libraries/Components/View/View');
const ViewPropTypes = require('react-native/Libraries/Components/View/ViewPropTypes');

const DrawerConsts = UIManager.AndroidDrawerLayout.Constants;

const createReactClass = require('create-react-class');
const dismissKeyboard = require('react-native/Libraries/Utilities/dismissKeyboard');
const requireNativeComponent = require('react-native/Libraries/ReactNative/requireNativeComponent');

const RK_DRAWER_REF = 'drawerlayout';
const INNERVIEW_REF = 'innerView';

const DRAWER_STATES = ['Idle', 'Dragging', 'Settling'];

/**
 * React component that wraps the platform `DrawerLayout` (Android only). The
 * Drawer (typically used for navigation) is rendered with `renderNavigationView`
 * and direct children are the main view (where your content goes). The navigation
 * view is initially not visible on the screen, but can be pulled in from the
 * side of the window specified by the `drawerPosition` prop and its width can
 * be set by the `drawerWidth` prop.
 *
 * Example:
 *
 * ```
 * render: function() {
 *   var navigationView = (
 *     <View style={{flex: 1, backgroundColor: '#fff'}}>
 *       <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text>
 *     </View>
 *   );
 *   return (
 *     <DrawerLayoutAndroid
 *       drawerWidth={300}
 *       drawerPosition={DrawerLayoutAndroid.positions.Left}
 *       renderNavigationView={() => navigationView}>
 *       <View style={{flex: 1, alignItems: 'center'}}>
 *         <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>Hello</Text>
 *         <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>World!</Text>
 *       </View>
 *     </DrawerLayoutAndroid>
 *   );
 * },
 * ```
 */
const DrawerLayoutAndroid = createReactClass({
  displayName: 'DrawerLayoutAndroid',
  statics: {
    positions: DrawerConsts.DrawerPosition,
  },

  propTypes: {
    ...ViewPropTypes,
    /**
     * Determines whether the keyboard gets dismissed in response to a drag.
     *   - 'none' (the default), drags do not dismiss the keyboard.
     *   - 'on-drag', the keyboard is dismissed when a drag begins.
     */
    keyboardDismissMode: PropTypes.oneOf([
      'none', // default
      'on-drag',
    ]),
    /**
     * Specifies the background color of the drawer. The default value is white.
     * If you want to set the opacity of the drawer, use rgba. Example:
     *
     * ```
     * return (
     *   <DrawerLayoutAndroid drawerBackgroundColor="rgba(0,0,0,0.5)">
     *   </DrawerLayoutAndroid>
     * );
     * ```
     */
    drawerBackgroundColor: ColorPropType,
    /**
     * Specifies the side of the screen from which the drawer will slide in.
     */
    drawerPosition: PropTypes.oneOf([
      DrawerConsts.DrawerPosition.Left,
      DrawerConsts.DrawerPosition.Right,
    ]),
    /**
     * Specifies the width of the drawer, more precisely the width of the view that be pulled in
     * from the edge of the window.
     */
    drawerWidth: PropTypes.number,
    /**
     * Specifies the lock mode of the drawer. The drawer can be locked in 3 states:
     * - unlocked (default), meaning that the drawer will respond (open/close) to touch gestures.
     * - locked-closed, meaning that the drawer will stay closed and not respond to gestures.
     * - locked-open, meaning that the drawer will stay opened and not respond to gestures.
     * The drawer may still be opened and closed programmatically (`openDrawer`/`closeDrawer`).
     */
    drawerLockMode: PropTypes.oneOf([
      'unlocked',
      'locked-closed',
      'locked-open',
    ]),
    /**
     * Function called whenever there is an interaction with the navigation view.
     */
    onDrawerSlide: PropTypes.func,
    /**
     * Function called when the drawer state has changed. The drawer can be in 3 states:
     * - idle, meaning there is no interaction with the navigation view happening at the time
     * - dragging, meaning there is currently an interaction with the navigation view
     * - settling, meaning that there was an interaction with the navigation view, and the
     * navigation view is now finishing its closing or opening animation
     */
    onDrawerStateChanged: PropTypes.func,
    /**
     * Function called whenever the navigation view has been opened.
     */
    onDrawerOpen: PropTypes.func,
    /**
     * Function called whenever the navigation view has been closed.
     */
    onDrawerClose: PropTypes.func,
    /**
     * The navigation view that will be rendered to the side of the screen and can be pulled in.
     */
    renderNavigationView: PropTypes.func.isRequired,

    /**
     * Make the drawer take the entire screen and draw the background of the
     * status bar to allow it to open over the status bar. It will only have an
     * effect on API 21+.
     */
    statusBarBackgroundColor: ColorPropType,
  },

  mixins: [NativeMethodsMixin],

  getDefaultProps: function(): Object {
    return {
      drawerBackgroundColor: 'white',
    };
  },

  getInitialState: function() {
    return {statusBarBackgroundColor: undefined};
  },

  getInnerViewNode: function() {
    return this.refs[INNERVIEW_REF].getInnerViewNode();
  },

  render: function() {
    const drawStatusBar =
      Platform.Version >= 21 && this.props.statusBarBackgroundColor;
    const drawerViewWrapper = (
      <View
        style={[
          styles.drawerSubview,
          {
            width: this.props.drawerWidth,
            backgroundColor: this.props.drawerBackgroundColor,
          },
        ]}
        collapsable={false}>
        {this.props.renderNavigationView()}
        {drawStatusBar && <View style={styles.drawerStatusBar} />}
      </View>
    );
    const childrenWrapper = (
      <View ref={INNERVIEW_REF} style={styles.mainSubview} collapsable={false}>
        {drawStatusBar && (
          <StatusBar
            translucent
            backgroundColor={this.props.statusBarBackgroundColor}
          />
        )}
        {drawStatusBar && (
          <View
            style={[
              styles.statusBar,
              {backgroundColor: this.props.statusBarBackgroundColor},
            ]}
          />
        )}
        {this.props.children}
      </View>
    );
    return (
      <AndroidDrawerLayout
        {...this.props}
        ref={RK_DRAWER_REF}
        drawerWidth={this.props.drawerWidth}
        drawerPosition={this.props.drawerPosition}
        drawerLockMode={this.props.drawerLockMode}
        style={[styles.base, this.props.style]}
        onDrawerSlide={this._onDrawerSlide}
        onDrawerOpen={this._onDrawerOpen}
        onDrawerClose={this._onDrawerClose}
        onDrawerStateChanged={this._onDrawerStateChanged}>
        {childrenWrapper}
        {drawerViewWrapper}
      </AndroidDrawerLayout>
    );
  },

  _onDrawerSlide: function(event) {
    if (this.props.onDrawerSlide) {
      this.props.onDrawerSlide(event);
    }
    if (this.props.keyboardDismissMode === 'on-drag') {
      dismissKeyboard();
    }
  },

  _onDrawerOpen: function() {
    if (this.props.onDrawerOpen) {
      this.props.onDrawerOpen();
    }
  },

  _onDrawerClose: function() {
    if (this.props.onDrawerClose) {
      this.props.onDrawerClose();
    }
  },

  _onDrawerStateChanged: function(event) {
    if (this.props.onDrawerStateChanged) {
      this.props.onDrawerStateChanged(
        DRAWER_STATES[event.nativeEvent.drawerState],
      );
    }
  },

  /**
   * Opens the drawer.
   */
  openDrawer: function() {
    UIManager.dispatchViewManagerCommand(
      this._getDrawerLayoutHandle(),
      UIManager.AndroidDrawerLayout.Commands.openDrawer,
      null,
    );
  },

  /**
   * Closes the drawer.
   */
  closeDrawer: function() {
    UIManager.dispatchViewManagerCommand(
      this._getDrawerLayoutHandle(),
      UIManager.AndroidDrawerLayout.Commands.closeDrawer,
      null,
    );
  },
  /**
   * Closing and opening example
   * Note: To access the drawer you have to give it a ref. Refs do not work on stateless components
   * render () {
   *   this.openDrawer = () => {
   *     this.refs.DRAWER.openDrawer()
   *   }
   *   this.closeDrawer = () => {
   *     this.refs.DRAWER.closeDrawer()
   *   }
   *   return (
   *     <DrawerLayoutAndroid ref={'DRAWER'}>
   *     </DrawerLayoutAndroid>
   *   )
   * }
   */
  _getDrawerLayoutHandle: function() {
    return ReactNative.findNodeHandle(this.refs[RK_DRAWER_REF]);
  },
});

const styles = StyleSheet.create({
  base: {
    flex: 1,
    elevation: 16,
  },
  mainSubview: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  drawerSubview: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  statusBar: {
    height: StatusBar.currentHeight,
  },
  drawerStatusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StatusBar.currentHeight,
    backgroundColor: 'rgba(0, 0, 0, 0.251)',
  },
});

// The View that contains both the actual drawer and the main view
const AndroidDrawerLayout = requireNativeComponent('AndroidDrawerLayout');

module.exports = DrawerLayoutAndroid;
