/**
 * @providesModule renderApplication
 */
'use strict';

const React = require('React');
const ReactNative = require('ReactNative');
//const StyleSheet = require('StyleSheet');
//const View = require('View');
const CSSClassNames = require('CSSClassNames');
const RWConfig = require('RWConfig');
// TODO material-ui 库需要, 暂时放在这里，应该由使用者提供
const getMuiTheme = __requireDefault(require('material-ui/src/styles/getMuiTheme'));

/**
 * 对未设置bodyScrollMode 的ROOT_CONTAINER样式设为overflow: 'hidden',
 * 否则在某些浏览器中会出现body滚动
 */
class AppContainer extends React.Component {

  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  };

  getChildContext() {
    return {
      muiTheme: getMuiTheme(),
    };
  }

  render() {
    return (
      <div
        className={CSSClassNames.ROOT_CONTAINER}
        style={RWConfig.bodyScrollMode ? null : {overflow: 'hidden',}}>
        <this.props.rootComponent
          {...this.props.initialProps}
          rootTag={this.props.rootTag}/>
      </div>
    );
  }
}

function renderApplication<D, P, S>(
  RootComponent: ReactClass<D, P, S>,
  initialProps: P,
  rootTag: any
) {
  ReactNative.render(
    <AppContainer
      rootComponent={RootComponent}
      initialProps={initialProps}
      rootTag={rootTag} />,
    rootTag
  );
}

// var styles = StyleSheet.create({
//   // This is needed so the application covers the whole screen
//   // and therefore the contents of the React are not clipped.
//   appContainer: {
//     position: 'absolute',
//     left: 0,
//     top: 0,
//     right: 0,
//     bottom: 0,
//   },
// });

module.exports = renderApplication;
