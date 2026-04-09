import { StyleSheet } from 'react-native';

import { Layout } from 'style';

export default StyleSheet.create({
  container: {
    ...Layout.container,
    paddingTop: 24,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  info: { paddingTop: 16 },
  button: { marginTop: 16 },
});
