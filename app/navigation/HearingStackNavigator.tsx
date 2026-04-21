import * as React from 'react';
import { useCallback, useEffect, useMemo } from 'react';
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

  const ErrorScreenWithRetry = useMemo(
    () => () => <ErrorScreen onRetry={initHearingChat} />,
    [initHearingChat],
  );

  let Screen = LoadingScreen;

  switch (visionHearingChatState) {
    case AiModelState.Ready:
      Screen = HearingScreen;
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
        name="HearingScreen"
        component={Screen}
        options={{
          title: 'Hearing',
          headerLargeTitleEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};
