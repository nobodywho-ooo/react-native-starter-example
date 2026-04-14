import React, { useCallback } from 'react';
import { Image, ScrollView } from 'react-native';
import { useStyled } from 'hooks';
import { Text, Button } from 'components';
import { useAiService } from 'services';
import { Prompt } from 'react-native-nobodywho';
import { getAssetPath } from 'helpers';

import styles from './VisionScreen.styles';

export const VisionScreen: React.FC = () => {
  const { colors } = useStyled();
  const { visionChat } = useAiService();

  const analyse = useCallback(async () => {
    try {
      const imagePath = await getAssetPath('image-1.png');
      const prompt = new Prompt([
        Prompt.Text('What do you see in this image?'),
        Prompt.Image(imagePath),
      ]);
      console.log('analyse...');
      const response = await visionChat.current?.ask(prompt).completed();
      console.log('response', response);
    } catch (error) {
      console.log('error', error);
    }
  }, [visionChat]);

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
        onPress={analyse}
      />
    </ScrollView>
  );
};
