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

const EventEmitter = require('react-native/Libraries/vendor/emitter/EventEmitter');
const EventSubscriptionVendor = require('react-native/Libraries/vendor/emitter/EventSubscriptionVendor');

import type EmitterSubscription from 'react-native/Libraries/vendor/emitter/EmitterSubscription';

/**
 * Deprecated - subclass NativeEventEmitter to create granular event modules instead of
 * adding all event listeners directly to RCTDeviceEventEmitter.
 */
class RCTDeviceEventEmitter extends EventEmitter {

  sharedSubscriber: EventSubscriptionVendor;

  constructor() {
    const sharedSubscriber = new EventSubscriptionVendor();
    super(sharedSubscriber);
    this.sharedSubscriber = sharedSubscriber;
  }
}

module.exports = new RCTDeviceEventEmitter();
