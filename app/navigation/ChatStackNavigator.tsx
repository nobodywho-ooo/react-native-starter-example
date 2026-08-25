import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useStyled } from 'hooks';
import { AiModelState, useAiService } from 'services';
import { ChatScreen, ErrorScreen, LoadingScreen } from 'screens';

const Stack = createNativeStackNavigator();

export const ChatStackNavigator = () => {
  const { colors } = useStyled();
  const { chatState, createChat } = useAiService();

  const initChat = useCallback(async () => {
    await createChat();
  }, [createChat]);

  useEffect(() => {
    initChat();
  }, [initChat]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.onSurface,
        headerTitleStyle: { color: colors.onSurface },
      }}
    >
      <Stack.Screen name="ChatScreen" options={{ title: 'Chat' }}>
        {() => {
          switch (chatState) {
            case AiModelState.Ready:
              return <ChatScreen />;
            case AiModelState.Error:
              return <ErrorScreen onRetry={initChat} />;
            default:
              return <LoadingScreen />;
          }
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
