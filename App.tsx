import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import BottomTabNavigator from './app/navigation/BottomTabNavigator';
import { StatusBar } from 'react-native';

export default function App() {
  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    </>
  );
}
