/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */
'use strict';

const EdgeInsetsPropType = require('EdgeInsetsPropType');
const ImageResizeMode = require('ImageResizeMode');
const ImageSourcePropType = require('ImageSourcePropType');
const ImageStylePropTypes = require('ImageStylePropTypes');
const NativeMethodsMixin = require('react/lib/NativeMethodsMixin');
const PropTypes = require('react/lib/ReactPropTypes');
const React = require('React');
const ReactNativeViewAttributes = require('ReactNativeViewAttributes');
const StyleSheet = require('StyleSheet');
const StyleSheetPropType = require('StyleSheetPropType');
const CSSClassNames = require('CSSClassNames');
const LayoutMixin = require('RWLayoutMixin');
const classNames = require('classnames');
const createWebCoreElement = require('createWebCoreElement');

const flattenStyle = require('flattenStyle');
const resolveAssetSource = require('resolveAssetSource');

//TODO RW
// 1.onLoad与prefetch
// 2.defaultSource
// 3.作为容器
// NOTE tintColor不支持
const Image = React.createClass({
  propTypes: {
    style: StyleSheetPropType(ImageStylePropTypes),
    /**
     * `uri` is a string representing the resource identifier for the image, which
     * could be an http address, a local file path, or the name of a static image
     * resource (which should be wrapped in the `require('./path/to/image.png')` function).
     */
    source: ImageSourcePropType,
    /**
     * A static image to display while loading the image source.
     * @platform ios TODO RW 在android平台实现之后需要
     */
    // defaultSource: PropTypes.oneOfType([
    //   PropTypes.shape({
    //     uri: PropTypes.string,
    //   }),
    //   // Opaque type returned by require('./image.jpg')
    //   PropTypes.number,
    // ]),
    /**
     * When true, indicates the image is an accessibility element.
     * @platform ios
     */
    accessible: PropTypes.bool,
    /**
     * The text that's read by the screen reader when the user interacts with
     * the image.
     * @platform ios
     */
    accessibilityLabel: PropTypes.string,
    /**
    * blurRadius: the blur radius of the blur filter added to the image
    * @platform ios
    */
    blurRadius: PropTypes.number,
    /**
     * When the image is resized, the corners of the size specified
     * by capInsets will stay a fixed size, but the center content and borders
     * of the image will be stretched.  This is useful for creating resizable
     * rounded buttons, shadows, and other resizable assets.  More info on
     * [Apple documentation](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIImage_Class/index.html#//apple_ref/occ/instm/UIImage/resizableImageWithCapInsets)
     * @platform ios
     */
    capInsets: EdgeInsetsPropType,
    /**
     * Determines how to resize the image when the frame doesn't match the raw
     * image dimensions.
     *
     * 'cover': Scale the image uniformly (maintain the image's aspect ratio)
     * so that both dimensions (width and height) of the image will be equal
     * to or larger than the corresponding dimension of the view (minus padding).
     *
     * 'contain': Scale the image uniformly (maintain the image's aspect ratio)
     * so that both dimensions (width and height) of the image will be equal to
     * or less than the corresponding dimension of the view (minus padding).
     *
     * 'stretch': Scale width and height independently, This may change the
     * aspect ratio of the src.
     * RW TODO repeat center
     */
    resizeMode: PropTypes.oneOf(['cover', 'contain', 'stretch', 'repeat', 'center']),
    /**
     * A unique identifier for this element to be used in UI Automation
     * testing scripts.
     */
    testID: PropTypes.string,
    /**
     * Invoked on mount and layout changes with
     * `{nativeEvent: {layout: {x, y, width, height}}}`.
     */
    onLayout: PropTypes.func,
    /**
     * Invoked on load start
     */
    onLoadStart: PropTypes.func,
    /**
     * Invoked on download progress with `{nativeEvent: {loaded, total}}`
     * @platform ios
     */
    onProgress: PropTypes.func,
    /**
     * Invoked on load error with `{nativeEvent: {error}}`
     * @platform ios
     */
    onError: PropTypes.func,
    /**
     * Invoked when load completes successfully
     */
    onLoad: PropTypes.func,
    /**
     * Invoked when load either succeeds or fails
     */
    onLoadEnd: PropTypes.func,
  },

  statics: {
    resizeMode: ImageResizeMode,
    /**
     * Retrieve the width and height (in pixels) of an image prior to displaying it.
     * This method can fail if the image cannot be found, or fails to download.
     *
     * In order to retrieve the image dimensions, the image may first need to be
     * loaded or downloaded, after which it will be cached. This means that in
     * principle you could use this method to preload images, however it is not
     * optimized for that purpose, and may in future be implemented in a way that
     * does not fully load/download the image data. A proper, supported way to
     * preload images will be provided as a separate API.
     *
     * @param uri The location of the image.
     * @param success The function that will be called if the image was sucessfully found and width
     * and height retrieved.
     * @param failure The function that will be called if there was an error, such as failing to
     * to retrieve the image.
     *
     * @returns void
     *
     * @platform ios
     */
    getSize: function(
      uri: string,
      success: (width: number, height: number) => void,
      failure: (error: any) => void,
    ) {
      //RW TODO
    },
    /**
     * Prefetches a remote image for later use by downloading it to the disk
     * cache
     *
     * @param url The remote location of the image.
     *
     * @return The prefetched image.
     */
    prefetch(url: string) {
      //RW TODO
    },
  },

  mixins: [NativeMethodsMixin, LayoutMixin],

  /**
   * `NativeMethodsMixin` will look for this when invoking `setNativeProps`. We
   * make `this` look like an actual native component class.
   */
  // viewConfig: {
  //   uiViewClassName: 'UIView',
  //   validAttributes: ReactNativeViewAttributes.UIView
  // },

  contextTypes: {
    isInAParentText: React.PropTypes.bool
  },

  render: function() {
    var source = resolveAssetSource(this.props.source) || {};
    var {width, height, uri} = source;
    var style = flattenStyle([{width, height}, this.props.style]);

    var resizeMode = this.props.resizeMode || style.resizeMode || 'cover';
    delete style.resizeMode;

    if ((this.props.children || resizeMode !== 'stretch') && !this.context.isInAParentText) {
      // 由于style是通过flattenStyle得到的 所以修改不会有问题
      if(uri) {
        style.backgroundImage = 'url("' + uri + '")';
      }
      style.backgroundSize = resizeMode;

      let className = CSSClassNames.CSSClassNames + ' ' + CSSClassNames.IMAGE_CONTAINER;
      if (this.props.className) {
        className += ' ' + this.props.className;
      }

      return createWebCoreElement('div', {
        className,
        'data-src': uri,
        style,
        children: this.props.children,
      });
    } else {
      return createWebCoreElement('img', {
        className: this.props.className ? CSSClassNames.IMAGE + ' ' + this.props.className : CSSClassNames.IMAGE,
        src: uri,
        style,
      });
    }
  },
});

module.exports = Image;
