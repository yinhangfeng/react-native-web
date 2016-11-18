'use strict';

const transformNumberProperties = {
  translateX: true,
  translateY: true,
  translateZ: true,
};

// { scale: 2 } => 'scale(2)'
function mapTransform(transform) {
  const key = Object.keys(transform)[0];
  let value = transform[key];
  if (transformNumberProperties[key] && typeof value === 'number') {
    value = value + 'px';
  }
  return `${key}(${value})`;
}

// [1,2,3,4,5,6] => 'matrix3d(1,2,3,4,5,6)'
function convertTransformMatrix(transformMatrix) {
  var matrix = transformMatrix.join(',');
  return `matrix3d(${matrix})`;
}

// [
//   {scaleX: 2},
//   {scaleY: 2}
// ] => scaleX(2) scaleY(2)
function convertTransform(transform) {
  return transform.map(mapTransform).join(' ');
}

module.exports = {
  convertTransform,
  convertTransformMatrix,
};
