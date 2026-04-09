import React from 'react';
import { ScrollView } from 'react-native';
import { useStyled } from 'hooks';
import { Text, Button } from 'components';

import styles from './EmbeddingsScreen.styles';

export const EmbeddingsScreen: React.FC = () => {
  const { colors } = useStyled();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <Text>EmbeddingsScreen</Text>
    </ScrollView>
  );
};
