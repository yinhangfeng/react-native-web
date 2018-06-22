/**
 * RW SYNC react-native: 0.49
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */
'use strict';

const NativeMethodsMixin = require('react-native/Libraries/Renderer/shims/NativeMethodsMixin');
// const PropTypes = require('prop-types');
const React = require('react-native/Libraries/react-native/React');
// const ReactNativeStyleAttributes = require('react-native/Libraries/Components/View/ReactNativeStyleAttributes');
// const ReactNativeViewAttributes = require('react-native/Libraries/Components/View/ReactNativeViewAttributes');
const ViewPropTypes = require('react-native/Libraries/Components/View/ViewPropTypes');

const createReactClass = require('create-react-class');

const LayoutMixin = require('react-native/Libraries/lrnw/RWLayoutMixin');
const createWebCoreElement = require('react-native/Libraries/lrnw/createWebCoreElement');
const CSSClassNames = require('react-native/Libraries/StyleSheet/CSSClassNames');

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';

export type Props = ViewProps;

/**
 * The most fundamental component for building a UI, `View` is a container that supports layout with
 * [flexbox](docs/flexbox.html), [style](docs/style.html),
 * [some touch handling](docs/handling-touches.html), and
 * [accessibility](docs/accessibility.html) controls. `View` maps directly to the
 * native view equivalent on whatever platform React Native is running on, whether that is a
 * `UIView`, `<div>`, `android.view`, etc.
 *
 * `View` is designed to be nested inside other views and can have 0 to many children of any type.
 *
 * This example creates a `View` that wraps two colored boxes and a text component in a row with
 * padding.
 *
 * ```javascript
 * class ViewColoredBoxesWithText extends Component {
 *   render() {
 *     return (
 *       <View style={{flexDirection: 'row', height: 100, padding: 20}}>
 *         <View style={{backgroundColor: 'blue', flex: 0.3}} />
 *         <View style={{backgroundColor: 'red', flex: 0.5}} />
 *         <Text>Hello World!</Text>
 *       </View>
 *     );
 *   }
 * }
 * ```
 *
 * > `View`s are designed to be used with [`StyleSheet`](docs/style.html) for clarity
 * > and performance, although inline styles are also supported.
 *
 * ### Synthetic Touch Events
 *
 * For `View` responder props (e.g., `onResponderMove`), the synthetic touch event passed to them
 * are of the following form:
 *
 * - `nativeEvent`
 *   - `changedTouches` - Array of all touch events that have changed since the last event.
 *   - `identifier` - The ID of the touch.
 *   - `locationX` - The X position of the touch, relative to the element.
 *   - `locationY` - The Y position of the touch, relative to the element.
 *   - `pageX` - The X position of the touch, relative to the root element.
 *   - `pageY` - The Y position of the touch, relative to the root element.
 *   - `target` - The node id of the element receiving the touch event.
 *   - `timestamp` - A time identifier for the touch, useful for velocity calculation.
 *   - `touches` - Array of all current touches on the screen.
 */
// $FlowFixMe(>=0.41.0)
const View = createReactClass({
  displayName: 'View',
  // TODO: We should probably expose the mixins, viewConfig, and statics publicly. For example,
  // one of the props is of type AccessibilityComponentType. That is defined as a const[] above,
  // but it is not rendered by the docs, since `statics` below is not rendered. So its Possible
  // values had to be hardcoded.
  mixins: [NativeMethodsMixin, LayoutMixin],

  // `propTypes` should not be accessed directly on View since this wrapper only
  // exists for DEV mode. However it's important for them to be declared.
  // If the object passed to `createClass` specifies `propTypes`, Flow will
  // create a static type from it.
  propTypes: ViewPropTypes,

  /**
   * `NativeMethodsMixin` will look for this when invoking `setNativeProps`. We
   * make `this` look like an actual native component class.
   */
  // viewConfig: {
  //   uiViewClassName: 'RCTView',
  //   validAttributes: ReactNativeViewAttributes.RCTView
  // },

  // contextTypes: {
  //   isInAParentText: PropTypes.bool, // RW TODO
  // },

  render: function() {
    const props = this.props;

    let className = CSSClassNames.VIEW;
    if (props.pointerEvents) {
      className += ' ' + CSSClassNames.pointerEventsClassNames[props.pointerEvents];
    }
    if (props.className) {
      //View 的className属性只在lrnw库内部使用
      className += ' ' + props.className;
    }

    return createWebCoreElement('div', {
      ...props,
      className,
    });
  },
});

module.exports = View;
