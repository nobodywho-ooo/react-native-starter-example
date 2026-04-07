import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AiMessage, AiRole } from 'interfaces';

interface MessageListItemProps {
  message: AiMessage;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ message }) => {
  const { content, role } = message;
  let container = {};

  if (role == AiRole.user) {
    container = styles.userContainer;
  } else if (role == AiRole.assistant) {
    container = styles.assistantContainer;
  }

  return (
    <View style={container}>
      <Text>{content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 12,
    maxWidth: '85%',
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-end',
    borderRadius: 16,
  },
  assistantContainer: {
    marginVertical: 12,
    marginTop: 10,
    alignItems: 'flex-start',
  },
});

export { MessageListItem };
