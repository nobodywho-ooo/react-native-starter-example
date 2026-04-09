import { Theme } from '../types/Theme.types';

export const lightColors = {
  surface: '#FFFFFF',
  surfaceSecondary: '#FFFFFF',
  onSurface: '#000000',
  surfaceContainer: '#ebebeb',
  primary: '#628395',
  border: '#9f9f9f',
  shadow: 'rgba(44, 44, 44, 0.33)',
};

export const darkColors = {
  surface: '#121212',
  surfaceSecondary: '#2d2d2d',
  onSurface: '#FFFFFF',
  surfaceContainer: '#3c3c3c',
  primary: '#628395',
  border: '#cacaca',
  shadow: 'rgba(244, 244, 244, 0.48)',
};

export const getColors = (theme: Theme) => {
  return theme === 'light' ? lightColors : darkColors;
};
