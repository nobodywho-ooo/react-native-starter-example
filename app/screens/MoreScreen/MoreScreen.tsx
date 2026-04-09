import React from 'react';
import { ScrollView } from 'react-native';
import { useStyled } from 'hooks';
import { ListItem } from 'components';

import styles from './MoreScreen.styles';

export const MoreScreen: React.FC = () => {
  const { colors } = useStyled();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <ListItem
        title="Embeddings"
        subtitle="Use embeddings to find the relevant documents"
        iosIconName="document.fill"
        androidIconName="article"
        iconBackgroundColor="#5856D6"
        onPress={() => {}}
      />
      <ListItem
        title="RAG"
        subtitle="Demonstrate a two-stage retrieval system using RAG"
        iosIconName="magnifyingglass"
        androidIconName="search"
        iconBackgroundColor="#FF9500"
        onPress={() => {}}
      />
    </ScrollView>
  );
};
