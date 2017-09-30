/**
 * RW SYNC react-native: 0.49
 * @providesModule Switch
 */
'use strict';

const ColorPropType = require('ColorPropType');
const NativeMethodsMixin = require('NativeMethodsMixin');
const React = require('React');
const PropTypes = require('prop-types');
const StyleSheet = require('StyleSheet');
const ViewPropTypes = require('ViewPropTypes');
var createReactClass = require('create-react-class');

const Toggle = __requireDefault(require('material-ui/src/Toggle'));

type DefaultProps = {
  value: boolean,
  disabled: boolean,
};

/**
 * Renders a boolean input.
 *
 * This is a controlled component that requires an `onValueChange` callback that
 * updates the `value` prop in order for the component to reflect user actions.
 * If the `value` prop is not updated, the component will continue to render
 * the supplied `value` prop instead of the expected result of any user actions.
 *
 * @keyword checkbox
 * @keyword toggle
 */
// $FlowFixMe(>=0.41.0)
var Switch = createReactClass({
  displayName: 'Switch',
  propTypes: {
    ...ViewPropTypes,
    /**
     * The value of the switch.  If true the switch will be turned on.
     * Default value is false.
     */
    value: PropTypes.bool,
    /**
     * If true the user won't be able to toggle the switch.
     * Default value is false.
     */
    disabled: PropTypes.bool,
    /**
     * Invoked with the new value when the value changes.
     */
    onValueChange: PropTypes.func,
    /**
     * Used to locate this view in end-to-end tests.
     */
    testID: PropTypes.string,

    /**
     * Border color on iOS and background color on Android when the switch is turned off.
     */
    tintColor: ColorPropType,
    /**
     * Background color when the switch is turned on.
     */
    onTintColor: ColorPropType,
    /**
     * Color of the foreground switch grip.
     */
    thumbTintColor: ColorPropType,
  },

  getDefaultProps: function(): DefaultProps {
    return {
      value: false,
      disabled: false,
    };
  },

  mixins: [NativeMethodsMixin],

  _onChange: function(event, value) {
    if (this.props.onChange) {
      event.nativeEvent = {
        value,
      };
      this.props.onChange(event);
    }
    this.props.onValueChange && this.props.onValueChange(value);
  },

  render: function() {
    const props = this.props;
    return (
      <View style={props.style}>
        <Toggle
          defaultToggled={props.defaultValue}
          toggled={props.value}
          onToggle={this._onChange}
          disabled={props.disabled}/>
      </View>
    );
  }
});

module.exports = Switch;
