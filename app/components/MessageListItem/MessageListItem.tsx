import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { EnrichedMarkdownText } from 'react-native-enriched-markdown';
import { Message } from 'react-native-nobodywho';
import { MaterialSymbol, SFSymbol } from '@react-navigation/native';
import { getMarkdownStyle, isIOS } from 'helpers';
import { useStyled, useThemeMode } from 'hooks';
import { Text } from '../Text/Text';

import styles from './MessageListItem.styles';

interface MessageListItemProps {
  message: Message;
  isStreaming: boolean;
  isAudioLoading: boolean;
  isPlaying: boolean;
  onToggleTts: () => void;
}

const MessageListItem: React.FC<MessageListItemProps> = ({
  message,
  isStreaming,
  isAudioLoading,
  isPlaying,
  onToggleTts,
}) => {
  const { content, role } = message;
  const { colors } = useStyled();
  const { isDarkMode } = useThemeMode();

  const markdownStyle = useMemo(
    () => getMarkdownStyle(isDarkMode, colors.onSurface),
    [isDarkMode, colors.onSurface],
  );

  if (role === 'user') {
    return (
      <View
        style={[
          styles.userContainer,
          { backgroundColor: colors.surfaceContainer },
        ]}
      >
        <Text style={styles.text}>{content}</Text>
      </View>
    );
  }

  const iconTtsColor = isStreaming ? colors.primaryDisabled : colors.primary;

  return (
    <>
      <EnrichedMarkdownText
        containerStyle={styles.assistantContainer}
        markdown={content}
        markdownStyle={markdownStyle}
      />
      {isAudioLoading ? (
        <ActivityIndicator style={styles.activityIndicator} />
      ) : (
        content !== '' && (
          <Pressable onPress={!isStreaming ? onToggleTts : undefined}>
            {isIOS ? (
              <SFSymbol
                name={isPlaying ? 'stop.circle' : 'speaker.wave.3.fill'}
                size={16}
                color={iconTtsColor}
              />
            ) : (
              <MaterialSymbol
                name={isPlaying ? 'stop_circle' : 'volume_up'}
                size={16}
                color={iconTtsColor}
              />
            )}
          </Pressable>
        )
      )}
    </>
  );
};

export { MessageListItem };
