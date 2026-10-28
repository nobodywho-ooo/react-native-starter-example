import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { EnrichedMarkdownText } from 'react-native-enriched-markdown';
import { Message } from 'react-native-nobodywho';
import { MaterialSymbol, SFSymbol } from '@react-navigation/native';
import { getContentText, getMarkdownStyle, isIOS } from 'helpers';
import { useStyled, useThemeMode } from 'hooks';
import { MessageStats } from 'types';
import { Text } from '../Text/Text';

import styles from './MessageListItem.styles';

interface MessageListItemComponentProps {
  message: Message;
  index: number;
  stats?: MessageStats;
  isStreaming: boolean;
  isAudioLoading: boolean;
  isPlaying: boolean;
  onPlay: (index: number, text: string) => void;
  onStop: () => void;
}

const MessageListItemComponent: React.FC<MessageListItemComponentProps> = ({
  message,
  index,
  stats,
  isStreaming,
  isAudioLoading,
  isPlaying,
  onPlay,
  onStop,
}) => {
  const { role } = message;
  const content = getContentText(message.content);
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
  const onToggleTts = () => (isPlaying ? onStop() : onPlay(index, content));

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
          <View style={styles.footer}>
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
            {stats && (
              <Text
                variant="caption"
                style={{ color: colors.onSurfaceVariant }}
              >
                {`${stats.tokensPerSecond.toFixed(1)} tok/s · ${Math.round(
                  stats.timeToFirstTokenMs,
                )} ms`}
              </Text>
            )}
          </View>
        )
      )}
    </>
  );
};

const MessageListItem = React.memo(MessageListItemComponent);

export { MessageListItem };
