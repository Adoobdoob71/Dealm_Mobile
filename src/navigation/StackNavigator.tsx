import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Login } from '../screens/Login/Login';
import { BottomNavigator } from './BottomNavigator';
import { Settings } from '../screens/Settings/Settings';

const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="BottomNavigator">
      <Stack.Screen name="BottomNavigator" component={BottomNavigator} options={{ headerShown: false }}/>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  )
}

export {
  StackNavigator
}