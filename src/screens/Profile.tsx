import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  Dimensions,
} from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { Header } from "../components/Header";
import * as firebase from "firebase";
import { User } from "../components/Classes";

function Profile() {
  const { isThemeDark } = React.useContext(PreferencesContext);
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [user, setUser] = React.useState<User | null>(null);

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
        setUser(userData);
      } else setUser(null);
    });
  }, []);
  return <SafeAreaView style={{ flex: 1 }}></SafeAreaView>;
}

export { Profile };
