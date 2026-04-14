import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { isLiquidGlassSupported } from '@callstack/liquid-glass';
import { MoreStackNavigator } from './MoreStackNavigator';
import { VisionStackNavigator } from './VisionStackNavigator';
import { ChatStackNavigator } from './ChatStackNavigator';
import { Platform } from 'react-native';
import { useStyled } from 'hooks';
import { useTheme } from 'context';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { colors } = useStyled();
  const theme = useTheme();

  let tabBarInactiveTintColor = '#828282';
  let tabBarActiveTintColor = colors.primary;

  if (theme == 'dark') {
    tabBarInactiveTintColor = '#9e9e9e';
    tabBarActiveTintColor = '#e8e8e8';
  }

  return (
    <Tab.Navigator
      screenOptions={{
        ...(!isLiquidGlassSupported && {
          tabBarActiveTintColor: tabBarActiveTintColor,
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
              name: 'home',
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
