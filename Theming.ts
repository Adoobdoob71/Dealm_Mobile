import * as React from 'react';
import { DefaultTheme, DarkTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/src/types';

const LightAppTheme : Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#ff8e71",
    accent: "#ffba93",
    surface: "#FFFFFF"
  }
} 

const DarkAppTheme : Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#ff8e71",
    accent: "#ffba93",
    surface: "#3b264f",
    background: "#352247",

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