/**
 * RW SYNC react-native: 0.56
 */

'use strict';

const React = require('react');
const StyleSheet = require('react-native/Libraries/StyleSheet/StyleSheet');
const View = require('react-native/Libraries/Components/View/View');
const RWPerformance = require('react-native/Libraries/lrnw/RWPerformance');
const CircularProgress = require('@material-ui/core/CircularProgress').default;

class ActivityIndicator extends React.Component {

  static defaultProps = {
    // TODO
    animating: true,
    hidesWhenStopped: true,
    size: 'small',
  };

  render() {
    let {onLayout, size, color, style} = this.props;

    switch (size) {
      case 'small':
        size = 20;
        break;
      case 'large':
        size = 36;
        break;
    }

    let progress;
    if (RWPerformance.level > RWPerformance.MEDIUM) {
      progress = (
        <CircularProgress
          size={size}
          style={color ? { color, } : undefined}/>
      );
    } else {
      progress = (
        <Image
          source={require('./loading.gif')}
          resizeMode="stretch"
          style={{width: size, height: size,}}/>
      );
    }

    return (
      <View onLayout={onLayout} style={[styles.container, style]}>
        {progress}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

module.exports = ActivityIndicator;
