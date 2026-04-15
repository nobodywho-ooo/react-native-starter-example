import * as React from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { isLiquidGlassSupported } from '@callstack/liquid-glass';
import { useStyled } from 'hooks';
import { AiModelState, useAiService } from 'services';
import { VisionScreen, ErrorScreen, LoadingScreen } from '../screens';

const Stack = createNativeStackNavigator();

export const VisionStackNavigator = () => {
  const { colors } = useStyled();
  const { visionChatState, createVisionChat } = useAiService();

  const initVisionChat = useCallback(async () => {
    await createVisionChat();
  }, [createVisionChat]);

  useEffect(() => {
    initVisionChat();
  }, [initVisionChat]);

  const ErrorScreenWithRetry = useMemo(
    () => () => <ErrorScreen onRetry={initVisionChat} />,
    [initVisionChat],
  );

  let Screen = LoadingScreen;

  switch (visionChatState) {
    case AiModelState.Ready:
      Screen = VisionScreen;
      break;
    case AiModelState.Error:
      Screen = ErrorScreenWithRetry;
      break;
    default:
      Screen = LoadingScreen;
  }

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
        component={Screen}
        options={{
          title: 'Vision',
          headerLargeTitleEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};
