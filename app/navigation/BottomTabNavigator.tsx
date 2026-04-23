import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MoreStackNavigator } from './MoreStackNavigator';
import { VisionStackNavigator } from './VisionStackNavigator';
import { HearingStackNavigator } from './HearingStackNavigator';
import { ChatStackNavigator } from './ChatStackNavigator';
import { Platform } from 'react-native';
import { useStyled } from 'hooks';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { colors } = useStyled();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.surfaceSecondary,
        },
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.onSurface,
      }}
    >
      <Tab.Screen
        name="Chat"
        options={{
          title: 'Chat',
          headerShown: false,
          tabBarIcon: Platform.select({
            ios: {
              type: 'sfSymbol',
              name: 'bubble.fill',
            },
            android: {
              type: 'materialSymbol',
              name: 'chat',
            },
          }),
        }}
        component={ChatStackNavigator}
      />
      <Tab.Screen
        name="Vision"
        options={{
          headerShown: false,
          tabBarIcon: Platform.select({
            ios: {
              type: 'sfSymbol',
              name: 'camera.fill',
            },
            android: {
              type: 'materialSymbol',
              name: 'photo_camera',
            },
          }),
        }}
        component={VisionStackNavigator}
      />
      <Tab.Screen
        name="Hearing"
        options={{
          headerShown: false,
          tabBarIcon: Platform.select({
            ios: {
              type: 'sfSymbol',
              name: 'ear.fill',
            },
            android: {
              type: 'materialSymbol',
              name: 'hearing',
            },
          }),
        }}
        component={HearingStackNavigator}
      />
      <Tab.Screen
        name="More"
        options={{
          headerShown: false,
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
        component={MoreStackNavigator}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
