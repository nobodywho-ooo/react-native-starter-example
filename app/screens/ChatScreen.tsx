import React, { useEffect, useState } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  Platform,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AiMessage, AiRole } from 'interfaces';
import { InputBar, MessageListItem } from 'components';
import { useStyled } from 'hooks';

const _bottomPadding = 8;

export const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { colors } = useStyled();
  const insets = useSafeAreaInsets();
  // Use useBottomTabBarHeight when available, see https://github.com/react-navigation/react-navigation/discussions/12949?sort=new
  const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 49 : 80;
  const isKeyboardVisible = keyboardHeight > 0;

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, e => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

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

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, { content: trimmed, role: AiRole.user }]);
    setInputText('');
    Keyboard.dismiss();
  };

  const bottomOffset = isKeyboardVisible
    ? keyboardHeight +
      (Platform.OS === 'android' ? insets.bottom : 0) +
      _bottomPadding
    : TAB_BAR_HEIGHT + insets.bottom + _bottomPadding;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ color: colors.onSurface }}>Start a chat</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          style={styles.listContainer}
          contentContainerStyle={[styles.listContent, { paddingBottom: 70 }]}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <MessageListItem message={item} />}
          keyboardDismissMode="interactive"
        />
      )}
      <InputBar
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
        style={{ bottom: bottomOffset }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  listContent: {
    paddingVertical: 12,
  },
});
