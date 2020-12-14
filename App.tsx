import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-native-paper';
import { StackNavigator } from './src/navigation/StackNavigator';
import { DarkAppTheme, LightAppTheme, PreferencesContext } from './Theming';
import { StatusBar } from 'expo-status-bar';
import * as firebase from 'firebase';
import { Appearance } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyChey4oljhd6lxuyd_VfbvFcPW6MwfZPTE",
  authDomain: "dealm-85e42.firebaseapp.com",
  projectId: "dealm-85e42",
  storageBucket: "dealm-85e42.appspot.com",
  messagingSenderId: "891093598191",
  appId: "1:891093598191:web:18777dd9d7de0bb5ce001a",
  measurementId: "G-LVPRQYHN21"
};
firebase.default.initializeApp(firebaseConfig);

export default function App(){

  const [isThemeDark, setIsThemeDark] = React.useState<boolean>(true);
  let theme = isThemeDark ? DarkAppTheme : LightAppTheme;

  const toggleTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);
  
  const preferencers = React.useMemo(() => ({
    toggleTheme, 
    isThemeDark
  }), [toggleTheme, isThemeDark]);

  if (Appearance.getColorScheme() === "dark")
    toggleTheme();
  return (
    <>
      <StatusBar backgroundColor={theme.colors.background} translucent={false} animated style={isThemeDark ? "light" : "dark"}/>
      <PreferencesContext.Provider value={preferencers}>  
        <NavigationContainer theme={theme}>
          <Provider theme={theme}>
            <StackNavigator />
          </Provider>
        </NavigationContainer>
      </PreferencesContext.Provider>
    </>
  )
}

