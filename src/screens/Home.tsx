import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { Alert, SafeAreaView, Text, View } from "react-native";
import { PreferencesContext } from "../../Theming";
import { Button } from "../components/Button";
import { Header } from "../components/Header";

function Home() {
  const { toggleTheme } = React.useContext(PreferencesContext);
  const navigation = useNavigation();
  const openLoginWindow = () => navigation.navigate("Login");
  const openSettingsWindow = () => navigation.navigate("Settings");
  const openRegisterWindow = () => navigation.navigate("Register");
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Home" />
      <Button
        mode="full"
        text="Settings"
        onPress={openSettingsWindow}
        style={{ alignSelf: "center", marginTop: 48 }}
      />
      <Button
        mode="bordered"
        text="Login"
        onPress={openLoginWindow}
        style={{ alignSelf: "center", marginTop: 32 }}
      />
      <Button
        mode="text"
        text="Button"
        onPress={openRegisterWindow}
        style={{ alignSelf: "center", marginTop: 32 }}
      />
    </SafeAreaView>
  );
}

export { Home };
