export function getOpacity (index, current, displayQuantityOfSide) {
    if (index === current) return 1;

    // Handle opacity
    let depth = displayQuantityOfSide - Math.abs (current - index);

    switch (depth) {
      case 1:
        return 0.95;
      case 2:
        return 0.92;
      case 3:
        return 0.9;
      default:
        return 0.5;
    }
  }