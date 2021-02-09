import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-native-paper";
import { StackNavigator } from "./src/navigation/StackNavigator";
import { DarkAppTheme, LightAppTheme, PreferencesContext } from "./Theming";
import { StatusBar } from "expo-status-bar";
import * as firebase from "firebase";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "./firebaseconfig";

if (firebase.default.apps.length === 0)
  firebase.default.initializeApp(firebaseConfig);

export default function App() {
  const [isThemeDark, setIsThemeDark] = React.useState<boolean>(false);
  let theme = isThemeDark ? DarkAppTheme : LightAppTheme;

  React.useEffect(() => {
    loadTheme().then((result) => {
      setIsThemeDark(result === "dark" ? true : false);
    });
  }, []);

  const loadTheme = async () => {
    let result = await AsyncStorage.getItem("theme-status");
    return result;
  };

  const toggleTheme = React.useCallback(async () => {
    await AsyncStorage.setItem("theme-status", isThemeDark ? "light" : "dark");
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferencers = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark]
  );

  if (Appearance.getColorScheme() === "dark") toggleTheme();
  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.background}
        translucent={false}
        animated
        style={isThemeDark ? "light" : "dark"}
      />
      <PreferencesContext.Provider value={preferencers}>
        <NavigationContainer theme={theme}>
          <Provider theme={theme}>
            <StackNavigator />
          </Provider>
        </NavigationContainer>
      </PreferencesContext.Provider>
    </>
  );
}
