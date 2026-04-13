import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, Platform, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AiMessage, AiRole } from 'interfaces';
import { InputBar, MessageListItem } from 'components';
import { useStyled } from 'hooks';

import styles from './ChatScreen.styles';

const _bottomPadding = 8;

export const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { colors } = useStyled();
  const insets = useSafeAreaInsets();
  // Use useBottomTabBarHeight when available, see https://github.com/react-navigation/react-navigation/discussions/12949?sort=new
  const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 50 : 80;
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
      AiMessage.message({
        role: AiRole.user,
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec commodo leo malesuada mollis egestas. Phasellus viverra sodales felis, ac posuere sapien iaculis in. Suspendisse tempor quis felis vitae malesuada. Sed mi urna, finibus non cursus vel, lacinia nec lectus. Donec sed lorem at magna tempus faucibus vulputate eu est. Nunc vel consectetur enim, vitae consectetur tellus. Aliquam porttitor arcu a egestas lacinia.',
      }),
      AiMessage.message({
        role: AiRole.assistant,
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec commodo leo malesuada mollis egestas. Phasellus viverra sodales felis, ac posuere sapien iaculis in. Suspendisse tempor quis felis vitae malesuada. Sed mi urna, finibus non cursus vel, lacinia nec lectus. Donec sed lorem at magna tempus faucibus vulputate eu est. Nunc vel consectetur enim, vitae consectetur tellus. Aliquam porttitor arcu a egestas lacinia. In commodo vehicula diam vel volutpat. Vestibulum et porta metus. Sed non consectetur nisi. Phasellus pellentesque nisi vitae neque interdum blandit. Vestibulum sodales mi in sem ultrices aliquam. Pellentesque ultricies nisi vel sagittis sollicitudin. Fusce magna augue, malesuada id maximus in, euismod id elit. Nulla ac aliquam lectus. Duis tincidunt nisl nulla, quis feugiat dui euismod eu. ',
      }),
    ]);
  }, []);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    setMessages(prev => [
      ...prev,
      AiMessage.message({ role: AiRole.user, content: trimmed }),
    ]);
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
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: bottomOffset + InputBar.height },
          ]}
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
