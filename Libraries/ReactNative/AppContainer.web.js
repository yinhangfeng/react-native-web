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

const React = require('React');
const CSSClassNames = require('CSSClassNames');
const RWConfig = require('RWConfig');
// TODO material-ui 库需要, 暂时放在这里，应该由使用者提供
const getMuiTheme = __requireDefault(require('material-ui/src/styles/getMuiTheme'));
const PropTypes = require('prop-types');

/**
 * 对未设置bodyScrollMode 的ROOT_CONTAINER样式设为overflow: 'hidden',
 * 否则在某些浏览器中会出现body滚动
 */
class AppContainer extends React.Component {
  
  static childContextTypes = {
    muiTheme: PropTypes.object,
  };

  getChildContext() {
    return {
      muiTheme: getMuiTheme(),
    };
  }

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