import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import { AiMessage, AiRole } from 'interfaces';
import { MessageListItem } from 'components';

export const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<AiMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec commodo leo malesuada mollis egestas. Phasellus viverra sodales felis, ac posuere sapien iaculis in. Suspendisse tempor quis felis vitae malesuada. Sed mi urna, finibus non cursus vel, lacinia nec lectus. Donec sed lorem at magna tempus faucibus vulputate eu est. Nunc vel consectetur enim, vitae consectetur tellus. Aliquam porttitor arcu a egestas lacinia.',
        role: AiRole.user,
      },
      {
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec commodo leo malesuada mollis egestas. Phasellus viverra sodales felis, ac posuere sapien iaculis in. Suspendisse tempor quis felis vitae malesuada. Sed mi urna, finibus non cursus vel, lacinia nec lectus. Donec sed lorem at magna tempus faucibus vulputate eu est. Nunc vel consectetur enim, vitae consectetur tellus. Aliquam porttitor arcu a egestas lacinia. In commodo vehicula diam vel volutpat. Vestibulum et porta metus. Sed non consectetur nisi. Phasellus pellentesque nisi vitae neque interdum blandit. Vestibulum sodales mi in sem ultrices aliquam. Pellentesque ultricies nisi vel sagittis sollicitudin. Fusce magna augue, malesuada id maximus in, euismod id elit. Nulla ac aliquam lectus. Duis tincidunt nisl nulla, quis feugiat dui euismod eu. ',
        role: AiRole.assistant,
      },
    ]);
  }, []);

  if (messages.length == 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Start a chat</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={messages}
      style={styles.listContainer}
      renderItem={({ item, index }) => <MessageListItem message={item} />}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  listContainer: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
});
