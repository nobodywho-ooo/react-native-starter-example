import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { EnrichedMarkdownText } from 'react-native-enriched-markdown';
import { Prompt } from 'react-native-nobodywho';
import { useStyled, useThemeMode } from 'hooks';
import { Text, Button } from 'components';
import { useAiService } from 'services';
import { devLog, getAssetPath, getMarkdownStyle } from 'helpers';
import { useTabBarBottomPadding } from 'hooks';

import styles from './HearingScreen.styles';

export const HearingScreen: React.FC = () => {
  const { colors } = useStyled();
  const { isDarkMode } = useThemeMode();
  const paddingBottom = useTabBarBottomPadding();
  const { visionHearingChat } = useAiService();
  const [result, setResult] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const transcribe = useCallback(async () => {
    const activeChat = visionHearingChat.current;
    if (!activeChat) return;

    setResult('');
    setIsStreaming(true);
    try {
      const audioPath = await getAssetPath('audio.mp3');
      const prompt = new Prompt([
        Prompt.Text('Tell me what you hear in the audio. Transcribe'),
        Prompt.Audio(audioPath),
      ]);
      let accumulated = '';
      for await (const token of activeChat.ask(prompt)) {
        accumulated += token;
        setResult(accumulated);
      }
    } catch (error) {
      devLog('HearingScreen error', error);
    } finally {
      setIsStreaming(false);
    }
  }, [visionHearingChat]);

  const markdownStyle = useMemo(
    () => getMarkdownStyle(isDarkMode, colors.onSurface),
    [isDarkMode, colors.onSurface],
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          paddingBottom: paddingBottom,
        },
      ]}
    >
      <Text variant="h3">Transcribe audio.mp3</Text>
      <Button
        style={styles.button}
        title={isStreaming ? 'Getting speech...' : 'Get speech'}
        variant="primary"
        onPress={transcribe}
        disabled={isStreaming}
      />
      {isStreaming && result === '' ? (
        <ActivityIndicator size="large" style={styles.spinner} />
      ) : (
        <EnrichedMarkdownText
          containerStyle={styles.markdownContainer}
          markdown={result}
          markdownStyle={markdownStyle}
        />
      )}
    </ScrollView>
  );
};
