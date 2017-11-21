/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule NativeAnimatedHelper
 * @flow
 * @format
 */
'use strict';

import type {AnimationConfig} from './animations/Animation';
import type {EventConfig} from './AnimatedEvent';

function assertNativeAnimatedModule(): void {
}

function shouldUseNativeDriver(config: AnimationConfig | EventConfig): boolean {
  return false;
}

module.exports = {
  // API,
  // validateStyles,
  // validateTransform,
  // validateInterpolation,
  // generateNewNodeTag,
  // generateNewAnimationId,
  assertNativeAnimatedModule,
  shouldUseNativeDriver,
  // get nativeEventEmitter() {
  //   if (!nativeEventEmitter) {
  //     nativeEventEmitter = new NativeEventEmitter(NativeAnimatedModule);
  //   }
  //   return nativeEventEmitter;
  // },
};
