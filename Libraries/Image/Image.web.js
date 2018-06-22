/**
 * RW SYNC react-native: 0.49 ios react-native-web: TODO
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

// const EdgeInsetsPropType = require('react-native/Libraries/StyleSheet/EdgeInsetsPropType');
const ImageResizeMode = require('react-native/Libraries/Image/ImageResizeMode');
const ImageSourcePropType = require('react-native/Libraries/Image/ImageSourcePropType');
const ImageStylePropTypes = require('react-native/Libraries/Image/ImageStylePropTypes');
const NativeMethodsMixin = require('react-native/Libraries/Renderer/shims/NativeMethodsMixin');
const React = require('react-native/Libraries/react-native/React');
const PropTypes = require('prop-types');
// const ReactNativeViewAttributes = require('react-native/Libraries/Components/View/ReactNativeViewAttributes');
const StyleSheet = require('react-native/Libraries/StyleSheet/StyleSheet');
const StyleSheetPropType = require('react-native/Libraries/StyleSheet/StyleSheetPropType');

const createReactClass = require('create-react-class');
const flattenStyle = require('react-native/Libraries/StyleSheet/flattenStyle');
const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource');

const CSSClassNames = require('react-native/Libraries/StyleSheet/CSSClassNames');
const createWebCoreElement = require('react-native/Libraries/lrnw/createWebCoreElement');
const View = require('react-native/Libraries/Components/View/View');

const STATUS_ERRORED = 1;
const STATUS_LOADED = 2;
const STATUS_LOADING = 3;
const STATUS_PENDING = 4;
const STATUS_IDLE = 5; // 表示空闲状态 对于不需要加载事件的情况 始终为IDLE

const EMPTY_SOURCE = {};

function resolveImageSource(source) {
  return resolveAssetSource(source) || EMPTY_SOURCE;
}

function needImageLoader(props) {
  return props.defaultSource || props.onLoadStart || props.onLoad || props.onError || props.onLoadEnd;
}

// TODO RW
// 1.prefetch
// NOTE
// 1. tintColor不支持
// 2. responsive时不支持resizeMode
const Image = createReactClass({
  displayName: 'Image',
  propTypes: {
    /**
     * > `ImageResizeMode` is an `Enum` for different image resizing modes, set via the
     * > `resizeMode` style property on `Image` components. The values are `contain`, `cover`,
     * > `stretch`, `center`, `repeat`.
     */
    style: StyleSheetPropType(ImageStylePropTypes),
    /**
     * The image source (either a remote URL or a local file resource).
     *
     * This prop can also contain several remote URLs, specified together with
     * their width and height and potentially with scale/other URI arguments.
     * The native side will then choose the best `uri` to display based on the
     * measured size of the image container. A `cache` property can be added to
     * control how networked request interacts with the local cache.
     *
     * The currently supported formats are `png`, `jpg`, `jpeg`, `bmp`, `gif`,
     * `webp` (Android only), `psd` (iOS only).
     */
    source: ImageSourcePropType,
    /**
     * A static image to display while loading the image source.
     *
     * - `uri` - a string representing the resource identifier for the image, which
     * should be either a local file path or the name of a static image resource
     * (which should be wrapped in the `require('./path/to/image.png')` function).
     * - `width`, `height` - can be specified if known at build time, in which case
     * these will be used to set the default `<Image/>` component dimensions.
     * - `scale` - used to indicate the scale factor of the image. Defaults to 1.0 if
     * unspecified, meaning that one image pixel equates to one display point / DIP.
     * - `number` - Opaque type returned by something like `require('./image.jpg')`.
     *
     * @platform ios
     */
    defaultSource: PropTypes.oneOfType([
      // TODO: Tooling to support documenting these directly and having them display in the docs.
      PropTypes.shape({
        uri: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
        scale: PropTypes.number,
      }),
      PropTypes.number,
    ]),
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
    // accessibilityLabel: PropTypes.node,
    /**
    * blurRadius: the blur radius of the blur filter added to the image
    */
    blurRadius: PropTypes.number,
    /**
     * When the image is resized, the corners of the size specified
     * by `capInsets` will stay a fixed size, but the center content and borders
     * of the image will be stretched.  This is useful for creating resizable
     * rounded buttons, shadows, and other resizable assets.  More info in the
     * [official Apple documentation](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIImage_Class/index.html#//apple_ref/occ/instm/UIImage/resizableImageWithCapInsets).
     *
     * @platform ios
     */
    // capInsets: EdgeInsetsPropType,
    /**
     * The mechanism that should be used to resize the image when the image's dimensions
     * differ from the image view's dimensions. Defaults to `auto`.
     *
     * - `auto`: Use heuristics to pick between `resize` and `scale`.
     *
     * - `resize`: A software operation which changes the encoded image in memory before it
     * gets decoded. This should be used instead of `scale` when the image is much larger
     * than the view.
     *
     * - `scale`: The image gets drawn downscaled or upscaled. Compared to `resize`, `scale` is
     * faster (usually hardware accelerated) and produces higher quality images. This
     * should be used if the image is smaller than the view. It should also be used if the
     * image is slightly bigger than the view.
     *
     * More details about `resize` and `scale` can be found at http://frescolib.org/docs/resizing-rotating.html.
     *
     * @platform android
     */
    resizeMethod: PropTypes.oneOf(['auto', 'resize', 'scale']),
    /**
     * Determines how to resize the image when the frame doesn't match the raw
     * image dimensions.
     *
     * - `cover`: Scale the image uniformly (maintain the image's aspect ratio)
     * so that both dimensions (width and height) of the image will be equal
     * to or larger than the corresponding dimension of the view (minus padding).
     *
     * - `contain`: Scale the image uniformly (maintain the image's aspect ratio)
     * so that both dimensions (width and height) of the image will be equal to
     * or less than the corresponding dimension of the view (minus padding).
     *
     * - `stretch`: Scale width and height independently, This may change the
     * aspect ratio of the src.
     *
     * - `repeat`: Repeat the image to cover the frame of the view. The
     * image will keep it's size and aspect ratio. (iOS only)
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
     * Invoked on load start.
     *
     * e.g., `onLoadStart={(e) => this.setState({loading: true})}`
     */
    onLoadStart: PropTypes.func,
    /**
     * Invoked on download progress with `{nativeEvent: {loaded, total}}`.
     * @platform ios
     */
    onProgress: PropTypes.func,
    /**
     * Invoked on load error with `{nativeEvent: {error}}`.
     */
    onError: PropTypes.func,
    /**
     * Invoked when a partial load of the image is complete. The definition of
     * what constitutes a "partial load" is loader specific though this is meant
     * for progressive JPEG loads.
     * @platform ios
     */
    onPartialLoad: PropTypes.func,
    /**
     * Invoked when load completes successfully.
     */
    onLoad: PropTypes.func,
    /**
     * Invoked when load either succeeds or fails.
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
     * Does not work for static image resources.
     *
     * @param uri The location of the image.
     * @param success The function that will be called if the image was successfully found and width
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
      failure?: (error: any) => void,
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
      return Promise.resolve();
    },
    /**
     * Resolves an asset reference into an object which has the properties `uri`, `width`,
     * and `height`. The input may either be a number (opaque type returned by
     * require('./foo.png')) or an `ImageSource` like { uri: '<http location || file path>' }
     */
    resolveAssetSource: resolveAssetSource,
  },

  mixins: [NativeMethodsMixin],

  // getDefaultProps: function() {
  // },

  getInitialState: function() {
    this._source = resolveImageSource(this.props.source);
    if (this._source.uri && needImageLoader(this.props)) {
      this._imageState = STATUS_PENDING;
    } else {
      this._imageState = STATUS_IDLE;
    }
    return {};
  },

  componentWillMount: function() {
    if (this._imageState === STATUS_PENDING) {
      this._createImageLoader();
    }
  },

  componentWillReceiveProps: function(nextProps) {
    const nextSource = resolveImageSource(nextProps.source);
    const curSource = this._source;
    this._source = nextSource;
    if (!needImageLoader(nextProps)) {
      this._updateImageState(STATUS_IDLE);
    } else if (nextSource.uri != this._source.uri) {
      this._updateImageState(nextSource.uri ? STATUS_PENDING : STATUS_IDLE);
      if (this._imageState === STATUS_PENDING) {
        this._createImageLoader();
      }
    }
  },

  componentWillUnmount: function() {
    this._destroyImageLoader();
  },

  render: function() {
    const props = this.props;

    let displaySource;
    if (this._imageState === STATUS_LOADING || this._imageState === STATUS_ERRORED) {
      displaySource = resolveAssetSource(props.defaultSource);
    } else {
      displaySource = this._source.uri ? this._source : resolveAssetSource(props.defaultSource);
    }
    displaySource = displaySource || EMPTY_SOURCE;
    const {width, height, uri} = displaySource;
    const backgroundImage = !props.responsive ? uri && `url(${uri})` : null;
    const style = flattenStyle([{width, height}, props.style]);

    const resizeMode = props.resizeMode || style.resizeMode || ImageResizeMode.cover;
    delete style.resizeMode;

    let className = CSSClassNames.IMAGE_CONTAINER;
    if (props.className) {
      className += ' ' + props.className;
    }

    return (
      <View
        {...props}
        className={className}
        style={[
          style,
          backgroundImage && { backgroundImage },
          resizeModeStyles[resizeMode]
        ]}
      >
        {props.responsive && (
          <img className="lrnw-responsive-image" src={uri}/>
        )}
        {props.children && (
          <View children={props.children} pointerEvents='box-none' style={StyleSheet.absoluteFill} />
        )}
      </View>
    );
  },

  _createImageLoader: function() {
    const uri = this._source.uri;

    this._destroyImageLoader();
    this.image = new window.Image();
    this.image.onerror = this._onError;
    this.image.onload = this._onLoad;
    this.image.src = uri;
    this._onLoadStart();
  },

  _destroyImageLoader: function() {
    if (this.image) {
      this.image.onerror = null;
      this.image.onload = null;
      this.image = null;
    }
  },

  _onLoadStart: function() {
    this._updateImageState(STATUS_LOADING);
    this.props.onLoadStart && this.props.onLoadStart();
  },

  _onLoad: function(e) {
    this._destroyImageLoader();
    this._updateImageState(STATUS_LOADED);
    this.props.onLoad && this.props.onLoad({ nativeEvent: e })
    this._onLoadEnd();
  },

  _onError: function(e) {
    this._destroyImageLoader();
    this._updateImageState(STATUS_ERRORED);
    this.props.onError && this.props.onError({ nativeEvent: e });
    this._onLoadEnd();
  },

  _onLoadEnd: function() {
    this.props.onLoadEnd && this.props.onLoadEnd();
  },

  _updateImageState: function(status) {
    if (status !== this._imageState) {
      this._imageState = status;
      this.forceUpdate();
    }
  },
});

// const styles = StyleSheet.create({
// });

const resizeModeStyles = StyleSheet.create({
  center: {
    backgroundSize: 'auto',
  },
  contain: {
    backgroundSize: 'contain',
  },
  cover: {
    backgroundSize: 'cover',
  },
  none: {
    backgroundSize: 'auto',
  },
  repeat: {
    backgroundSize: 'auto',
    backgroundRepeat: 'repeat',
  },
  stretch: {
    backgroundSize: '100% 100%',
  },
});

module.exports = Image;
