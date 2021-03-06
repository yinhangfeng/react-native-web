/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

'use strict';

const React = require('react-native/Libraries/react-native/React');
const StyleSheet = require('react-native/Libraries/StyleSheet/StyleSheet');
const Text = require('react-native/Libraries/Text/Text');
const View = require('react-native/Libraries/Components/View/View');

class DummyProgressViewIOS extends React.Component {
  render() {
    return (
      <View style={[styles.dummy, this.props.style]}>
        <Text style={styles.text}>
          ProgressViewIOS is not supported on this platform!
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dummy: {
    width: 120,
    height: 20,
    backgroundColor: '#ffbcbc',
    borderWidth: 1,
    borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#333333',
    margin: 5,
    fontSize: 10,
  },
});

module.exports = DummyProgressViewIOS;
