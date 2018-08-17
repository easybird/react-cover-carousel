function isYDirectionBiggerThanX({deltaY, deltaX}) {
  return Math.max (Math.abs (deltaY), Math.abs (deltaX)) === Math.abs (deltaY);
}

export const DIRECTION_TYPE = {
  Y: 'Y',
  X: 'X',
};

export const DIRECTION = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right'
}

export function calculateMaxDelta({deltaY, deltaX}) {
  return isYDirectionBiggerThanX ({deltaX, deltaY}) ? deltaY : deltaX;
}

export function calculateDirectionType({deltaY, deltaX}) {
  return isYDirectionBiggerThanX ({deltaX, deltaY})
    ? {type: DIRECTION_TYPE.Y, value: deltaY, direction: Math.sign(deltaY) === -1 ? DIRECTION.UP : DIRECTION.DOWN}
    : {type: DIRECTION_TYPE.X, value: deltaX, direction: Math.sign(deltaX) === -1 ? DIRECTION.LEFT : DIRECTION.RIGHT};
}
