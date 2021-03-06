/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

const React = require('react-native/Libraries/react-native/React');
const StyleSheet = require('react-native/Libraries/StyleSheet/StyleSheet');
const Text = require('react-native/Libraries/Text/Text');
const YellowBoxPressable = require('react-native/Libraries/YellowBox/UI/YellowBoxPressable');
const View = require('react-native/Libraries/Components/View/View');
const YellowBoxCategory = require('react-native/Libraries/YellowBox/Data/YellowBoxCategory');
const YellowBoxStyle = require('react-native/Libraries/YellowBox/UI/YellowBoxStyle');
const YellowBoxWarning = require('react-native/Libraries/YellowBox/Data/YellowBoxWarning');

import type {Category} from 'react-native/Libraries/YellowBox/Data/YellowBoxCategory';

type Props = $ReadOnly<{|
  category: Category,
  warnings: $ReadOnlyArray<YellowBoxWarning>,
  onPress: (category: Category) => void,
|}>;

class YellowBoxListRow extends React.Component<Props> {
  static GUTTER = StyleSheet.hairlineWidth;
  static HEIGHT = 48;

  shouldComponentUpdate(nextProps: Props): boolean {
    const prevProps = this.props;
    return (
      prevProps.category !== nextProps.category ||
      prevProps.onPress !== nextProps.onPress ||
      prevProps.warnings.length !== nextProps.warnings.length ||
      prevProps.warnings.some(
        (prevWarning, index) => prevWarning !== nextProps[index],
      )
    );
  }

  render(): React.Node {
    const {warnings} = this.props;

    return (
      <YellowBoxPressable onPress={this._handlePress} style={styles.root}>
        <View style={styles.content}>
          {warnings.length < 2 ? null : (
            <Text style={styles.metaText}>{'(' + warnings.length + ') '}</Text>
          )}
          <Text numberOfLines={2} style={styles.bodyText}>
            {YellowBoxCategory.render(
              warnings[warnings.length - 1].message,
              styles.substitutionText,
            )}
          </Text>
        </View>
      </YellowBoxPressable>
    );
  }

  _handlePress = () => {
    this.props.onPress(this.props.category);
  };
}

const styles = StyleSheet.create({
  root: {
    height: YellowBoxListRow.HEIGHT,
    justifyContent: 'center',
    marginTop: YellowBoxListRow.GUTTER,
    paddingHorizontal: 12,
  },
  content: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  bodyText: {
    color: YellowBoxStyle.getTextColor(1),
    flex: 1,
    fontSize: 14,
    includeFontPadding: false,
    lineHeight: 18,
  },
  metaText: {
    color: YellowBoxStyle.getTextColor(0.5),
    fontSize: 14,
    includeFontPadding: false,
    lineHeight: 18,
  },
  substitutionText: {
    color: YellowBoxStyle.getTextColor(0.6),
  },
});

module.exports = YellowBoxListRow;
