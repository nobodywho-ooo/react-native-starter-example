import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { isLiquidGlassSupported } from '@callstack/liquid-glass';
import { ChatScreen, MoreScreen } from '../screens';
import { Platform } from 'react-native';
import { useStyled } from 'hooks';
import { useTheme } from 'context';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { colors } = useStyled();
  const theme = useTheme();

  let tabBarInactiveTintColor = '#434343';
  let tabBarActiveTintColor = colors.primary;

  if (theme == 'dark') {
    tabBarInactiveTintColor = '#9e9e9e';
    tabBarActiveTintColor = '#e8e8e8';
  }

  return (
    <Tab.Navigator
      screenOptions={{
        ...(!isLiquidGlassSupported && {
          tabBarActiveTintColor,
          tabBarInactiveTintColor,
        }),
        tabBarStyle: {
          backgroundColor: colors.surfaceSecondary,
        },
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.onSurface,
      }}
    >
      <Tab.Screen
        options={{
          title: 'Chat',
          headerShown: true,
          tabBarIcon: Platform.select({
            ios: {
              type: 'sfSymbol',
              name: 'bubble.fill',
            },
            android: {
              type: 'materialSymbol',
              name: 'home',
            },
          }),
        }}
        name="Chat"
        component={ChatScreen}
      />
      <Tab.Screen
        options={{
          title: 'More',
          headerShown: true,
          tabBarIcon: Platform.select({
            ios: {
              type: 'sfSymbol',
              name: 'ellipsis.circle.fill',
            },
            android: {
              type: 'materialSymbol',
              name: 'more_horiz',
            },
          }),
        }}
        name="More"
        component={MoreScreen}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
