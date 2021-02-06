import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { List, useTheme, Switch, IconButton } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { Header } from "../components/Header";
import * as firebase from "firebase";

function Settings() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);
  const styles = StyleSheet.create({});
  const navigateBack = () => navigation.goBack();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        left={
          <IconButton
            icon="arrow-left"
            color={isThemeDark ? colors.primary : colors.text}
            size={24}
            onPress={navigateBack}
          />
        }
        title="Settings"
      />
      <ScrollView>
        <List.Section>
          <List.Subheader>Account</List.Subheader>
          <List.Item
            title="Account Details"
            description="Change account details"
            onPress={() => {}}
            left={() => <List.Icon icon="account" />}
          />
          <List.Item
            title="Logout"
            description="Logout of your account"
            onPress={() => firebase.default.auth().signOut()}
            left={() => <List.Icon icon="delete" color={colors.error} />}
          />
        </List.Section>
        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          <List.Item
            title="Secondary Color"
            description="Change the secondary color of the app"
            onPress={() => {}}
            left={() => <List.Icon icon="palette" />}
          />
          <List.Item
            title="Theme"
            description="Change the theme of the application"
            left={() => <List.Icon icon="theme-light-dark" />}
            right={() => (
              <Switch
                thumbColor={colors.primary}
                value={isThemeDark}
                onValueChange={toggleTheme}
              />
            )}
          />
        </List.Section>
        <List.Section>
          <List.Subheader>Notifications</List.Subheader>
          <List.Item
            title="Notification color"
            description="Change the light up color"
            onPress={() => {}}
            left={() => <List.Icon icon="bell" />}
          />
        </List.Section>
      </ScrollView>
    </SafeAreaView>
  );
}

export { Settings };
