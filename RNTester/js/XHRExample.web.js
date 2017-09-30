/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} = ReactNative;

var XHRExampleHeaders = require('./XHRExampleHeaders');
var XHRExampleFetch = require('./XHRExampleFetch');
var XHRExampleOnTimeOut = require('./XHRExampleOnTimeOut');

class Downloader extends React.Component {
  state: any;

  xhr: XMLHttpRequest;
  cancelled: boolean;

  constructor(props) {
    super(props);
    this.cancelled = false;
    this.state = {
      downloading: false,
      contentSize: 1,
      downloaded: 0,
    };
  }

  download() {
    this.xhr && this.xhr.abort();

    var xhr = this.xhr || new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.HEADERS_RECEIVED) {
        var contentSize = parseInt(xhr.getResponseHeader('Content-Length'), 10);
        this.setState({
          contentSize: contentSize,
          downloaded: 0,
        });
      } else if (xhr.readyState === xhr.LOADING) {
        this.setState({
          downloaded: xhr.responseText.length,
        });
      } else if (xhr.readyState === xhr.DONE) {
        this.setState({
          downloading: false,
        });
        if (this.cancelled) {
          this.cancelled = false;
          return;
        }
        if (xhr.status === 200) {
          alert('Download complete!');
        } else if (xhr.status !== 0) {
          alert('Error: Server returned HTTP status of ' + xhr.status + ' ' + xhr.responseText);
        } else {
          alert('Error: ' + xhr.responseText);
        }
      }
    };
    xhr.open('GET', 'http://www.gutenberg.org/cache/epub/100/pg100.txt');
    xhr.send();
    this.xhr = xhr;

    this.setState({downloading: true});
  }

  componentWillUnmount() {
    this.cancelled = true;
    this.xhr && this.xhr.abort();
  }

  render() {
    var button = this.state.downloading ? (
      <View style={styles.wrapper}>
        <View style={styles.button}>
          <Text>Downloading...</Text>
        </View>
      </View>
    ) : (
      <TouchableHighlight
        style={styles.wrapper}
        onPress={this.download.bind(this)}>
        <View style={styles.button}>
         <Text>Download 5MB Text File</Text>
        </View>
      </TouchableHighlight>
    );

    return (
      <View>
        {button}
        <Text>progress: {(this.state.downloaded / this.state.contentSize)}</Text>
      </View>
    );
  }
}

exports.framework = 'React';
exports.title = 'XMLHttpRequest';
exports.description = 'XMLHttpRequest';
exports.examples = [{
  title: 'File Download',
  render() {
    return <Downloader/>;
  }
},
// {
//   title: 'multipart/form-data Upload',
//   render() {
//     return <FormUploader/>;
//   }
// },
{
  title: 'Fetch Test',
  render() {
    return <XHRExampleFetch/>;
  }
}, {
  title: 'Headers',
  render() {
    return <XHRExampleHeaders/>;
  }
}, {
  title: 'Time Out Test',
  render() {
    return <XHRExampleOnTimeOut/>;
  }
}];

var styles = StyleSheet.create({
  wrapper: {
    borderRadius: 5,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#eeeeee',
    padding: 8,
  },
  paramRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'grey',
  },
  photoLabel: {
    flex: 1,
  },
  randomPhoto: {
    width: 50,
    height: 50,
  },
  textButton: {
    color: 'blue',
  },
  addTextParamButton: {
    marginTop: 8,
  },
  textInput: {
    flex: 1,
    borderRadius: 3,
    borderColor: 'grey',
    borderWidth: 1,
    height: 30,
    paddingLeft: 8,
  },
  equalSign: {
    paddingHorizontal: 4,
  },
  uploadButton: {
    marginTop: 16,
  },
  uploadButtonBox: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'blue',
    borderRadius: 4,
  },
  uploadButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
