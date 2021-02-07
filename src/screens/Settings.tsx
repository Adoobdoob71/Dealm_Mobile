import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { List, useTheme, Switch, IconButton } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { Header } from "../components/Header";
import * as firebase from "firebase";
import { Alert } from "../components/Alert";

function Settings() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);
  const [alertMessage, setAlertMessage] = React.useState<string | null>(null);
  const navigateBack = () => navigation.goBack();
  const dismissAlert = () => setAlertMessage(null);
  const openRegisterWindow = () => navigation.navigate("Register");
  const openLoginWindow = () => navigation.navigate("Login");
  const signOut = async () => {
    try {
      await firebase.default
        .firestore()
        .collection("users")
        .doc(firebase.default.auth().currentUser?.uid)
        .update({
          online: false,
          lastOnline: firebase.default.firestore.Timestamp.now(),
        });
      firebase.default.auth().signOut();
      setAlertMessage("Successfully signed out of account");
      setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
    } catch (error) {
      setAlertMessage(error.message);
      setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
    }
  };
  return (
    <>
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
              title="Register"
              description="Create a new account"
              onPress={openRegisterWindow}
              left={() => <List.Icon icon="account-plus" color={colors.text} />}
            />
            <List.Item
              title={firebase.default.auth().currentUser ? "Logout" : "Login"}
              description={
                firebase.default.auth().currentUser
                  ? "Logout of your account"
                  : "Login into your account"
              }
              onPress={
                firebase.default.auth().currentUser ? signOut : openLoginWindow
              }
              left={() => (
                <List.Icon
                  icon={
                    firebase.default.auth().currentUser ? "delete" : "login"
                  }
                  color={colors.text}
                />
              )}
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
      {alertMessage && (
        <Alert message={alertMessage} action={true} onPress={dismissAlert} />
      )}
    </>
  );
}

export { Settings };
