import React from 'react';
import { View } from 'react-native';
import { EnrichedMarkdownText } from 'react-native-enriched-markdown';
import { Message, Role } from 'react-native-nobodywho';
import { useStyled } from 'hooks';
import { Text } from '../Text/Text';

import styles from './MessageListItem.styles';

interface MessageListItemProps {
  message: Message;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ message }) => {
  const { content, role } = message.inner;
  const { colors } = useStyled();

  if (role == Role.User) {
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

  return (
    <EnrichedMarkdownText
      containerStyle={styles.assistantContainer}
      markdown={content}
    />
  );
};

export { MessageListItem };
