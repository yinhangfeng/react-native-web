/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

 import React, {
   Component,
 } from 'react';

import ReactNative, {
  AppRegistry,
  StyleSheet,
  Platform,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  ListView,
  TouchableOpacity,
  HistoryNavigator,
} from 'react-native';

import createBrowserHistory from 'history/lib/createBrowserHistory';

const COLORS = [
  '#7C1577',
  '#4680E4',
  '#541F2D',
  '#5052FC',
  '#F9CBE9',
];

class App extends Component {

  constructor() {
    super();
    this._history = createBrowserHistory();

    let currentLocation = this._history.getCurrentLocation();
    console.log('init currentLocation:', currentLocation);

    this._initRoute = this._locationToRoute(currentLocation) || {
      url: 'INIT',
    };

    this._routeToLocation = this._routeToLocation.bind(this);
    this._locationToRoute = this._locationToRoute.bind(this);
    this._renderScene = this._renderScene.bind(this);
  }

  _routeToLocation(route) {
    return {
      pathname: '/Examples',
      hash: '#base/' + route.url,
    };
  }

  _locationToRoute(location) {
    if (location.hash.startsWith('#base')) {
      return {
        url: location.hash.slice(6),
      };
    }
  }

  _renderScene(route, navigator) {
    console.log('_renderScene ', route);
    return (
      <Scene1 route={route} navigator={navigator}/>
    );
  }

  render() {
    return (
      <HistoryNavigator
        ref={(ref) => {
          this._navigator = ref;
          window.HistoryNavigator = ref;
        }}
        history={this._history}
        initialRoute={this._initRoute}
        routeToLocation={this._routeToLocation}
        locationToRoute={this._locationToRoute}
        renderScene={this._renderScene}
        />
    );
  }
}

class Scene1 extends Component {
  constructor(props) {
    super(props);

    this._color = COLORS[(Math.random() * COLORS.length) << 0];
    this._randomHeight = Math.random() > 0.5 ? 0 : 41;

    let navigator = props.navigator;

    this._tests = [
      {
        name: 'push',
        func: () => {
          navigator.push({
            url: 'push' + Date.now(),
          });
        },
      }, {
        name: 'pop',
        func: () => {
          navigator.pop();
        },
      }, {
        name: 'popN',
        func: () => {
          navigator.popN(3);
        },
      }, {
        name: 'replaceAtIndex',
        func: () => {
          let index = (navigator.getCurrentRoutes().length * Math.random()) << 0;
          console.log('replaceAtIndex index:', index);
          navigator.replaceAtIndex({
            url: 'replaceAtIndex' + Date.now(),
          }, index);
        },
      }, {
        name: 'immediatelyResetRouteStack',
        func: () => {
          navigator.immediatelyResetRouteStack([{
            url: 'immediatelyResetRouteStack_' + Math.random(),
          }, {
            url: 'immediatelyResetRouteStack_' + Math.random(),
          }]);
        },
      }, {
        name: 'jumpForward',
        func: () => {
          navigator.jumpForward();
        },
      }, {
        name: 'jumpBack ',
        func: () => {
          navigator.jumpBack();
        },
      }, {
        name: 'jumpTo',
        func: () => {
          let n = Math.round(Math.random() * 7 - 3);
          console.log('jumpTo n:', n);
          navigator.jumpTo(n);
        },
      }, {
        name: 'replace',
        func: () => {
          navigator.replace({
            url: 'replace_' + Date.now(),
          });
        },
      }, {
        name: 'popToTop',
        func: () => {
          navigator.popToTop();
        },
      }, {
        name: 'replacePreviousAndPop',
        func: () => {
          navigator.replacePreviousAndPop({
            url: 'replacePreviousAndPop_' + Date.now(),
          });
        },
      }, {
        name: 'resetTo',
        func: () => {
          navigator.resetTo({
            url: 'resetTo_' + Date.now(),
          });
        },
      },
    ];
  }

  _renderButton(text, onPress, key) {
    return (
      <TouchableOpacity
        key={key}
        onPress={onPress}
        style={{padding: 5, backgroundColor: 'rgba(0, 0, 0, 0.21)', marginBottom: 10,}}>
        <Text style={{fontSize: 18,}}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    let navigator = this.props.navigator;
    return (
      <View
        style={{
          width: '100%',
          height: 1500,
        }}>
        <View style={{
          height: 300 + this._randomHeight,
          backgroundColor: this._color,
          justifyContent: 'center',
        }}>
          <Text style={{fontSize: 22,}}>{JSON.stringify(this.props.route)}  routeID:{this.props.route.__navigatorRouteID}</Text>
        </View>
        {this._tests.map((test, i) => {
          return this._renderButton(test.name, test.func, i);
        })}
        {this._renderButton('xxx', () => {
          for (let i = 0; i < 10; ++i) {
            this._tests[0].func();
          }
          for (let i = 0; i < 10; ++i) {
            try {
              this._tests[(Math.random() * this._tests.length) << 0].func();
            } catch(e) {
              console.error(e);
            }
          }
        })}
        <div style={{fontSize: 30, width: 30, wordBreak: 'break-all',}}>
          01234567890123456789012345678901234567890
        </div>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});

AppRegistry.registerComponent('HisNavTestApp', () => App);

AppRegistry.runApplication('HisNavTestApp');
