import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  Alert,
  FlatList,
  InteractionManager,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { PreferencesContext } from "../../Theming";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Post, PostProps } from "../components/Post";
import * as firebase from "firebase";
import { IconButton, Menu, withTheme } from "react-native-paper";
import { RoomProps } from "../components/Classes";

interface state {
  posts: firebase.default.firestore.QueryDocumentSnapshot<PostProps>[];
  menuVisible: boolean;
  loading: boolean;
}

class Home extends React.Component<any, state> {
  constructor(props: any) {
    super(props);
    this.state = {
      posts: [],
      menuVisible: false,
      loading: false,
    };
  }

  static contextType = PreferencesContext;

  componentDidMount() {
    firebase.default.auth().onAuthStateChanged(async (user) => {
      if (user) {
        this.loadPosts(user);
      } else {
        this.setState({ posts: [] });
      }
    });
  }

  loadPosts = async (user?: firebase.default.User | null) => {
    this.setState({ loading: true, posts: [] });
    if (!user) user = await firebase.default.auth().currentUser;
    let db = firebase.default.firestore().collection("users");
    let result = await db.doc(user?.uid).collection("contacts").get();
    let docs = result.docs as firebase.default.firestore.QueryDocumentSnapshot<RoomProps>[];
    docs.forEach(async (item) => {
      let resultItem = await db
        .doc(item.data().userUID)
        .collection("posts")
        .orderBy("time")
        .limitToLast(5)
        .get();
      let arr = resultItem.docs as firebase.default.firestore.QueryDocumentSnapshot<PostProps>[];
      this.setState({ posts: [...this.state.posts, ...arr] });
    });
    this.setState({ loading: false });
  };

  sortPosts = () => {
    this.state.posts.sort((itemFirst, itemSecond) => {
      return -(
        itemFirst.data().time.toMillis() - itemSecond.data().time.toMillis()
      );
    });
  };

  updateStatusSignOut = async () => {
    let user = await firebase.default.auth().currentUser;
    await firebase.default
      .firestore()
      .collection("users")
      .doc(user?.uid)
      .update({
        online: false,
      });
    firebase.default.auth().signOut();
  };

  render() {
    const colors = this.props.theme.colors;
    const { isThemeDark } = this.context;
    const activeColor = isThemeDark ? colors.primary : colors.text;
    const openMenu = () => this.setState({ menuVisible: true });
    const closeMenu = () => this.setState({ menuVisible: false });
    const openRegisterWindow = () => {
      this.props.navigation.navigate("Register");
      this.setState({ menuVisible: false });
    };
    const openLoginWindow = () => {
      this.props.navigation.navigate("Login");
      this.setState({ menuVisible: false });
    };
    const openSettingsWindow = () => {
      this.props.navigation.navigate("Settings");
      this.setState({ menuVisible: false });
    };

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          title="Home"
          right={
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Menu
                anchor={
                  <IconButton
                    icon="dots-vertical"
                    onPress={openMenu}
                    color={activeColor}
                    size={21}
                  />
                }
                contentStyle={{ backgroundColor: colors.surface }}
                visible={this.state.menuVisible}
                onDismiss={closeMenu}>
                <Menu.Item title="Register" onPress={openRegisterWindow} />
                <Menu.Item
                  title={
                    firebase.default.auth().currentUser ? "Logout" : "Login"
                  }
                  onPress={
                    firebase.default.auth().currentUser
                      ? this.updateStatusSignOut
                      : openLoginWindow
                  }
                />
                <Menu.Item title="Settings" onPress={openSettingsWindow} />
              </Menu>
            </View>
          }
        />
        <FlatList
          data={this.state.posts}
          renderItem={({ item }) => <Post {...item.data()} />}
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={this.loadPosts}
              progressBackgroundColor={colors.surface}
              colors={[colors.accent]}
            />
          }
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 0.25,
                backgroundColor: colors.accent,
                width: "90%",
                alignSelf: "center",
              }}></View>
          )}
        />
      </SafeAreaView>
    );
  }
}

export default withTheme(Home);
