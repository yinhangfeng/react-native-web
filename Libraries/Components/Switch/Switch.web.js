/**
 * @providesModule Switch
 */
'use strict';

const ColorPropType = require('ColorPropType');
const NativeMethodsMixin = require('NativeMethodsMixin');
const React = require('React');
const StyleSheet = require('StyleSheet');
const View = require('View');
const Toggle = __requireDefault(require('material-ui/src/Toggle'));

const Switch = React.createClass({
  propTypes: {
    ...View.propTypes,
    /**
     * The value of the switch.  If true the switch will be turned on.
     * Default value is false.
     */
    value: React.PropTypes.bool,
    /**
     * If true the user won't be able to toggle the switch.
     * Default value is false.
     */
    disabled: React.PropTypes.bool,
    /**
     * Invoked with the new value when the value changes.
     */
    onValueChange: React.PropTypes.func,
    /**
     * Used to locate this view in end-to-end tests.
     */
    testID: React.PropTypes.string,

    /**
     * Background color when the switch is turned off.
     * @platform ios
     */
    tintColor: ColorPropType,
    /**
     * Background color when the switch is turned on.
     * @platform ios
     */
    onTintColor: ColorPropType,
    /**
     * Color of the foreground switch grip.
     * @platform ios
     */
    thumbTintColor: ColorPropType,
  },

  getDefaultProps: function(): DefaultProps {
    return {
      value: false,
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

// const styles = StyleSheet.create({
//
// });

module.exports = Switch;
