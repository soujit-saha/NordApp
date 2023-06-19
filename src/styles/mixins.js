import {Dimensions, PixelRatio} from 'react-native';

const {width, height} = Dimensions.get('window');
const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];
const guidelineBaseWidth = 414;
const guidelineBaseHeight = 896;

const horizontalFactor = shortDimension / guidelineBaseWidth;
const verticalFactor = longDimension / guidelineBaseHeight;

export const horizontalScale = size => horizontalFactor * size;
export const verticalScale = size => verticalFactor * size;

export function moderateScale(size, factor = 0.5) {
  if (size < 0) {
    const horizontalDifference = horizontalScale(size) - size;
    return size + horizontalDifference * factor;
  }

  const horizontalDifference = horizontalScale(size) - size;
  return horizontalDifference > 0
    ? size + horizontalDifference * factor
    : size + horizontalDifference * (factor + 1);
}

export const scaleFont = size => size * PixelRatio.getFontScale();

function dimensions(top, right = top, bottom = top, left = right, property) {
  const styles = {};

  styles[`${property}Top`] = top;
  styles[`${property}Right`] = right;
  styles[`${property}Bottom`] = bottom;
  styles[`${property}Left`] = left;

  return styles;
}

export function margin(top, right, bottom, left) {
  return dimensions(top, right, bottom, left, 'margin');
}

export function padding(top, right, bottom, left) {
  return dimensions(top, right, bottom, left, 'padding');
}

export function boxShadow(
  color,
  offset = {height: 2, width: 2},
  radius = 8,
  opacity = 0.2,
) {
  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: radius,
  };
}
