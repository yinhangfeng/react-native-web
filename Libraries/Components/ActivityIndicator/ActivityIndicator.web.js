/**
 * @providesModule ActivityIndicator
 */
'use strict';

const NativeMethodsMixin = require('NativeMethodsMixin');
const React = require('React');
const StyleSheet = require('StyleSheet');
const View = require('View');
const ColorPropType = require('ColorPropType');
const CircularProgress = __requireDefault(require('material-ui/src/CircularProgress'));
const Image = require('Image');
const RWPerformance = require('RWPerformance');

const PropTypes = React.PropTypes;

/**
 * Displays a circular loading indicator.
 */
const ActivityIndicator = React.createClass({
  mixins: [NativeMethodsMixin],

  propTypes: {
    ...View.propTypes,
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
        size = 40;
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

let styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

module.exports = ActivityIndicator;
