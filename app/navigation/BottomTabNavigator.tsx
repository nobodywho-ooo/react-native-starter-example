import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ChatScreen, MoreScreen } from '../screens';
import { Platform } from 'react-native';
import { useStyled } from 'hooks';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { colors } = useStyled();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
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
