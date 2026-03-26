import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { ChatScreen, MoreScreen } from '../screens';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
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

const moreOptionsIOS: BottomTabNavigationOptions = {
  tabBarIcon: {
    type: 'sfSymbol',
    name: 'heart',
  },
};

const moreOptionsAndroid: BottomTabNavigationOptions = {
  tabBarIcon: {
    type: 'materialSymbol',
    name: 'more_horiz',
  },
};

export default BottomTabNavigator;
