import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { Header } from "../components/Header";

function Profile() {
  const { isThemeDark } = React.useContext(PreferencesContext);
  const { colors } = useTheme();
  const navigation = useNavigation();
  const activeColor = isThemeDark ? colors.primary : colors.text;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="Profile"
        subTitle="My profile"
        left={
          <IconButton
            icon="account-outline"
            color={activeColor}
            size={24}
            onPress={() => {}}
          />
        }
      />
    </SafeAreaView>
  );
}

export { Profile };
