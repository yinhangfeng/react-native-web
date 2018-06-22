/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const emptyObject = {};
const objects = Object.create(null);
let uniqueID = 1;

export default class ReactNativePropRegistry {
  static register(object: Object): number {
    const id = uniqueID++;
    if (__DEV__) {
      Object.freeze(object);
    }
    objects[id] = object;
    return id;
  }

  static getByID(id: number): Object {
    if (!id) {
      // Used in the style={[condition && id]} pattern,
      // we want it to be a no-op when the value is false or null
      return emptyObject;
    }
    const object = objects[id];
    if (!object) {
      if (__DEV__) {
        console.warn('Invalid style with id `' + id + '`. Skipping ...');
      }
      return emptyObject;
    }
    return object;
  }
}
