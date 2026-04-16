import React, { useEffect, useState } from 'react';
import { FlatList, View, Platform, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Message, Role } from 'react-native-nobodywho';
import { InputBar, MessageListItem, Text } from 'components';
import { useStyled, useTabBarBottomPadding } from 'hooks';
import { useAiService } from 'services';

import styles from './ChatScreen.styles';

const INPUT_BAR_BOTTOM_GAP = 14;

export const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const { colors } = useStyled();
  const { chat: currentChat } = useAiService();
  const insets = useSafeAreaInsets();
  // Use useBottomTabBarHeight when available, see https://github.com/react-navigation/react-navigation/discussions/12949?sort=new
  const paddingBottom = useTabBarBottomPadding();
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

  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || isGenerating) return;

    const chat = currentChat.current;

    if (!chat) {
      return;
    }

    const userMessage = new Message.Message({
      role: Role.User,
      content: trimmed,
      assets: [],
    });
    const initialAssistantMessage = new Message.Message({
      role: Role.Assistant,
      content: '',
      assets: [],
    });

    setMessages(prev => [...prev, userMessage, initialAssistantMessage]);
    setInputText('');
    Keyboard.dismiss();
    setIsGenerating(true);

    try {
      // Accumulate tokens and replace the last (assistant) message on each
      // one — messages are immutable (Message.inner is frozen), so we rebuild.
      let accumulated = '';
      for await (const token of chat.ask(trimmed)) {
        accumulated += token;
        setMessages(prev => {
          const next = [...prev];
          next[next.length - 1] = new Message.Message({
            role: Role.Assistant,
            content: accumulated,
            assets: [],
          });
          return next;
        });
      }
    } catch (error) {
      console.error('Chat generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const bottomOffset = isKeyboardVisible
    ? keyboardHeight +
      (Platform.OS === 'android' ? insets.bottom : 0) +
      INPUT_BAR_BOTTOM_GAP
    : paddingBottom + INPUT_BAR_BOTTOM_GAP;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          {!isKeyboardVisible && (
            <Text style={{ color: colors.onSurface }}>Start a chat</Text>
          )}
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
