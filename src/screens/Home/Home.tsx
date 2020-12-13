import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { PreferencesContext } from '../../../Theming';
import { Button } from '../../components/Button';


function Home(){
  const { toggleTheme } = React.useContext(PreferencesContext);
  const navigation = useNavigation();
  const openLoginWindow = () => navigation.navigate("Login");
  const openSettingsWindow = () => navigation.navigate("Settings");
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button mode="full" text="Login" onPress={openLoginWindow} icon="chevron-right"/>
      <Button mode="bordered" text="Settings" onPress={openSettingsWindow} icon="cog" style={{ marginTop: 12 }}/>
    </SafeAreaView>
  )
}

export {
  Home
}