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

//TODO RW 更好的实现
class Alert {

  static alert(
    title,
    message,
    buttons,
    type,
  ): void {
    alert(title);
  }
}

module.exports = Alert;
