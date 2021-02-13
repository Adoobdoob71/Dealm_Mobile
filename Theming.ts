import * as React from 'react';
import { DefaultTheme, DarkTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/src/types';

// Light Theme - White
const LightAppTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#ff8e71",
    accent: "#ffaa9c",
    surface: "#FFFFFF",
    backdrop: "#00000088",
    placeholder: "#959595",
  }
} 

// Dark theme - Purple
// const DarkAppTheme : Theme = {
//   ...DarkTheme,
//   colors: {
//     ...DarkTheme.colors,
//     primary: "#ff8e71",
//     accent: "#ce93d8",
//     surface: "#3b264f",
//     background: "#352247",
//     backdrop: "#00000088",
//     placeholder: "#959595",
//   }
// }

// Dark theme - Black
const DarkAppTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#ff8e71",
    accent: "#ffaa9c",
    surface: "#202020",
    background: "#151515",
    backdrop: "#00000088",
    placeholder: "#959595",
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