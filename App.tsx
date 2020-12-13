import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-native-paper';
import { StackNavigator } from './src/navigation/StackNavigator';
import { DarkAppTheme, LightAppTheme, PreferencesContext } from './Theming';
import { StatusBar } from 'expo-status-bar';

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

