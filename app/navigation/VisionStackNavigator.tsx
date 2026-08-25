import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { isLiquidGlassSupported } from '@callstack/liquid-glass';
import { useStyled } from 'hooks';
import { AiModelState, useAiService } from 'services';
import { VisionScreen, ErrorScreen, LoadingScreen } from 'screens';

const Stack = createNativeStackNavigator();

export const VisionStackNavigator = () => {
  const { colors } = useStyled();
  const { visionHearingChatState, createVisionHearingChat } = useAiService();

  const initVisionChat = useCallback(async () => {
    await createVisionHearingChat();
  }, [createVisionHearingChat]);

  useEffect(() => {
    initVisionChat();
  }, [initVisionChat]);

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
        name="VisionScreen"
        options={{
          title: 'Vision',
          headerLargeTitleEnabled: true,
        }}
      >
        {() => {
          switch (visionHearingChatState) {
            case AiModelState.Ready:
              return <VisionScreen />;
            case AiModelState.Error:
              return <ErrorScreen onRetry={initVisionChat} />;
            default:
              return <LoadingScreen />;
          }
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
