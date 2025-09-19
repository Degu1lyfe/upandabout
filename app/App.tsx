import React from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';

const MyTheme: Theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#ffffff' }
};

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}
