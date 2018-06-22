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
const StyleSheet = require('react-native/Libraries/StyleSheet/StyleSheet');
const TabBarItemIOS = require('react-native/Libraries/Components/TabBarIOS/TabBarItemIOS');
const View = require('react-native/Libraries/Components/View/View');

class DummyTabBarIOS extends React.Component<$FlowFixMeProps> {
  static Item = TabBarItemIOS;

  render() {
    return (
      <View style={[this.props.style, styles.tabGroup]}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabGroup: {
    flex: 1,
  },
});

module.exports = DummyTabBarIOS;
