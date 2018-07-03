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
  ActivityIndicator,
  RWConfig,
} from 'react-native';

// import TestImage from './Image';
import imgTest from './img/test.png';
import imgTest1 from './img/test1.png';

console.log('imgTest', imgTest);
console.log('imgTest1', imgTest1);

let SHOW_TOUCH_EVENT = false;

class Hello extends Component {

  constructor() {
    super();

    this.state = {
      flag1: false,
    };
  }

  render() {
    return this._renderTouch();
    //return this._renderScrollTouch();
    //return this._renderOverlap();
    //return this._renderRNWImage();
    // return this._renderFlex();
  }

  _renderFlex() {
    return (
      <View style={{flex: 1}}>
        <View style={{backgroundColor: '#4caf50',}}>
          <View style={{flexGrow: 1,}}><Text>xxxxx</Text></View>
        </View>
      </View>
    );
  }

  _renderRNWImage() {

    return (
      <View style={{padding: 10,}}>
        {/* <TestImage
          source={{uri: 'http://desk.fd.zol-img.com.cn/t_s960x600c5/g5/M00/00/0A/ChMkJ1ecZb2IQdT8AATJRtrzV70AAT_1gNHoPkABMle872.jpg'}}
          resizeMode="cover"
          style={{width: 300,}}>
          <Text>xxxxx</Text>
        </TestImage> */}

        <Image
          defaultSource={img_test}
          source={{uri: 'http://desk.fd.zol-img.com.cn/t_s960x600c5/g5/M00/00/0A/ChMkJ1ecZb2IQdT8AATJRtrzV70AAT_1gNHoPkABMle872.jpg?xx1234'}}
          resizeMode="center"
          // onLoadStart={() => {
          //   console.log('onLoadStart');
          // }}
          // onLoad={() => {
          //   console.log('onLoad');
          // }}
          // onError={() => {
          //   console.log('onError');
          // }}
          // onLoadEnd={() => {
          //   console.log('onLoadEnd');
          // }}
          responsive={true}
          style={{width: 300,}}>
          <Text>xxxxxxx</Text>
        </Image>

        {/* <img src="http://7xlydk.com1.z0.glb.clouddn.com/1475222643404?imageView2/1/w/1896/h/162&2"/>
        <img src="http://7xlydk.com1.z0.glb.clouddn.com/1475222832085?imageView2/1/w/1896/h/162&2"/>
        <img src="http://7xlydk.com1.z0.glb.clouddn.com/1475223508558?imageView2/1/w/1896/h/162&2"/>
        <img src="http://7xlydk.com1.z0.glb.clouddn.com/1475223553129?imageView2/1/w/1896/h/162&2"/>
        <img src="http://7xlydk.com1.z0.glb.clouddn.com/1475222643404?imageView2/1/w/1896/h/163&2"/>
        <img src="http://7xlydk.com1.z0.glb.clouddn.com/1475222832085?imageView2/1/w/1896/h/163&2"/>
        <img src="http://7xlydk.com1.z0.glb.clouddn.com/1475223508558?imageView2/1/w/1896/h/163&2"/>
        <img src="http://7xlydk.com1.z0.glb.clouddn.com/1475223553129?imageView2/1/w/1896/h/163&2"/>
        <img src="http://7xlydk.com1.z0.glb.clouddn.com/1475222643404?imageView2/1/w/1896/h/164&2"/>
        <img src="http://7xlydk.com1.z0.glb.clouddn.com/1475222832085?imageView2/1/w/1896/h/164&2"/>
        <img src="http://7xlydk.com1.z0.glb.clouddn.com/1475223508558?imageView2/1/w/1896/h/164&2"/>
        <img src="http://7xlydk.com1.z0.glb.clouddn.com/1475223553129?imageView2/1/w/1896/h/164&2"/>
        <img src="http://7xlydk.com1.z0.glb.clouddn.com/1475222643404?imageView2/1/w/1896/h/164&2"/>
        <img src="http://7xlydk.com1.z0.glb.clouddn.com/1475222832085?imageView2/1/w/1896/h/164&2"/>
        <img src="http://7xlydk.com1.z0.glb.clouddn.com/1475223508558?imageView2/1/w/1896/h/164&2"/>
        <img src="http://7xlydk.com1.z0.glb.clouddn.com/1475223553129?imageView2/1/w/1896/h/164&2"/> */}
      </View>
    );
  }

  // 测试视图叠加之后连点用
  _renderOverlap() {
    return (
      <View style={{flex: 1,}}>
        {this._renderTouch(1, StyleSheet.absoluteFill)}
        {this.state.flag1 && this._renderTouch(2, StyleSheet.absoluteFill)}
      </View>
    );
  }

  _renderTouch(id, style, onPress) {
    return (
      <View style={[styles.container, style]}>
        <View
          onStartShouldSetResponderCapture={(e) => {
            console.log('onStartShouldSetResponderCapture id', id, e.type, SHOW_TOUCH_EVENT && e);
            //return true;
          }}
          onMoveShouldSetResponderCapture={(e) => {
            console.log('onMoveShouldSetResponderCapture id', id, e.type, SHOW_TOUCH_EVENT && e);
            //return true;
          }}
          onStartShouldSetResponder={(e) => {
            console.log('onStartShouldSetResponder id', id, e.type, SHOW_TOUCH_EVENT && e);
            //return false;
            return true;
          }}
          onMoveShouldSetResponder={(e) => {
            console.log('onMoveShouldSetResponder id', id, e.type, SHOW_TOUCH_EVENT && e);
            //return false;
            return true;
          }}
          onResponderGrant={(e) => {
            console.log('onResponderGrant id', id, e.type, SHOW_TOUCH_EVENT && e);
          }}
          onResponderMove={(e) => {
            console.log('onResponderMove id', id, e.type, SHOW_TOUCH_EVENT && e);
            //e.nativeEvent.preventDefault();
          }}
          onResponderReject={(e) => {
            console.log('onResponderReject id', id, e.type, SHOW_TOUCH_EVENT && e);
          }}
          onResponderRelease={(e) => {
            console.log('onResponderRelease id', id, e.type, SHOW_TOUCH_EVENT && e);
          }}
          onResponderTerminate={(e) => {
            console.log('onResponderTerminate id', id, e.type, SHOW_TOUCH_EVENT && e);
          }}
          onResponderTerminationRequest={(e) => {
            console.log('onResponderTerminationRequest id', id, e.type, SHOW_TOUCH_EVENT && e);
            return true;
            //return false;
          }}

          onTouchMove={(e) => {
            console.log('onTouchMove id', id, e.type, SHOW_TOUCH_EVENT && e);
            //android 4.4.4之前 touchmove bug
            //http://wilsonpage.co.uk/touch-events-in-chrome-android/
            //e.preventDefault();
          }}
          onTouchStart={(e) => {
            console.log('onTouchStart id', id, e.type, SHOW_TOUCH_EVENT && e);
          }}
          onTouchCancel={(e) => {
            console.log('onTouchCancel id', id, e.type, SHOW_TOUCH_EVENT && e);
          }}
          onTouchEnd={(e) => {
            console.log('onTouchEnd id', id, e.type, SHOW_TOUCH_EVENT && e);
          }}

          onMouseDown={(e) => {
            console.log('onMouseDown id', id, e.type, SHOW_TOUCH_EVENT && e);
          }}
          onMouseMove={(e) => {
            console.log('onMouseMove id', id, e.type, SHOW_TOUCH_EVENT && e);
          }}
          onMouseUp={(e) => {
            console.log('onMouseUp id', id, e.type, SHOW_TOUCH_EVENT && e);
          }}

          onClick={(e) => {
            console.log('onClick id', id, e.type);
          }}
          style={{width: 300, height: 200, backgroundColor: '#16C3F4'}}>

          <TouchableOpacity
            onPress={(e) => {
              console.log('TouchableOpacity onPress id', id, e.type);
              //e.preventDefault();
              this.setState({
                flag1: true,
              });

            }}
            onPressIn={(e) => {
              console.log('TouchableOpacity onPressIn id', id, e.type);
            }}
            onPressOut={(e) => {
              console.log('TouchableOpacity onPressOut id', id, e.type);
            }}
            style={{padding: 20, backgroundColor: '#E6AEC2'}}>
            <Text>TouchableOpacity {id}</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }

  // 测试Scroll 与横向scroll 嵌套
  _renderScroll() {
    return (
      <View style={{flex: 1,}}>
        <ScrollView id="h1" horizontal={true} showsHorizontalScrollIndicator={true} style={{flex: null}} contentContainerStyle={{display: 'inlineFlex'}}>
          <TouchableOpacity>
          <View style={{width: 200, height: 60, backgroundColor: '#6FFCAF'}}></View>
          </TouchableOpacity><TouchableOpacity>
          <View style={{width: 200, height: 60, backgroundColor: '#6F86FC'}}></View>
          </TouchableOpacity><TouchableOpacity>
          <View style={{width: 200, height: 60, backgroundColor: '#C184AE'}}></View>
          </TouchableOpacity>
        </ScrollView>
        <ScrollView id="v1" contentContainerStyle={{alignItems: 'stretch'}}>
          <View style={{height: 200}}></View>
          <ScrollView id="h2" horizontal={true} showsHorizontalScrollIndicator={true} style={{flex: null}} contentContainerStyle={{}}>
            <TouchableOpacity>
            <View style={{width: 200, height: 60, backgroundColor: '#6FFCAF'}}></View>
            </TouchableOpacity><TouchableOpacity>
            <View style={{width: 200, height: 60, backgroundColor: '#6F86FC'}}></View>
            </TouchableOpacity><TouchableOpacity>
            <View style={{width: 200, height: 60, backgroundColor: '#C184AE'}}></View>
            </TouchableOpacity>
          </ScrollView>
          <ScrollView id="h3" horizontal={true} showsHorizontalScrollIndicator={true} style={{flex: null}} contentContainerStyle={{}}>
            <View style={{width: 200, height: 60, backgroundColor: '#6FFCAF'}}></View>
            <View style={{width: 200, height: 60, backgroundColor: '#6F86FC'}}></View>
            <View style={{width: 200, height: 60, backgroundColor: '#C184AE'}}></View>
          </ScrollView>
          {/*<ScrollView style={{flex: 1, alignSelf: 'stretch',}}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  console.log('TouchableOpacity onPress');
                }}
                onPressIn={() => {
                  console.log('TouchableOpacity onPressIn');
                }}
                onPressOut={() => {
                  console.log('TouchableOpacity onPressOut');
                }}
                style={{padding: 20, backgroundColor: '#E6AEC2'}}>
                <Text>TouchableOpacity</Text>
              </TouchableOpacity>
              <Text style={styles.welcome}>
                Welcome to React Native!
              </Text>
              <Text style={styles.instructions}>
                To get started, edit index.android.js
              </Text>
              <Text style={styles.instructions}>
                Shake or press menu button for dev menu
              </Text>
              <Image
                source={require('./img/test.png')}
                style={{width: 100, height: 100}}
              />
              <Image
                source={{uri: 'http://img.61gequ.com/allimg/2011-4/201142614314278502.jpg'}}
                style={{width: 100, height: 100}}
              />
              <Text style={styles.instructions}>xxx
                <Image
                  source={{uri: 'http://img.61gequ.com/allimg/2011-4/201142614314278502.jpg'}}
                  style={{width: 50, height: 50}}
                />aaa
              </Text>
              <TextInput multiline={true} style={{width: 200, height: 40}}/>
              <View style={{width: 100, height: 500}}></View>
            </View>
          </ScrollView>*/}
          <View onClick={() => {console.log('onClick');}} style={{width: 150, height: 500, backgroundColor: '#D79B85'}}></View>
          {/*<TouchableOpacity
            onPress={() => {
              console.log('TouchableOpacity onPress');
            }}
            onPressIn={() => {
              console.log('TouchableOpacity onPressIn');
            }}
            onPressOut={() => {
              console.log('TouchableOpacity onPressOut');
            }}
            style={{padding: 20, backgroundColor: '#E6AEC2', margin: 20, alignSelf: 'stretch'}}>
            <Text>TouchableOpacity</Text>
          </TouchableOpacity>*/}
          </ScrollView>
      </View>
    );
  }

  // 测试scroll 滚动之后下一次touch的bug
  _renderScrollTouch() {
    // return (
    //   <div style={{
    //     overflow: 'scroll',
    //     flex: 1,
    //   }}>
    //     <View style={{}}>
    //       <TouchableOpacity
    //         onPress={() => {
    //           console.log('touch1 onPress');
    //         }}
    //         style={{padding: 5, backgroundColor: '#D4D4D4', marginBottom: 400,}}>
    //         <Text>touch1</Text>
    //       </TouchableOpacity>
    //       <TouchableOpacity
    //         onPress={() => {
    //           console.log('touch2 onPress');
    //         }}
    //         style={{padding: 5, backgroundColor: '#D4D4D4', marginBottom: 500,}}>
    //         <Text>touch2</Text>
    //       </TouchableOpacity>
    //     </View>
    //   </div>
    // );

    return (
      <View style={{flex: 1,}}>
        <ScrollView style={{flex: 1,}}>
          <TouchableOpacity
            onPress={() => {
              console.log('touch1 onPress');
            }}
            style={{padding: 5, backgroundColor: '#D4D4D4', marginBottom: 400,}}>
            <Text>touch1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              console.log('touch2 onPress');
            }}
            style={{padding: 5, backgroundColor: '#D4D4D4', marginBottom: 400,}}>
            <Text>touch2</Text>
          </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity
          onPress={() => {
            console.log('touch3 onPress');
          }}
          style={{padding: 5, backgroundColor: '#D4D4D4'}}>
          <Text>touch3</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Hello', () => Hello);

AppRegistry.runApplication('Hello');
