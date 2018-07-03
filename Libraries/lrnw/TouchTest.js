'use strict';

const EVENTS = [
  'onStartShouldSetResponderCapture',
  'onMoveShouldSetResponderCapture',
  'onStartShouldSetResponder',
  'onMoveShouldSetResponder',
  'onResponderGrant',
  'onResponderMove',
  'onResponderReject',
  'onResponderRelease',
  'onResponderTerminate',
  'onResponderTerminationRequest',

  'onTouchStartCapture',
  'onTouchMoveCapture',
  'onTouchStart',
  'onTouchMove',
  'onTouchCancel',
  'onTouchEnd',
];

module.exports = {
  assignLog(obj, tag) {
    let ret = Object.assign({}, obj);
    return EVENTS.reduce((prev, cur) => {
      prev[cur] = (e) => {
        let result;
        if (obj[cur]) {
          result = obj[cur](e);
        }
        console.log(`${tag} ${cur} ${e.type} ret:${result}`);
        return result;
      };
      return prev;
    }, ret);
  },
};
