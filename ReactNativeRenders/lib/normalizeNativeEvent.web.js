/**
 * @providesModule normalizeNativeEvent
 */

'use strict';
// Mobile Safari re-uses touch objects, so we copy the properties we want and normalize the identifier
const normalizeTouches = (touches = []) => Array.prototype.slice.call(touches).map((touch) => {
  const identifier = touch.identifier > 20 ? (touch.identifier % 20) : touch.identifier;

  const rect = touch.target && touch.target.getBoundingClientRect();
  const locationX = touch.pageX - rect.left;
  const locationY = touch.pageY - rect.top;

  return {
    _normalized: true,
    clientX: touch.clientX,
    clientY: touch.clientY,
    force: touch.force,
    locationX: locationX,
    locationY: locationY,
    identifier: identifier,
    pageX: touch.pageX,
    pageY: touch.pageY,
    radiusX: touch.radiusX,
    radiusY: touch.radiusY,
    rotationAngle: touch.rotationAngle,
    screenX: touch.screenX,
    screenY: touch.screenY,
    target: touch.target,
    // normalize the timestamp
    // https://stackoverflow.com/questions/26177087/ios-8-mobile-safari-wrong-timestamp-on-touch-events
    timestamp: Date.now()
  };
});

function normalizeTouchEvent(nativeEvent) {
  const changedTouches = normalizeTouches(nativeEvent.changedTouches);
  const touches = normalizeTouches(nativeEvent.touches);

  // 浏览器的nativeEvent pageX locationX ... 没有
  //console.log('normalizeTouchEvent ', nativeEvent, nativeEvent.pageX, nativeEvent.identifier, nativeEvent.locationX);

  const event = {
    _normalized: true,
    changedTouches,
    pageX: nativeEvent.pageX,
    pageY: nativeEvent.pageY,
    preventDefault: nativeEvent.preventDefault.bind(nativeEvent),
    stopImmediatePropagation: nativeEvent.stopImmediatePropagation.bind(nativeEvent),
    stopPropagation: nativeEvent.stopPropagation.bind(nativeEvent),
    target: nativeEvent.target,
    // normalize the timestamp
    // https://stackoverflow.com/questions/26177087/ios-8-mobile-safari-wrong-timestamp-on-touch-events
    timestamp: Date.now(),
    touches
  };

  //RW 是否需要设置 changedTouches[0] 或 touches[0] 到nativeEvent上
  var touch = changedTouches[0];
  if (touch) {
    event.identifier = touch.identifier;
    event.pageX = touch.pageX;
    event.pageY = touch.pageY;
    event.locationX = touch.locationX;
    event.locationY = touch.locationY;
  }

  return event;
}

function normalizeMouseEvent(nativeEvent) {
  const touches = [{
    _normalized: true,
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
    timestamp: Date.now(),
  }];
  return {
    _normalized: true,
    changedTouches: touches,
    identifier: touches[0].identifier,
    locationX: nativeEvent.offsetX,
    locationY: nativeEvent.offsetY,
    pageX: nativeEvent.pageX,
    pageY: nativeEvent.pageY,
    preventDefault: nativeEvent.preventDefault.bind(nativeEvent),
    stopImmediatePropagation: nativeEvent.stopImmediatePropagation.bind(nativeEvent),
    stopPropagation: nativeEvent.stopPropagation.bind(nativeEvent),
    target: nativeEvent.target,
    timestamp: touches[0].timestamp,
    touches: (nativeEvent.type === 'mouseup') ? [] : touches,
  };
}

function normalizeNativeEvent(nativeEvent) {
  //console.log('normalizeNativeEvent start', nativeEvent);
  if (nativeEvent._normalized) {
    return nativeEvent;
  }
  const mouse = nativeEvent.type && nativeEvent.type.indexOf('mouse') >= 0;
  return mouse ? normalizeMouseEvent(nativeEvent) : normalizeTouchEvent(nativeEvent);
}

module.exports = normalizeNativeEvent;
