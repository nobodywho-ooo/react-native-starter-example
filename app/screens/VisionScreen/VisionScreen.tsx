import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView } from 'react-native';
import { useStyled } from 'hooks';
import { Text, Button } from 'components';
import { useAiService } from 'services';
import { Prompt } from 'react-native-nobodywho';
import { getAssetPath } from 'helpers';

import styles from './VisionScreen.styles';

export const VisionScreen: React.FC = () => {
  const { colors } = useStyled();
  const { visionChat } = useAiService();
  const [result, setResult] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const analyse = useCallback(async () => {
    const activeChat = visionChat.current;
    if (!activeChat) return;

    setResult('');
    setIsStreaming(true);
    try {
      const imagePath = await getAssetPath('image-1.png');
      const prompt = new Prompt([
        Prompt.Text('What do you see in this image?'),
        Prompt.Image(imagePath),
      ]);
      let accumulated = '';
      for await (const token of activeChat.ask(prompt)) {
        accumulated += token;
        setResult(accumulated);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsStreaming(false);
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
      <Text variant="h3">Analyze & Describe</Text>
      <Text style={styles.subHeader}>
        Find out what the model can see in the image.
      </Text>
      <Button
        style={styles.button}
        title={isStreaming ? 'Analyzing...' : 'Analyze'}
        variant="primary"
        onPress={analyse}
        disabled={isStreaming}
      />
      {isStreaming && result === '' ? (
        <ActivityIndicator size="large" style={styles.spinner} />
      ) : (
        <Text style={styles.imageDescriptionText}>{result}</Text>
      )}
    </ScrollView>
  );
};
