/**
 * @providesModule Image
 */

'use strict';

const EdgeInsetsPropType = require('EdgeInsetsPropType');
const ImageResizeMode = require('ImageResizeMode');
const ImageSourcePropType = require('ImageSourcePropType');
const ImageStylePropTypes = require('ImageStylePropTypes');
const NativeMethodsMixin = require('NativeMethodsMixin');
const PropTypes = require('react/lib/ReactPropTypes');
const React = require('React');
const ReactNativeViewAttributes = require('ReactNativeViewAttributes');
const StyleSheet = require('StyleSheet');
const StyleSheetPropType = require('StyleSheetPropType');
const CSSClassNames = require('CSSClassNames');
const classNames = require('classnames');
const createWebCoreElement = require('createWebCoreElement');
const View = require('View');

const flattenStyle = require('flattenStyle');
const resolveAssetSource = require('resolveAssetSource');

const STATUS_ERRORED = 'ERRORED';
const STATUS_LOADED = 'LOADED';
const STATUS_LOADING = 'LOADING';
const STATUS_PENDING = 'PENDING';
const STATUS_IDLE = 'IDLE'; // 表示空闲状态 对于不需要加载事件的情况 始终为IDLE

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

    //
    // 扩展
    //
    /**
     * 是否支持响应式
     */
    responsive: PropTypes.bool,
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
    const {
      accessibilityLabel,
      accessible,
      children,
      defaultSource,
      onLayout,
      source,
      testID,
    } = this.props;

    let displaySource;
    if (this._imageState === STATUS_LOADING || this._imageState === STATUS_ERRORED) {
      displaySource = resolveAssetSource(defaultSource);
    } else {
      displaySource = this._source.uri ? this._source : resolveAssetSource(defaultSource);
    }
    displaySource = displaySource || EMPTY_SOURCE;
    const {width, height, uri} = displaySource;
    const backgroundImage = !this.props.responsive ? uri && `url(${uri})` : null;
    const style = flattenStyle([{width, height}, this.props.style]);

    const resizeMode = this.props.resizeMode || style.resizeMode || ImageResizeMode.cover;
    delete style.resizeMode;

    return (
      <View
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='img'
        accessible={accessible}
        onLayout={onLayout}
        className={CSSClassNames.IMAGE_CONTAINER}
        style={[
          style,
          backgroundImage && { backgroundImage },
          resizeModeStyles[resizeMode]
        ]}
        testID={testID}>
        {this.props.responsive && (
          <img className="lrnw-responsive-image" src={uri}/>
        )}
        {children && (
          <View children={children} pointerEvents='box-none' style={StyleSheet.absoluteFill} />
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
