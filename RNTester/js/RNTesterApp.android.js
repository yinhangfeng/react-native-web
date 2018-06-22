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

const AppRegistry = require('react-native/Libraries/ReactNative/AppRegistry');
const AsyncStorage = require('react-native/Libraries/Storage/AsyncStorage');
const BackHandler = require('react-native/Libraries/Utilities/BackHandler');
const Dimensions = require('react-native/Libraries/Utilities/Dimensions');
const DrawerLayoutAndroid = require('react-native/Libraries/Components/DrawerAndroid/DrawerLayoutAndroid');
const Linking = require('react-native/Libraries/Linking/Linking');
const React = require('react');
const StatusBar = require('react-native/Libraries/Components/StatusBar/StatusBar');
const StyleSheet = require('react-native/Libraries/StyleSheet/StyleSheet');
const ToolbarAndroid = require('react-native/Libraries/Components/ToolbarAndroid/ToolbarAndroid');
const RNTesterActions = require('./RNTesterActions');
const RNTesterExampleContainer = require('./RNTesterExampleContainer');
const RNTesterExampleList = require('./RNTesterExampleList');
const RNTesterList = require('./RNTesterList');
const RNTesterNavigationReducer = require('./RNTesterNavigationReducer');
const UIManager = require('react-native/Libraries/ReactNative/UIManager');
const URIActionMap = require('./URIActionMap');
const View = require('react-native/Libraries/Components/View/View');

const nativeImageSource = require('react-native/Libraries/Image/nativeImageSource');

import type {RNTesterNavigationState} from './RNTesterNavigationReducer';

UIManager.setLayoutAnimationEnabledExperimental(true);

const DRAWER_WIDTH_LEFT = 56;

type Props = {
  exampleFromAppetizeParams: string,
};

const APP_STATE_KEY = 'RNTesterAppState.v2';

const HEADER_LOGO_ICON = nativeImageSource({
  android: 'launcher_icon',
  width: 132,
  height: 144,
});

const HEADER_NAV_ICON = nativeImageSource({
  android: 'ic_menu_black_24dp',
  width: 48,
  height: 48,
});

class RNTesterApp extends React.Component<Props, RNTesterNavigationState> {
  UNSAFE_componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this._handleBackButtonPress,
    );
  }

  componentDidMount() {
    Linking.getInitialURL().then(url => {
      AsyncStorage.getItem(APP_STATE_KEY, (err, storedString) => {
        const exampleAction = URIActionMap(
          this.props.exampleFromAppetizeParams,
        );
        const urlAction = URIActionMap(url);
        const launchAction = exampleAction || urlAction;
        if (err || !storedString) {
          const initialAction = launchAction || {type: 'InitialAction'};
          this.setState(RNTesterNavigationReducer(null, initialAction));
          return;
        }
        const storedState = JSON.parse(storedString);
        if (launchAction) {
          this.setState(RNTesterNavigationReducer(storedState, launchAction));
          return;
        }
        this.setState(storedState);
      });
    });
  }

  render() {
    if (!this.state) {
      return null;
    }
    return (
      <DrawerLayoutAndroid
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        drawerWidth={Dimensions.get('window').width - DRAWER_WIDTH_LEFT}
        keyboardDismissMode="on-drag"
        onDrawerOpen={() => {
          this._overrideBackPressForDrawerLayout = true;
        }}
        onDrawerClose={() => {
          this._overrideBackPressForDrawerLayout = false;
        }}
        ref={drawer => {
          this.drawer = drawer;
        }}
        renderNavigationView={this._renderDrawerContent}
        statusBarBackgroundColor="#589c90">
        {this._renderApp()}
      </DrawerLayoutAndroid>
    );
  }

  _renderDrawerContent = () => {
    return (
      <View style={styles.drawerContentWrapper}>
        <RNTesterExampleList
          list={RNTesterList}
          displayTitleRow={true}
          disableSearch={true}
          onNavigate={this._handleAction}
        />
      </View>
    );
  };

  _renderApp() {
    const {openExample} = this.state;

    if (openExample) {
      const ExampleModule = RNTesterList.Modules[openExample];
      if (ExampleModule.external) {
        return (
          <ExampleModule
            onExampleExit={() => {
              this._handleAction(RNTesterActions.Back());
            }}
            ref={example => {
              this._exampleRef = example;
            }}
          />
        );
      } else if (ExampleModule) {
        return (
          <View style={styles.container}>
            <ToolbarAndroid
              logo={HEADER_LOGO_ICON}
              navIcon={HEADER_NAV_ICON}
              onIconClicked={() => this.drawer.openDrawer()}
              style={styles.toolbar}
              title={ExampleModule.title}
            />
            <RNTesterExampleContainer
              module={ExampleModule}
              ref={example => {
                this._exampleRef = example;
              }}
            />
          </View>
        );
      }
    }

    return (
      <View style={styles.container}>
        <ToolbarAndroid
          logo={HEADER_LOGO_ICON}
          navIcon={HEADER_NAV_ICON}
          onIconClicked={() => this.drawer.openDrawer()}
          style={styles.toolbar}
          title="RNTester"
        />
        <RNTesterExampleList
          onNavigate={this._handleAction}
          list={RNTesterList}
        />
      </View>
    );
  }

  _handleAction = (action: Object): boolean => {
    this.drawer && this.drawer.closeDrawer();
    const newState = RNTesterNavigationReducer(this.state, action);
    if (this.state !== newState) {
      this.setState(newState, () =>
        AsyncStorage.setItem(APP_STATE_KEY, JSON.stringify(this.state)),
      );
      return true;
    }
    return false;
  };

  _handleBackButtonPress = () => {
    if (this._overrideBackPressForDrawerLayout) {
      // This hack is necessary because drawer layout provides an imperative API
      // with open and close methods. This code would be cleaner if the drawer
      // layout provided an `isOpen` prop and allowed us to pass a `onDrawerClose` handler.
      this.drawer && this.drawer.closeDrawer();
      return true;
    }
    if (
      this._exampleRef &&
      this._exampleRef.handleBackAction &&
      this._exampleRef.handleBackAction()
    ) {
      return true;
    }
    return this._handleAction(RNTesterActions.Back());
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    backgroundColor: '#E9EAED',
    height: 56,
  },
  drawerContentWrapper: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: 'white',
  },
});

AppRegistry.registerComponent('RNTesterApp', () => RNTesterApp);

// 测试OPPO手机键盘弹出bug
// const {
//   Text,
//   TextInput,
// } = require('react-native');
// class TextInputTest extends React.Component {
//
//   constructor(props) {
//     super(props);
//
//     this.state = {
//       show: true,
//     };
//   }
//
//   render() {
//     return (
//       <View style={{paddingTop: 40,}}>
//         <Text onPress={() => {
//           this.setState({
//             show: !this.state.show,
//           });
//         }} style={{fontSize: 24,}}>toggle show</Text>
//         <TextInput style={{height: 50, backgroundColor: '#E4FFD6', marginBottom: 10}}/>
//         {this.state.show ? <TextInput style={{height: 50, backgroundColor: '#E4FFD6', marginBottom: 10}}/> : null}
//       </View>
//     );
//   }
// }
// AppRegistry.registerComponent('RNTesterApp', () => TextInputTest);

module.exports = RNTesterApp;
