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

export type UIExplorerExample = {
  key: string;
  module: Object;
};

var ComponentExamples: Array<UIExplorerExample> = [
  {
    key: 'ActivityIndicatorExample',
    module: require('./ActivityIndicatorExample'),
  },
  {
    key: 'ImageExample',
    module: require('./ImageExample'),
  },
  {
    key: 'LayoutEventsExample',
    module: require('./LayoutEventsExample'),
  },
  {
    key: 'ListViewExample',
    module: require('./ListViewExample'),
  },
  // {
  //   key: 'ModalExample',
  //   module: require('./ModalExample'),
  // },
  // {
  //   key: 'NavigatorExample',
  //   module: require('./Navigator/NavigatorExample'),
  // },
  {
    key: 'PickerExample',
    module: require('./PickerExample'),
  },
  {
    key: 'RefreshControlExample',
    module: require('./RefreshControlExample'),
  },
  {
    key: 'ScrollViewExample',
    module: require('./ScrollViewExample'),
  },
  {
    key: 'ScrollViewSimpleExample',
    module: require('./ScrollViewSimpleExample'),
  },
  // {
  //   key: 'SliderExample',
  //   module: require('./SliderExample'),
  // },
  {
    key: 'SwitchExample',
    module: require('./SwitchExample'),
  },
  {
    key: 'TextExample',
    module: require('./TextExample.web'),
  },
  {
    key: 'TextInputExample',
    module: require('./TextInputExample.web'),
  },
  {
    key: 'TouchableExample',
    module: require('./TouchableExample'),
  },
  {
    key: 'TransparentHitTestExample',
    module: require('./TransparentHitTestExample'),
  },
  {
    key: 'ViewExample',
    module: require('./ViewExample'),
  },
];

var APIExamples: Array<UIExplorerExample> = [
  {
    key: 'AnimatedExample',
    module: require('./AnimatedExample'),
  },
  {
    key: 'AsyncStorageExample',
    module: require('./AsyncStorageExample'),
  },
  {
    key: 'BorderExample',
    module: require('./BorderExample'),
  },
  {
    key: 'BoxShadowExample',
    module: require('./BoxShadowExample'),
  },
  {
    key: 'LayoutExample',
    module: require('./LayoutExample'),
  },
  // {
  //   key: 'NavigationExperimentalExample',
  //   module: require('./NavigationExperimental/NavigationExperimentalExample'),
  // },
  {
    key: 'PanResponderExample',
    module: require('./PanResponderExample'),
  },
  {
    key: 'PointerEventsExample',
    module: require('./PointerEventsExample'),
  },
  {
    key: 'TimerExample',
    module: require('./TimerExample'),
  },
  {
    key: 'XHRExample',
    module: require('./XHRExample'),
  },
  {
    key: 'PromiseExample',
    module: require('./PromiseExample'),
  },
];

const Modules = {};

APIExamples.concat(ComponentExamples).forEach(Example => {
  Modules[Example.key] = Example.module;
});

const UIExplorerList = {
  APIExamples,
  ComponentExamples,
  Modules,
};

module.exports = UIExplorerList;
