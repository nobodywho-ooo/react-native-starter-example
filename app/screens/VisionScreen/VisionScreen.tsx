import React from 'react';
import { Image, ScrollView } from 'react-native';
import { useStyled } from 'hooks';
import { Text, Button } from 'components';

import styles from './VisionScreen.styles';

export const VisionScreen: React.FC = () => {
  const { colors } = useStyled();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <Image
        source={require('../../../assets/image-1.png')}
        style={styles.image}
        resizeMode="cover"
      />
      <Text variant="h3">Analyze & describe pictures.</Text>
      <Text style={styles.info}>
        Find out what the model can see in the image.
      </Text>
      <Button
        style={styles.button}
        title="Analyze"
        variant="primary"
        onPress={() => {}}
      />
    </ScrollView>
  );
};
