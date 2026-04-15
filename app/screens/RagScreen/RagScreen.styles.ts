import { StyleSheet } from 'react-native';

import { Layout } from 'style';

export default StyleSheet.create({
  container: {
    ...Layout.container,
    paddingTop: 24,
  },
  button: { marginTop: 16, marginBottom: 16 },
  spinner: {
    alignSelf: 'center',
    paddingVertical: 24,
  },
  paragraph: { paddingTop: 8 },
});
