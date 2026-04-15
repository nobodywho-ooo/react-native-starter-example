import { StyleSheet } from 'react-native';

import { Layout } from 'style';

export default StyleSheet.create({
  container: {
    ...Layout.container,
    paddingTop: 24,
  },
  document: { paddingTop: 8 },
  button: { marginTop: 16, marginBottom: 16 },
  spinner: {
    alignSelf: 'center',
    paddingVertical: 24,
  },
  queryLabel: { paddingTop: 8, fontStyle: 'italic' },
  bestMatch: { paddingTop: 8, fontWeight: '600' },
});
