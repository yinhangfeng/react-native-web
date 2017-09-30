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

import React from 'react';
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
} from 'react-native';

class Button extends React.Component {
  render() {
    return (
      <TouchableHighlight
        style={styles.wrapper}
        onPress={this.props.onPress}>
        <View style={styles.button}>
          <Text>{this.props.title}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

class Example extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      
    };

    console.log('bluebird Promise: async schedule', Promise._async._schedule);

    this.test1 = this.test1.bind(this);
    this.testCancel = this.testCancel.bind(this);
  }

  test1() {
    this._promise1 = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve({
            xxx: 1,
          });
        } else {
          reject(new Error('xxx'));
        }
      }, 5000);
    }).then((res) => {
      console.log('then ', res);
    }).catch((error) => {
      console.log('catch ', error);
    }).finally(() => {
      console.log('finally');
    });
  }

  testCancel() {
    this._promise1 && this._promise1.cancel();
  }

  testProps() {
    Promise.props({
      a: 1,
      b: 2,
      c: 3,
    }).then((result) => {
      console.log(result);
    });
  }

  testUnHandled() {
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('aaaa'));
      }, 5000);
    }).then((res) => {
      console.log('then ', res);
    });
  }

  render() {
    return (
      <View>
        <Button
          title="test1"
          onPress={this.test1}/>
        <Button
          title="testCancel"
          onPress={this.testCancel}/>
        <Button
          title="testProps"
          onPress={this.testProps}/>
        <Button
          title="testUnHandled"
          onPress={this.testUnHandled}/>
      </View>
    );
  }
}

export var framework = 'React';
export var title = 'Promise';
export var description = 'Promise';
export var examples = [{
  title: 'Promise Example',
  render() {
    return <Example/>;
  }
}];

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 5,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#eeeeee',
    padding: 8,
  },
});
