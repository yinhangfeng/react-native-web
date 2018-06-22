/**
 * RW SYNC react-native: 0.49
 */
'use strict';

const ColorPropType = require('react-native/Libraries/StyleSheet/ColorPropType');
const NativeMethodsMixin = require('react-native/Libraries/Renderer/shims/NativeMethodsMixin');
const React = require('react-native/Libraries/react-native/React');
const PropTypes = require('prop-types');
const StyleSheet = require('react-native/Libraries/StyleSheet/StyleSheet');
const View = require('react-native/Libraries/Components/View/View');
const ViewPropTypes = require('react-native/Libraries/Components/View/ViewPropTypes');

const createReactClass = require('create-react-class');

const CircularProgress = __requireDefault(require('material-ui/src/CircularProgress'));
const Image = require('react-native/Libraries/Image/Image');
const RWPerformance = require('react-native/Libraries/lrnw/RWPerformance');

/**
 * Displays a circular loading indicator.
 */
const ActivityIndicator = createReactClass({
  mixins: [NativeMethodsMixin],

  propTypes: {
    ...ViewPropTypes,
    /**
     * Whether to show the indicator (true, the default) or hide it (false).
     */
    animating: PropTypes.bool,
    /**
     * The foreground color of the spinner (default is gray).
     */
    color: ColorPropType,
    /**
     * Size of the indicator (default is 'small').
     * Passing a number to the size prop is only supported on Android.
     */
    size: PropTypes.oneOfType([
      PropTypes.oneOf([ 'small', 'large' ]),
      PropTypes.number,
    ]),
    /**
     * Whether the indicator should hide when not animating (true by default).
     *
     * @platform ios
     */
    hidesWhenStopped: PropTypes.bool,
  },

  getDefaultProps(): DefaultProps {
    return {
      animating: true,
      hidesWhenStopped: true,
      size: 'small',
    };
  },

  render() {
    let {size, color, ...props} = this.props;

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
          color={color}/>
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
      <View
        {...props}
        style={[styles.container, props.style]}>
        {progress}
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

module.exports = ActivityIndicator;
