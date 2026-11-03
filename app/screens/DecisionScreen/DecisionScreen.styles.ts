import { StyleSheet } from 'react-native';

import { Layout } from 'style';

export default StyleSheet.create({
  container: {
    ...Layout.container,
    paddingTop: 24,
  },
  scrollContentContainer: { paddingBottom: 32 },
  textInputContainer: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: { marginTop: 16, marginBottom: 8 },
  spinnerContainer: {
    marginTop: 16,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { paddingTop: 16, paddingBottom: 8 },
  error: { paddingTop: 8 },
  duration: { paddingTop: 24 },
});
