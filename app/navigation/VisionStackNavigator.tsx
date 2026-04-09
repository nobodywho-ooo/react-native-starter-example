import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { isLiquidGlassSupported } from '@callstack/liquid-glass';
import { VisionScreen } from '../screens';
import { useStyled } from 'hooks';

const Stack = createNativeStackNavigator();

export const VisionStackNavigator = () => {
  const { colors } = useStyled();

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
        component={VisionScreen}
        options={{
          title: 'Vision',
          headerLargeTitleEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};
