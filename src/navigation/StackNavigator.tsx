import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Login } from "../screens/Login";
import { BottomNavigator } from "./BottomNavigator";
import { Settings } from "../screens/Settings";
import { Register } from "../screens/Register";

const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="BottomNavigator">
      <Stack.Screen
        name="BottomNavigator"
        component={BottomNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export { StackNavigator };
