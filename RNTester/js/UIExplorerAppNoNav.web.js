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
 * @providesModule UIExplorerAppNoNav
 * @flow
 */
'use strict';

const React = require('react');
const ReactNative = require('react-native');
const UIExplorerList = require('./UIExplorerList');
const UIExplorerExampleContainer = require('./UIExplorerExampleContainer');

const {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ListView,
  TouchableHighlight,
  TouchableWithoutFeedback,
} = ReactNative;

const xxxxx = require('xxxxx');

class UIExplorerApp extends React.Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      exampleKey: null,
    };

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (h1, h2) => h1 !== h2,
    });

    this.exampleDataSource = ds.cloneWithRowsAndSections({
      components: UIExplorerList.ComponentExamples,
      apis: UIExplorerList.APIExamples,
    });
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  _renderTest() {
    // return (
    //   <TouchableHighlight
    //     onPress={() => {console.log('onPress');}}
    //     style={[{backgroundColor: '#A8EBA0'}]}>
    //     <Text style={{fontSize: 30}}>xxxxxxxx</Text>
    //   </TouchableHighlight>
    // );
    // return (
    //   <View
    //     onStartShouldSetResponder={(e) => {console.log('onStartShouldSetResponder', e)}}
    //     onResponderTerminationRequest={(e) => {console.log('onResponderTerminationRequest', e)}}
    //     onResponderGrant={(e) => {console.log('onResponderGrant', e)}}
    //     onResponderMove={(e) => {console.log('onResponderMove', e)}}
    //     onResponderRelease={(e) => {console.log('onResponderRelease', e)}}
    //     onResponderTerminate={(e) => {console.log('onResponderTerminate', e)}}
    //     style={{width: 200, height: 200, backgroundColor: '#F9959B'}}>
    //
    //   </View>
    // );
    // return (
    //   <TouchableWithoutFeedback onPress={(e) => {
    //     console.log('xxxxx ', e);
    //   }}>
    //     <View style={styles.row}>
    //       <Text style={styles.rowTitleText}>
    //         {'xxxx'}
    //       </Text>
    //       <Text style={styles.rowDetailText}>
    //         {'xxxxx'}
    //       </Text>
    //     </View>
    //   </TouchableWithoutFeedback>
    // );
  }

  render() {
    //return this._renderTest();
    return (
      <View style={{flex: 1}}>
        <View
          className={this.state.exampleKey && 'lrnw-hide'}
          style={{flex: 1}}>
          <View style={{padding: 10, justifyContent: 'center', alignItems: 'center'}}>
            <Text>UIExplorerApp</Text>
          </View>
          <ListView
            style={{
              flex: 1,
              backgroundColor: '#eeeeee',
            }}
            showsHorizontalScrollIndicator={true}
            showsVerticalScrollIndicator={false}
            dataSource={this.exampleDataSource}
            renderRow={this._renderExampleRow.bind(this)}
            renderSectionHeader={this._renderSectionHeader}
            keyboardShouldPersistTaps={true}
            automaticallyAdjustContentInsets={false}
            keyboardDismissMode="on-drag"
          />
        </View>
        {this.state.exampleKey && this._renderExample()}
      </View>
    );
  }

  _renderSectionHeader(data: any, section: string): ?ReactElement {
    return (
      <Text style={styles.sectionHeader}>
        {section.toUpperCase()}
      </Text>
    );
  }

  _renderExampleRow(example: {key: string, module: Object}): ?ReactElement {
    return this._renderRow(
      example.module.title,
      example.module.description,
      example.key,
      () => this._handleRowPress(example.key)
    );
  }

  _renderRow(title: string, description: string, key: ?string, handler: ?Function): ?ReactElement {
    return (
      <View key={key || title}>
        <TouchableHighlight onPress={handler}>
          <View style={styles.row}>
            <Text style={styles.rowTitleText}>
              {title}
            </Text>
            <Text style={styles.rowDetailText}>
              {description}
            </Text>
          </View>
        </TouchableHighlight>
        <View style={styles.separator} />
      </View>
    );
  }

  _handleRowPress(exampleKey: string): void {
    console.log('_handleRowPress ', exampleKey);
    this.setState({
      exampleKey,
    });
  }

  _renderExample() {
    const ExampleModule = UIExplorerList.Modules[this.state.exampleKey];
    let exampleEle = null;
    if (ExampleModule) {
      exampleEle = (
        <UIExplorerExampleContainer
          module={ExampleModule}
          ref={(example) => { this._exampleRef = example; }}
        />
      );
    }
    return (
      <View style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: '#F5F5F5'}}>
        <View style={{height: 48, flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => {
            this.setState({
              exampleKey: null,
            });
          }} style={{alignSelf: 'stretch', padding: 5, justifyContent: 'center', alignItems: 'center'}}><Text style={{fontSize: 16, alignSelf: 'center'}}>back</Text></TouchableOpacity>
          <Text style={{fontSize: 16, alignSelf: 'center', marginLeft: 20}}>{ExampleModule ? ExampleModule.title : 'Unknown'}</Text>
        </View>
        {exampleEle}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  list: {
    backgroundColor: '#eeeeee',
  },
  sectionHeader: {
    padding: 5,
    fontWeight: '500',
    fontSize: 11,
  },
  group: {
    backgroundColor: 'white',
  },
  row: {
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#bbbbbb',
    marginLeft: 15,
  },
  rowTitleText: {
    fontSize: 17,
    fontWeight: '500',
  },
  rowDetailText: {
    fontSize: 15,
    color: '#888888',
    lineHeight: 20,
  },
  searchRow: {
    backgroundColor: '#eeeeee',
    padding: 10,
  },
  searchTextInput: {
    backgroundColor: 'white',
    borderColor: '#cccccc',
    borderRadius: 3,
    borderWidth: 1,
    paddingLeft: 8,
    height: 35,
  },
});

AppRegistry.registerComponent('UIExplorerApp', () => UIExplorerApp);

module.exports = UIExplorerApp;
