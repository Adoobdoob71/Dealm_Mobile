import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Login } from "../screens/Login";
import { BottomNavigator } from "./BottomNavigator";
import { Settings } from "../screens/Settings";
import { Register } from "../screens/Register";
import { CreatePost } from "../screens/CreatePost";
import Chat from "../screens/Chat";
import { Search } from "../screens/Search";
import PostScreen from "../screens/PostScreen";
import CreateComment from "../screens/CreateComment";
import Profile from "../screens/Profile";
import ImageScreen from "../screens/ImageScreen";
import Share from "../screens/Share";
import About from "../screens/About";

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
      <Stack.Screen
        name="CreatePost"
        component={CreatePost}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={Chat}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchScreen"
        component={Search}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PostScreen"
        component={PostScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateComment"
        component={CreateComment}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ImageScreen"
        component={ImageScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShareScreen"
        component={Share}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AboutScreen"
        component={About}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export { StackNavigator };
