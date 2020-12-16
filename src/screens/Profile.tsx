import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { Header } from "../components/Header";
import * as firebase from "firebase";
import { User } from "../components/Classes";

function Profile() {
  const { isThemeDark } = React.useContext(PreferencesContext);
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [nickname, setNickname] = React.useState<string>("");

  const activeColor = isThemeDark ? colors.primary : colors.text;
  React.useEffect(() => {
    firebase.default.auth().onAuthStateChanged(async (user) => {
      if (user) {
        let result = await firebase.default
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get();
        let userData: User = result.data() as User;
        setNickname(userData.nickname);
      } else setNickname("My Profile");
    });
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="Profile"
        subTitle={nickname}
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
