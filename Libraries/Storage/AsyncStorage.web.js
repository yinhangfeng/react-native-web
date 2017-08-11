/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule AsyncStorage
 */
'use strict';

const PREFIX = 'lrnw_AS_';
let localStorage = window.localStorage;
const isLocalStorageSupported = (function() {
  try {
    localStorage.setItem('___test', '1');
    localStorage.removeItem('___test');
    return true;
  } catch (error) {
    return false;
  }
})();
if (!isLocalStorageSupported) {
  // TODO length key()
  const _storage = Object.create(null);
  localStorage = {
    getItem(key) {
      return _storage[key];
    },
    setItem(key, value) {
      _storage[key] = value;
    },
    removeItem(key) {
      delete _storage[key];
    },
    clear() {
      _storage = Object.create(null);
    },
  };
}

const mergeLocalStorageItem = (key, value) => {
  const oldValue = localStorage.getItem(key);
  const oldObject = JSON.parse(oldValue);
  const newObject = JSON.parse(value);
  const nextValue = JSON.stringify({ ...oldObject, ...newObject });
  localStorage.setItem(key, nextValue);
}

//TODO RW 所有函数对callback的支持
class AsyncStorage {

  static clear() {
   return new Promise((resolve, reject) => {
     try {
       localStorage.clear();
       resolve(null);
     } catch (err) {
       reject(err);
     }
   });
  }

  static getAllKeys() {
   return new Promise((resolve, reject) => {
     try {
       const numberOfKeys = localStorage.length;
       const keys = [];
       for (let i = 0; i < numberOfKeys; i += 1) {
         const key = localStorage.key(i);
         if(key.indexOf(PREFIX) === 0) {
           keys.push(key);
         }
       }
       resolve(keys);
     } catch (err) {
       reject(err);
     }
   });
  }

  static getItem(key, callback) {
   return new Promise((resolve, reject) => {
     try {
       const value = localStorage.getItem(PREFIX + key);
       callback && callback(null, value);
       resolve(value)
     } catch (err) {
       callback && callback(err, null);
       reject(err);
     }
   });
  }

  static mergeItem(key: string, value: string) {
   return new Promise((resolve, reject) => {
     try {
       mergeLocalStorageItem(PREFIX + key, value);
       resolve(null);
     } catch (err) {
       reject(err);
     }
   });
  }

  static multiGet(keys: Array<string>) {
   const promises = keys.map((key) => AsyncStorage.getItem(PREFIX + key));

   return Promise.all(promises).then(
     (result) => Promise.resolve(result.map((value, i) => [ keys[i], value ])),
     (error) => Promise.reject(error)
   );
  }

  static multiMerge(keyValuePairs: Array<Array<string>>) {
   const promises = keyValuePairs.map((item) => AsyncStorage.mergeItem(item[0], item[1]));

   return Promise.all(promises).then(
     () => Promise.resolve(null),
     (error) => Promise.reject(error)
   );
  }

  static multiRemove(keys: Array<string>) {
   const promises = keys.map((key) => AsyncStorage.removeItem(PREFIX + key));

   return Promise.all(promises).then(
     () => Promise.resolve(null),
     (error) => Promise.reject(error)
   );
  }

  static multiSet(keyValuePairs: Array<Array<string>>) {
   const promises = keyValuePairs.map((item) => AsyncStorage.setItem(item[0], item[1]));

   return Promise.all(promises).then(
     () => Promise.resolve(null),
     (error) => Promise.reject(error)
   );
  }

  static removeItem(key, callback) {
   return new Promise((resolve, reject) => {
     try {
       localStorage.removeItem(PREFIX + key);
       callback && callback();
       resolve(null);
     } catch (err) {
       callback && callback(err);
       reject(err);
     }
   });
  }

  static setItem(key, value, callback) {
   return new Promise((resolve, reject) => {
     try {
       localStorage.setItem(PREFIX + key, value);
       callback && callback();
       resolve(null);
     } catch (err) {
        callback && callback(err);
       reject(err);
     }
   });
  }

  /**
   * RW 不管是否支持localStorage 都使用
   */
  static forceLocalStorage() {
    if (!isLocalStorageSupported) {
      localStorage = window.localStorage;
    }
  }
}

// RW 扩展 为false 表示不支持 此时如果不调用forceLocalStorage() 则数据存在内存中
AsyncStorage.isLocalStorageSupported = isLocalStorageSupported;

module.exports = AsyncStorage;
