/**
 * RW SYNC react-native: 0.56
 */
'use strict';

const React = require('react');
const StyleSheet = require('react-native/Libraries/StyleSheet/StyleSheet');
const View = require('react-native/Libraries/Components/View/View');
const MUISwitch = require('@material-ui/core/Switch').default;

class Switch extends React.Component {

  static defaultProps = {
    value: false,
    disabled: false,
  };

  _onChange(event, value) {
    if (this.props.onChange) {
      event.nativeEvent = {
        value,
      };
      this.props.onChange(event);
    }
    this.props.onValueChange && this.props.onValueChange(value);
  }

  render() {
    const props = this.props;
    return (
      <View style={props.style}>
        <MUISwitch
          checked={props.value}
          disabled={props.disabled}
          onChange={this._onChange}
        />
      </View>
    );
  }
}

module.exports = Switch;
