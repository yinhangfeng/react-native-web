/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

'use strict';

const React = require('react-native/Libraries/react-native/React');
const TextAncestor = require('react-native/Libraries/Text/TextAncestor');

const invariant = require('fbjs/lib/invariant');
const requireNativeComponent = require('react-native/Libraries/ReactNative/requireNativeComponent');

import type {NativeComponent} from 'react-native/Libraries/Renderer/shims/ReactNative';
import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';

export type Props = ViewProps;

/**
 * The most fundamental component for building a UI, View is a container that
 * supports layout with flexbox, style, some touch handling, and accessibility
 * controls.
 *
 * @see http://facebook.github.io/react-native/docs/view.html
 */
const RCTView = requireNativeComponent('RCTView');

let ViewToExport = RCTView;
if (__DEV__) {
  // $FlowFixMe - TODO T29156721 `React.forwardRef` is not defined in Flow, yet.
  ViewToExport = React.forwardRef((props, ref) => (
    <TextAncestor.Consumer>
      {hasTextAncestor => {
        invariant(
          !hasTextAncestor,
          'Nesting of <View> within <Text> is not currently supported.',
        );
        return <RCTView {...props} ref={ref} />;
      }}
    </TextAncestor.Consumer>
  ));
  ViewToExport.displayName = 'View';
}

module.exports = ((ViewToExport: any): Class<NativeComponent<ViewProps>>);
