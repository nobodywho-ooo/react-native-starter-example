import { StyleSheet } from 'react-native';

export const TICK_HEIGHT = 12;
export const DOT_SIZE = 16;

export default StyleSheet.create({
  axisContainer: {
    height: TICK_HEIGHT,
    justifyContent: 'center',
  },
  lineContainer: {
    height: 2,
  },
  tickContainer: {
    position: 'absolute',
    top: 0,
    width: 2,
    height: TICK_HEIGHT,
    marginLeft: -1,
  },
  dotContainer: {
    position: 'absolute',
    top: (TICK_HEIGHT - DOT_SIZE) / 2,
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    marginLeft: -DOT_SIZE / 2,
  },
  labelsContainer: {
    flexDirection: 'row',
    paddingTop: 8,
  },
  label: {
    flex: 1,
  },
});
