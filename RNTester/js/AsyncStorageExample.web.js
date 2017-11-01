/**
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

var React = require('react');
var ReactNative = require('react-native');
var {
  AsyncStorage,
  Text,
  View,
} = ReactNative;
var Button = require('./RNTesterButton');
var createReactClass = require('create-react-class');

var STORAGE_KEY = '@AsyncStorageExample:key';
var COLORS = ['red', 'orange', 'yellow', 'green', 'blue'];

var BasicStorageExample = createReactClass({
  componentDidMount() {
    this._loadInitialState().done();
  },

  async _loadInitialState() {
    try {
      var value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value !== null){
        this.setState({selectedValue: value});
        this._appendMessage('Recovered selection from disk: ' + value);
      } else {
        this._appendMessage('Initialized with no selection on disk.');
      }
    } catch (error) {
      this._appendMessage('AsyncStorage error: ' + error.message);
    }
  },

  getInitialState() {
    return {
      selectedValue: COLORS[0],
      messages: [],
    };
  },

  render() {
    var color = this.state.selectedValue;
    return (
      <View>
        <Text>{' '}</Text>
        <Button onPress={() => {
          this._setValue('123');
        }}>set</Button>
        <Button onPress={this._getValue}>get</Button>
        <Button onPress={this._removeStorage}>remove</Button>
        <Text>{' '}</Text>
        <Text>Messages:</Text>
        {this.state.messages.map((m) => <Text key={m}>{m}</Text>)}
      </View>
    );
  },

  _setValue(selectedValue) {
    // this.setState({selectedValue});
    AsyncStorage.setItem(STORAGE_KEY, selectedValue)
      .then(() => {
        console.log('set success');
      }, (error) => {
        console.log(error);
      });
  },

  async _getValue() {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        console.log('get success', value);
      }, (error) => {
        console.log(error);
      });
  },

  async _removeStorage() {
    AsyncStorage.removeItem(STORAGE_KEY)
      .then(() => {
        console.log('remove success');
      }, (error) => {
        console.log(error);
      });
  },

  _appendMessage(message) {
    console.log(message);
    // this.setState({messages: this.state.messages.concat(message)});
  },
});

exports.title = 'AsyncStorage';
exports.description = 'Asynchronous local disk storage.';
exports.examples = [
  {
    title: 'Basics - getItem, setItem, removeItem',
    render(): ReactElement { return <BasicStorageExample />; }
  },
];
