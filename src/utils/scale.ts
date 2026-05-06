import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// 기준 디자인 사이즈 (iPhone 14 Plus 기준)
const BASE_WIDTH = 430;
const BASE_HEIGHT = 932;

// 가로/세로 비율
const widthScale = width / BASE_WIDTH;
const heightScale = height / BASE_HEIGHT;

// 가로 기준 스케일
export const scale = (size: number) => {
  return size * widthScale;
};

// 세로 기준 스케일
export const verticalScale = (size: number) => {
  return size * heightScale;
};

// 너무 과하게 커지거나 작아지는 것 방지
export const moderateScale = (
  size: number,
  factor = 0.5,
) => {
  return size + (scale(size) - size) * factor;
};