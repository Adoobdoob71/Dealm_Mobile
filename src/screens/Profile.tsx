import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  Dimensions,
} from "react-native";
import { IconButton, useTheme, withTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { Header } from "../components/Header";
import * as firebase from "firebase";
import { User } from "../components/Classes";

interface state {
  userDetails: User | null;
}
class Profile extends React.Component<any, state> {
  constructor(props: any) {
    super(props);
    this.state = {
      userDetails: null,
    };
  }

  static contextType = PreferencesContext;

  loadUserDetails = () => {
    firebase.default.auth().onAuthStateChanged(async (user) => {
      if (user) {
        let result = await firebase.default
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get();
        let userData: User = result.data() as User;
        this.setState({ userDetails: userData });
      } else this.setState({ userDetails: null });
    });
  };

  render() {
    const colors = this.props.theme.colors;
    const { isThemeDark } = this.context;
    const navigation = this.props.navigation;
    const activeColor = isThemeDark ? colors.primary : colors.text;

    const openCreatePostWindow = () =>
      this.props.navigation.navigate("CreatePost");
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          title="Profile"
          right={
            <IconButton
              icon="plus"
              size={18}
              color={activeColor}
              onPress={openCreatePostWindow}
            />
          }
        />
      </SafeAreaView>
    );
  }
}

export default withTheme(Profile);
