/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

const React = require('react-native/Libraries/react-native/React');
const StyleSheet = require('react-native/Libraries/StyleSheet/StyleSheet');
const TouchableWithoutFeedback = require('react-native/Libraries/Components/Touchable/TouchableWithoutFeedback');
const View = require('react-native/Libraries/Components/View/View');
const YellowBoxStyle = require('react-native/Libraries/YellowBox/UI/YellowBoxStyle');

import type {PressEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import type {EdgeInsetsProp} from 'react-native/Libraries/StyleSheet/EdgeInsetsPropType';
import type {ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

type Props = $ReadOnly<{|
  backgroundColor: $ReadOnly<{|
    default: string,
    pressed: string,
  |}>,
  children?: React.Node,
  hitSlop?: ?EdgeInsetsProp,
  onPress?: ?(event: PressEvent) => void,
  style?: ViewStyleProp,
|}>;

type State = {|
  pressed: boolean,
|};

class YellowBoxPressable extends React.Component<Props, State> {
  static defaultProps = {
    backgroundColor: {
      default: YellowBoxStyle.getBackgroundColor(0.95),
      pressed: YellowBoxStyle.getHighlightColor(1),
    },
  };

  state = {
    pressed: false,
  };

  render(): React.Node {
    const content = (
      <View
        style={StyleSheet.compose(
          {
            backgroundColor: this.state.pressed
              ? this.props.backgroundColor.pressed
              : this.props.backgroundColor.default,
          },
          this.props.style,
        )}>
        {this.props.children}
      </View>
    );
    return this.props.onPress == null ? (
      content
    ) : (
      <TouchableWithoutFeedback
        hitSlop={this.props.hitSlop}
        onPress={this.props.onPress}
        onPressIn={this._handlePressIn}
        onPressOut={this._handlePressOut}>
        {content}
      </TouchableWithoutFeedback>
    );
  }

  _handlePressIn = () => {
    this.setState({pressed: true});
  };

  _handlePressOut = () => {
    this.setState({pressed: false});
  };
}

module.exports = YellowBoxPressable;
