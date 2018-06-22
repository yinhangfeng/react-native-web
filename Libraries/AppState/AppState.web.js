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

//RW web端假的AppState 始终为active
var AppState = {

  /**
   * Add a handler to AppState changes by listening to the `change` event type
   * and providing the handler
   */
  addEventListener: function(
    type: string,
    handler: Function
  ) {

  },

  /**
   * Remove a handler by passing the `change` event type and the handler
   */
  removeEventListener: function(
    type: string,
    handler: Function
  ) {

  },

  currentState: 'active',
};

module.exports = AppState;
