import * as React from 'react';
import { DefaultTheme, DarkTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/src/types';

const LightAppTheme : Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#F18F01",
    accent: "#EE6352",
    surface: "#FFFFFF"
  }
} 

const DarkAppTheme : Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#F18F01",
    accent: "#EE6352",
    surface: "#181818"
  }
}

const PreferencesContext = React.createContext({
  toggleTheme: () => {},
  isThemeDark: false
})

export {
  LightAppTheme,
  DarkAppTheme,
  PreferencesContext
}