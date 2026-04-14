import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
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
  let container: StyleProp<ViewStyle> = {};

  if (role === Role.User) {
    container = [
      styles.userContainer,
      { backgroundColor: colors.surfaceContainer },
    ];
  } else if (role === Role.Assistant) {
    container = styles.assistantContainer;
  }

  return (
    <View style={container}>
      <Text style={styles.text}>{content}</Text>
    </View>
  );
};

export { MessageListItem };
