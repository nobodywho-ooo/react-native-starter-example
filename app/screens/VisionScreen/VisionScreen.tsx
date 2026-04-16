import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView } from 'react-native';
import { EnrichedMarkdownText } from 'react-native-enriched-markdown';
import { Prompt } from 'react-native-nobodywho';
import { useStyled } from 'hooks';
import { Text, Button } from 'components';
import { useAiService } from 'services';
import { devLog, getAssetPath } from 'helpers';
import { useTabBarBottomPadding } from 'hooks';

import styles from './VisionScreen.styles';

export const VisionScreen: React.FC = () => {
  const { colors } = useStyled();
  const paddingBottom = useTabBarBottomPadding();
  const { visionChat } = useAiService();
  const [result, setResult] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const analyse = useCallback(async () => {
    const activeChat = visionChat.current;
    if (!activeChat) return;

    setResult('');
    setIsStreaming(true);
    try {
      const image1Path = await getAssetPath('image-1.png');
      const image2Path = await getAssetPath('image-2.png');
      const prompt = new Prompt([
        Prompt.Text('Tell me what you see in the first image.'),
        Prompt.Image(image1Path),
        Prompt.Text('Also tell me what you see in the second image.'),
        Prompt.Image(image2Path),
      ]);
      let accumulated = '';
      for await (const token of activeChat.ask(prompt)) {
        accumulated += token;
        setResult(accumulated);
      }
    } catch (error) {
      devLog('VisionScreen error', error);
    } finally {
      setIsStreaming(false);
    }
  }, [visionChat]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          marginBottom: paddingBottom,
        },
      ]}
    >
      <Image
        source={require('../../../assets/image-1.png')}
        style={styles.image}
        resizeMode="cover"
      />
      <Image
        source={require('../../../assets/image-2.png')}
        style={styles.image}
        resizeMode="cover"
      />
      <Text variant="h3">Analyze & Describe</Text>
      <Text style={styles.subHeader}>
        Find out what the model can see in the images.
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
        <EnrichedMarkdownText
          containerStyle={styles.markdownContainer}
          markdown={result}
        />
      )}
    </ScrollView>
  );
};
