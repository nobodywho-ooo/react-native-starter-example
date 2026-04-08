import React from 'react';
import { View, StyleSheet, Text, ViewStyle, StyleProp } from 'react-native';
import { AiMessage, AiRole } from 'interfaces';
import { useStyled } from 'hooks';

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
      <Text style={[styles.text, { color: colors.onSurface }]}>{content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 12,
    maxWidth: '85%',
    alignSelf: 'flex-end',
    borderRadius: 16,
  },
  assistantContainer: {
    marginVertical: 12,
    marginTop: 10,
    alignItems: 'flex-start',
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
});

export { MessageListItem };
