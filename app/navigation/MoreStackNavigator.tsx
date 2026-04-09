import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MoreScreen } from '../screens';
import { useStyled } from 'hooks';

const Stack = createNativeStackNavigator();

export const MoreStackNavigator = () => {
  const { colors } = useStyled();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.onSurface,
      }}
    >
      <Stack.Screen
        name="MoreScreen"
        component={MoreScreen}
        options={{
          title: 'More',
          headerLargeTitleEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};
