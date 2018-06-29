/**
 * RW SYNC react-native-web: 0.1.0
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @format
 * @flow
 */

'use strict';

const React = require('react-native/Libraries/react-native/React');
const CSSClassNames = require('react-native/Libraries/StyleSheet/CSSClassNames');
const PropTypes = require('prop-types');

class AppContainer extends React.Component {

  render() {
    return (
      <div
        className={CSSClassNames.ROOT_CONTAINER}
        style={{overflow: 'hidden',}}>
        {this.props.children}
      </div>
    );
  }
}

module.exports = AppContainer;