'use strict';

// bluebird 可能会受 @babel/polyfill 的干扰(setImmediate?) 所以分开确保最先引入
window.__Promise = window.Promise;
window.Promise = require('bluebird/js/browser/bluebird.min');

// 对原生 Promise polyfill done() 可在不转译 async function 时 对返回 Promise 调用 .done
// 参考 https://github.com/then/promise/blob/master/src/done.js
if (__Promise && !__Promise.prototype.done) {
  __Promise.prototype.done = function (onFulfilled, onRejected) {
    var self = arguments.length ? this.then.apply(this, arguments) : this;
    self.then(null, function (err) {
      setTimeout(function () {
        throw err;
      }, 0);
    });
  };
}