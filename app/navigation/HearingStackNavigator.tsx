import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { isLiquidGlassSupported } from '@callstack/liquid-glass';
import { useStyled } from 'hooks';
import { AiModelState, useAiService } from 'services';
import { HearingScreen, ErrorScreen, LoadingScreen } from 'screens';

const Stack = createNativeStackNavigator();

export const HearingStackNavigator = () => {
  const { colors } = useStyled();
  const { visionHearingChatState, createVisionHearingChat } = useAiService();

  const initHearingChat = useCallback(async () => {
    await createVisionHearingChat();
  }, [createVisionHearingChat]);

  useEffect(() => {
    initHearingChat();
  }, [initHearingChat]);

  return (
    <Stack.Navigator
      screenOptions={{
        ...(!isLiquidGlassSupported && {
          headerStyle: { backgroundColor: colors.surface },
        }),
        headerTintColor: colors.onSurface,
        headerTitleStyle: { color: colors.onSurface },
        headerLargeTitleStyle: { color: colors.onSurface },
      }}
    >
      <Stack.Screen
        name="HearingScreen"
        options={{
          title: 'Hearing',
          headerLargeTitleEnabled: true,
        }}
      >
        {() => {
          switch (visionHearingChatState) {
            case AiModelState.Ready:
              return <HearingScreen />;
            case AiModelState.Error:
              return <ErrorScreen onRetry={initHearingChat} />;
            default:
              return <LoadingScreen />;
          }
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
