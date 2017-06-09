'use strict';
const normalizeTouches = function(touches, timestamp) {
  const newTouches = [];
  let touch;
  for (let i = 0; i < touches.length; ++i) {
    touch = touches[i];

    // Mobile Safari re-uses touch objects, so we copy the properties we want and normalize the identifier
    const identifier = touch.identifier > 20 ? touch.identifier % 20 : touch.identifier;

    let locationX;
    let locationY;
    if (touch.target) {
      const rect = touch.target.getBoundingClientRect();
      locationX = touch.pageX - rect.left;
      locationY = touch.pageY - rect.top;
    } else {
      locationX = 0;
      locationY = 0;
    }

    newTouches.push({
      clientX: touch.clientX,
      clientY: touch.clientY,
      force: touch.force,
      locationX: locationX,
      locationY: locationY,
      identifier: touch.identifier,
      pageX: touch.pageX,
      pageY: touch.pageY,
      radiusX: touch.radiusX,
      radiusY: touch.radiusY,
      rotationAngle: touch.rotationAngle,
      screenX: touch.screenX,
      screenY: touch.screenY,
      target: touch.target,
      timestamp: touch.timestamp || timestamp,
    });
  }
  return newTouches;
};

function preventDefault() {
  return this._event.preventDefault();
}

function stopImmediatePropagation() {
  return this._event.stopImmediatePropagation();
}

function stopPropagation() {
  return this._event.stopPropagation();
}

function normalizeTouchEvent(nativeEvent) {
  // normalize the timestamp TODO
  // https://stackoverflow.com/questions/26177087/ios-8-mobile-safari-wrong-timestamp-on-touch-events
  const timestamp = nativeEvent.timestamp || Date.now();
  const changedTouches = normalizeTouches(nativeEvent.changedTouches, timestamp);
  const touches = normalizeTouches(nativeEvent.touches, timestamp);

  const event = {
    changedTouches,
    touches,
    pageX: nativeEvent.pageX,
    pageY: nativeEvent.pageY,
    preventDefault,
    stopImmediatePropagation,
    stopPropagation,
    target: nativeEvent.target,
    timestamp,
    _event: nativeEvent,
  };

  //RW 是否需要设置 changedTouches[0] 或 touches[0] 到nativeEvent上
  const touch0 = changedTouches[0];
  if (touch0) {
    event.identifier = touch0.identifier;
    event.pageX = touch0.pageX;
    event.pageY = touch0.pageY;
    event.locationX = touch0.locationX;
    event.locationY = touch0.locationY;
  }

  return event;
}

function normalizeMouseEvent(nativeEvent) {
  const timestamp = nativeEvent.timestamp || Date.now();
  const touches = [{
    clientX: nativeEvent.clientX,
    clientY: nativeEvent.clientY,
    force: nativeEvent.force,
    locationX: nativeEvent.clientX,
    locationY: nativeEvent.clientY,
    identifier: 0,
    pageX: nativeEvent.pageX,
    pageY: nativeEvent.pageY,
    screenX: nativeEvent.screenX,
    screenY: nativeEvent.screenY,
    target: nativeEvent.target,
    timestamp,
  }];
  return {
    changedTouches: touches,
    touches: (nativeEvent.type === 'mouseup') ? [] : touches,
    identifier: 0,
    locationX: nativeEvent.offsetX,
    locationY: nativeEvent.offsetY,
    pageX: nativeEvent.pageX,
    pageY: nativeEvent.pageY,
    preventDefault,
    stopImmediatePropagation,
    stopPropagation,
    target: nativeEvent.target,
    _event: nativeEvent,
  };
}

function normalizeResponderNativeEvent(nativeEvent) {
  //console.log('normalizeResponderNativeEvent start', nativeEvent);
  const mouse = nativeEvent.type && nativeEvent.type.indexOf('mouse') >= 0;
  return mouse ? normalizeMouseEvent(nativeEvent) : normalizeTouchEvent(nativeEvent);
}

module.exports = normalizeResponderNativeEvent;
