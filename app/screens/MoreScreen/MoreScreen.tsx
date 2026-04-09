import React from 'react';
import { ScrollView } from 'react-native';
import { useStyled } from 'hooks';
import { Text } from 'components';

import styles from './MoreScreen.styles';

export const MoreScreen: React.FC = () => {
  const { colors } = useStyled();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <Text>More</Text>
    </ScrollView>
  );
};
