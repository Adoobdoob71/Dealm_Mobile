import * as React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import AnimatedTabBar, {
  TabsConfig,
  BubbleTabBarItemConfig,
} from "@gorhom/animated-tabbar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Home from "../screens/Home";
import Contacts from "../screens/Contacts";
import Profile from "../screens/Profile";
import { useTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { Alert, AppState, AppStateStatus } from "react-native";
import * as firebase from "firebase";

const Tab = createMaterialBottomTabNavigator();

export default function BottomNavigator() {
  const { colors } = useTheme();
  const { isThemeDark } = React.useContext(PreferencesContext);
  const activeColor = isThemeDark ? colors.primary : colors.text;
  const [appState, setAppState] = React.useState<AppStateStatus>(
    AppState.currentState
  );

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    const user = await firebase.default.auth().currentUser;
    if (nextAppState === "active") {
      firebase.default.firestore().collection("users").doc(user?.uid).update({
        online: true,
      });
    } else {
      firebase.default.firestore().collection("users").doc(user?.uid).update({
        online: false,
        lastOnline: firebase.default.firestore.Timestamp.now(),
      });
    }
    setAppState(nextAppState);
  };

  React.useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
  }, []);

  return (
    <Tab.Navigator
      barStyle={{ backgroundColor: colors.surface }}
      shifting={true}
      activeColor={activeColor}
      inactiveColor={colors.disabled}
      initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? "home-variant" : "home-variant-outline"}
              color={focused ? activeColor : colors.disabled}
              size={21}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={Contacts}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account-multiple" : "account-multiple-outline"}
              color={focused ? activeColor : colors.disabled}
              size={21}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        initialParams={{
          bottomNavigator: true,
        }}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account" : "account-outline"}
              color={focused ? activeColor : colors.disabled}
              size={21}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export { BottomNavigator };
