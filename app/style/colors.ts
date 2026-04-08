import { Theme } from '../types/theme';

export const lightColors = {
  surface: '#FFFFFF',
  onSurface: '#000000',
  surfaceContainer: '#ebebeb',
  primary: '#628395',
};

export const darkColors = {
  surface: '#121212',
  onSurface: '#FFFFFF',
  surfaceContainer: '#3c3c3c',
  primary: '#628395',
};

export const getColors = (theme: Theme) => {
  return theme === 'light' ? lightColors : darkColors;
};
