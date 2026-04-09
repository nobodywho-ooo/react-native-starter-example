import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { AiMessage, AiRole } from 'interfaces';
import { useStyled } from 'hooks';
import { Text } from '../Text/Text';

import styles from './MessageListItem.styles';

interface MessageListItemProps {
  message: AiMessage;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ message }) => {
  const { content, role } = message;
  const { colors } = useStyled();
  let container: StyleProp<ViewStyle> = {};

  if (role == AiRole.user) {
    container = [
      styles.userContainer,
      { backgroundColor: colors.surfaceContainer },
    ];
  } else if (role == AiRole.assistant) {
    container = styles.assistantContainer;
  }

  return (
    <View style={container}>
      <Text style={styles.text}>{content}</Text>
    </View>
  );
};

export { MessageListItem };
