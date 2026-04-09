import { StyleSheet } from 'react-native';

import { Layout } from 'style';

export default StyleSheet.create({
  container: {
    ...Layout.container,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 12,
  },
});
