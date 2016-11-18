/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * Facebook, Inc. ("Facebook") owns all right, title and interest, including
 * all intellectual property and other proprietary rights, in and to the React
 * Native CustomComponents software (the "Software").  Subject to your
 * compliance with these terms, you are hereby granted a non-exclusive,
 * worldwide, royalty-free copyright license to (1) use and copy the Software;
 * and (2) reproduce and distribute the Software as part of your own software
 * ("Your Software").  Facebook reserves all rights not expressly granted to
 * you in this license agreement.
 *
 * THE SOFTWARE AND DOCUMENTATION, IF ANY, ARE PROVIDED "AS IS" AND ANY EXPRESS
 * OR IMPLIED WARRANTIES (INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE) ARE DISCLAIMED.
 * IN NO EVENT SHALL FACEBOOK OR ITS AFFILIATES, OFFICERS, DIRECTORS OR
 * EMPLOYEES BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THE SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @providesModule ListView
 */
'use strict';

var ListViewDataSource = require('ListViewDataSource');
var React = require('React');
var ReactNative = require('ReactNative');
//var RCTScrollViewManager = require('NativeModules').ScrollViewManager;
var ScrollView = require('ScrollView');
//var ScrollResponder = require('ScrollResponder');
var StaticRenderer = require('StaticRenderer');
var TimerMixin = require('react-timer-mixin');

var cloneReferencedElement = require('react-clone-referenced-element');
var isEmpty = require('isEmpty');
var merge = require('merge');

var PropTypes = React.PropTypes;
var RWConfig = require('RWConfig');

var DEFAULT_PAGE_SIZE = 1;
var DEFAULT_INITIAL_ROWS = 10;
var DEFAULT_SCROLL_RENDER_AHEAD = 1000;
var DEFAULT_END_REACHED_THRESHOLD = 1000;
var DEFAULT_SCROLL_CALLBACK_THROTTLE = 50;

/**
 * NOTE: web版ListView 会一次渲染所有项
 */
var ListView = React.createClass({

  statics: {
    DataSource: ListViewDataSource,
  },

  /**
   * You must provide a renderRow function. If you omit any of the other render
   * functions, ListView will simply skip rendering them.
   *
   * - renderRow(rowData, sectionID, rowID, highlightRow);
   * - renderSectionHeader(sectionData, sectionID);
   */
  propTypes: {
    ...ScrollView.propTypes,
    /**
     * An instance of [ListView.DataSource](docs/listviewdatasource.html) to use
     */
    dataSource: PropTypes.instanceOf(ListViewDataSource).isRequired,
    /**
     * (sectionID, rowID, adjacentRowHighlighted) => renderable
     *
     * If provided, a renderable component to be rendered as the separator
     * below each row but not the last row if there is a section header below.
     * Take a sectionID and rowID of the row above and whether its adjacent row
     * is highlighted.
     */
    renderSeparator: PropTypes.func,
    /**
     * (rowData, sectionID, rowID, highlightRow) => renderable
     *
     * Takes a data entry from the data source and its ids and should return
     * a renderable component to be rendered as the row.  By default the data
     * is exactly what was put into the data source, but it's also possible to
     * provide custom extractors. ListView can be notified when a row is
     * being highlighted by calling `highlightRow(sectionID, rowID)`. This
     * sets a boolean value of adjacentRowHighlighted in renderSeparator, allowing you
     * to control the separators above and below the highlighted row. The highlighted
     * state of a row can be reset by calling highlightRow(null).
     */
    renderRow: PropTypes.func.isRequired,
    /**
     * How many rows to render on initial component mount.  Use this to make
     * it so that the first screen worth of data appears at one time instead of
     * over the course of multiple frames.
     */
    initialListSize: PropTypes.number.isRequired,
    /**
     * Called when all rows have been rendered and the list has been scrolled
     * to within onEndReachedThreshold of the bottom.  The native scroll
     * event is provided.
     */
    onEndReached: PropTypes.func,
    /**
     * Threshold in pixels (virtual, not physical) for calling onEndReached.
     */
    onEndReachedThreshold: PropTypes.number.isRequired,
    /**
     * Number of rows to render per event loop. Note: if your 'rows' are actually
     * cells, i.e. they don't span the full width of your view (as in the
     * ListViewGridLayoutExample), you should set the pageSize to be a multiple
     * of the number of cells per row, otherwise you're likely to see gaps at
     * the edge of the ListView as new pages are loaded.
     */
    pageSize: PropTypes.number.isRequired,
    /**
     * () => renderable
     *
     * The header and footer are always rendered (if these props are provided)
     * on every render pass.  If they are expensive to re-render, wrap them
     * in StaticContainer or other mechanism as appropriate.  Footer is always
     * at the bottom of the list, and header at the top, on every render pass.
     */
    renderFooter: PropTypes.func,
    renderHeader: PropTypes.func,
    /**
     * (sectionData, sectionID) => renderable
     *
     * If provided, a sticky header is rendered for this section.  The sticky
     * behavior means that it will scroll with the content at the top of the
     * section until it reaches the top of the screen, at which point it will
     * stick to the top until it is pushed off the screen by the next section
     * header.
     */
    renderSectionHeader: PropTypes.func,
    /**
     * (props) => renderable
     *
     * A function that returns the scrollable component in which the list rows
     * are rendered. Defaults to returning a ScrollView with the given props.
     */
    renderScrollComponent: React.PropTypes.func.isRequired,
    /**
     * How early to start rendering rows before they come on screen, in
     * pixels.
     */
    scrollRenderAheadDistance: React.PropTypes.number.isRequired,
    /**
     * (visibleRows, changedRows) => void
     *
     * Called when the set of visible rows changes.  `visibleRows` maps
     * { sectionID: { rowID: true }} for all the visible rows, and
     * `changedRows` maps { sectionID: { rowID: true | false }} for the rows
     * that have changed their visibility, with true indicating visible, and
     * false indicating the view has moved out of view.
     */
    onChangeVisibleRows: React.PropTypes.func,
    /**
     * A performance optimization for improving scroll perf of
     * large lists, used in conjunction with overflow: 'hidden' on the row
     * containers.  This is enabled by default.
     */
    removeClippedSubviews: React.PropTypes.bool,
    /**
     * An array of child indices determining which children get docked to the
     * top of the screen when scrolling. For example, passing
     * `stickyHeaderIndices={[0]}` will cause the first child to be fixed to the
     * top of the scroll view. This property is not supported in conjunction
     * with `horizontal={true}`.
     * @platform ios
     */
    stickyHeaderIndices: PropTypes.arrayOf(PropTypes.number).isRequired,
    /**
     * Flag indicating whether empty section headers should be rendered. In the future release
     * empty section headers will be rendered by default, and the flag will be deprecated.
     * If empty sections are not desired to be rendered their indices should be excluded from sectionID object.
     */
    enableEmptySections: PropTypes.bool,

    bodyScrollMode: PropTypes.bool,
  },

  /**
   * Exports some data, e.g. for perf investigations or analytics.
   */
  getMetrics: function() {
    let totalRows = (this.props.enableEmptySections ? this.props.dataSource.getRowAndSectionCount() : this.props.dataSource.getRowCount());
    //TODO RW
    return {
      // contentLength: this.scrollProperties.contentLength,
      totalRows,
      renderedRows: totalRows,
      visibleRows: totalRows,
    };
  },

  /**
   * Provides a handle to the underlying scroll responder.
   * Note that `this._scrollComponent` might not be a `ScrollView`, so we
   * need to check that it responds to `getScrollResponder` before calling it.
   */
  getScrollResponder: function() {
    if (this._scrollComponent && this._scrollComponent.getScrollResponder) {
      return this._scrollComponent.getScrollResponder();
    }
  },

  /**
   * Scrolls to a given x, y offset, either immediately or with a smooth animation.
   *
   * See `ScrollView#scrollTo`.
   */
  scrollTo: function(...args: Array<mixed>) {
    if (this._scrollComponent && this._scrollComponent.scrollTo) {
      this._scrollComponent.scrollTo(...args);
    }
  },

  setNativeProps: function(props: Object) {
    if (this._scrollComponent) {
      this._scrollComponent.setNativeProps(props);
    }
  },

  /**
   * React life cycle hooks.
   */

  getDefaultProps: function() {
    return {
      initialListSize: DEFAULT_INITIAL_ROWS,
      pageSize: DEFAULT_PAGE_SIZE,
      renderScrollComponent: props => <ScrollView {...props} />,
      scrollRenderAheadDistance: DEFAULT_SCROLL_RENDER_AHEAD,
      onEndReachedThreshold: DEFAULT_END_REACHED_THRESHOLD,
      stickyHeaderIndices: [],
      bodyScrollMode: RWConfig.bodyScrollMode,
    };
  },

  getInitialState: function() {
    return {
      highlightedRow: {},
    };
  },

  getInnerViewNode: function() {
    return this._scrollComponent.getInnerViewNode();
  },

  componentWillMount: function() {
    this._prevRenderedRowsCount = 0;
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.props.dataSource !== nextProps.dataSource) {
      this._prevRenderedRowsCount = 0;
    }
  },

  _onRowHighlighted: function(sectionID: string, rowID: string) {
    this.setState({highlightedRow: {sectionID, rowID}});
  },

  render: function() {
    var bodyComponents = [];

    var dataSource = this.props.dataSource;
    var allRowIDs = dataSource.rowIdentities;
    var rowCount = 0;
    var sectionHeaderIndices = [];

    var header = this.props.renderHeader && this.props.renderHeader();
    var footer = this.props.renderFooter && this.props.renderFooter();
    var totalIndex = header ? 1 : 0;

    for (var sectionIdx = 0; sectionIdx < allRowIDs.length; sectionIdx++) {
      var sectionID = dataSource.sectionIdentities[sectionIdx];
      var rowIDs = allRowIDs[sectionIdx];
      if (rowIDs.length === 0) {
        if (this.props.enableEmptySections === undefined) {
          var warning = require('fbjs/lib/warning');
          warning(false, 'In next release empty section headers will be rendered.'
                  + ' In this release you can use \'enableEmptySections\' flag to render empty section headers.');
          continue;
        } else {
          var invariant = require('fbjs/lib/invariant');
          invariant(
            this.props.enableEmptySections,
            'In next release \'enableEmptySections\' flag will be deprecated, empty section headers will always be rendered.'
            + ' If empty section headers are not desirable their indices should be excluded from sectionIDs object.'
            + ' In this release \'enableEmptySections\' may only have value \'true\' to allow empty section headers rendering.');
        }
      }

      if (this.props.renderSectionHeader) {
        var shouldUpdateHeader = rowCount >= this._prevRenderedRowsCount &&
          dataSource.sectionHeaderShouldUpdate(sectionIdx);
        bodyComponents.push(
          <StaticRenderer
            key={'s_' + sectionID}
            shouldUpdate={!!shouldUpdateHeader}
            render={this.props.renderSectionHeader.bind(
              null,
              dataSource.getSectionHeaderData(sectionIdx),
              sectionID
            )}
          />
        );
        sectionHeaderIndices.push(totalIndex++);
      }

      for (var rowIdx = 0; rowIdx < rowIDs.length; rowIdx++) {
        var rowID = rowIDs[rowIdx];
        var comboID = sectionID + '_' + rowID;
        var shouldUpdateRow = rowCount >= this._prevRenderedRowsCount &&
          dataSource.rowShouldUpdate(sectionIdx, rowIdx);
        var row =
          <StaticRenderer
            key={'r_' + comboID}
            shouldUpdate={!!shouldUpdateRow}
            render={this.props.renderRow.bind(
              null,
              dataSource.getRowData(sectionIdx, rowIdx),
              sectionID,
              rowID,
              this._onRowHighlighted
            )}
          />;
        bodyComponents.push(row);
        totalIndex++;

        if (this.props.renderSeparator &&
            (rowIdx !== rowIDs.length - 1 || sectionIdx === allRowIDs.length - 1)) {
          var adjacentRowHighlighted =
            this.state.highlightedRow.sectionID === sectionID && (
              this.state.highlightedRow.rowID === rowID ||
              this.state.highlightedRow.rowID === rowIDs[rowIdx + 1]
            );
          var separator = this.props.renderSeparator(
            sectionID,
            rowID,
            adjacentRowHighlighted
          );
          if (separator) {
            bodyComponents.push(separator);
            totalIndex++;
          }
        }
        ++rowCount;
        // if (++rowCount === this.state.curRenderedRowsCount) {
        //   break;
        // }
      }
      // if (rowCount >= this.state.curRenderedRowsCount) {
      //   break;
      // }
    }

    this._prevRenderedRowsCount = rowCount; //一次渲染所有

    var {
      renderScrollComponent,
      ...props,
    } = this.props;
    if (!props.scrollEventThrottle) {
      props.scrollEventThrottle = DEFAULT_SCROLL_CALLBACK_THROTTLE;
    }
    if (props.removeClippedSubviews === undefined) {
      props.removeClippedSubviews = true;
    }
    Object.assign(props, {
      onScroll: (props.onEndReached || props.onScroll) ? this._onScroll : null,
      //stickyHeaderIndices: this.props.stickyHeaderIndices.concat(sectionHeaderIndices),

      // Do not pass these events downstream to ScrollView since they will be
      // registered in ListView's own ScrollResponder.Mixin
      onKeyboardWillShow: undefined,
      onKeyboardWillHide: undefined,
      onKeyboardDidShow: undefined,
      onKeyboardDidHide: undefined,
    });

    return cloneReferencedElement(renderScrollComponent(props), {
      ref: this._setScrollComponentRef,
    }, header, bodyComponents, footer);
  },

  /**
   * Private methods
   */

  _setScrollComponentRef: function(scrollComponent) {
    this._scrollComponent = scrollComponent;
    //this._scrollComponentNode = ReactNative.findNodeHandle(scrollComponent);
  },

  _onScroll: function(e) {
    this.props.onScroll && this.props.onScroll(e);

    if (this.props.onEndReached) {
      let isVertical = !this.props.horizontal;
      let visibleLength = e.nativeEvent.layoutMeasurement[
        isVertical ? 'height' : 'width'
      ];
      let contentLength = e.nativeEvent.contentSize[
        isVertical ? 'height' : 'width'
      ];
      let offset = e.nativeEvent.contentOffset[
        isVertical ? 'y' : 'x'
      ];
      if ((contentLength - visibleLength - offset) < this.props.onEndReachedThreshold) {
        this.props.onEndReached(e);
      }
    }
  },
});

module.exports = ListView;
