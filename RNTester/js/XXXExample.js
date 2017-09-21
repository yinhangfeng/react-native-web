/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import ReactNative, {
  AlertIOS,
  CameraRoll,
  Image,
  Linking,
  ProgressViewIOS,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Button,
} from 'react-native';

class Example extends Component {

  constructor(props) {
    super(props);
    this.state = {
      renderError: false,
    };

    this.testPressError = this.testPressError.bind(this);
  }

  testPressError() {
    throw new Error('TEST onPress Error');
  }

  testSetTimeoutError() {
    setTimeout(() => {
      throw new Error('TEST setTimeout Error');
    }, 100);
  }

  testRenderError() {
    this.setState({
      renderError: !this.state.renderError,
    });
  }

  render() {
    if (this.state.renderError) {
      throw new Error('TEST render Error');
    }
    return (
      <View>
        <Button
          title="onPress Error"
          onPress={this.testPressError}/>
        <View style={styles.separate}></View>
        <Button
          title="setTimeout Error"
          onPress={this.testSetTimeoutError}/>
        <View style={styles.separate}></View>
        <Button
          title="React render Error"
          onPress={this.testRenderError.bind(this)}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  separate: {
    height: 8,
  },
});

exports.framework = 'React';
exports.title = 'XXX';
exports.description = 'XXX';
exports.examples = [{
  title: 'Error',
  render() {
    return (
      <Example/>
    );
  }
},];
