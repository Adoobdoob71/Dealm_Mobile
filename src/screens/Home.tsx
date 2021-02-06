import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  Alert,
  FlatList,
  InteractionManager,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
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
  flatList:
    | FlatList<firebase.default.firestore.QueryDocumentSnapshot<PostProps>>
    | null
    | undefined;
  focusListener: any;

  componentDidMount() {
    firebase.default.auth().onAuthStateChanged(async (user) => {
      if (user) {
        this.loadPosts();
        this.sortPosts();
      } else {
        this.setState({ posts: [] });
      }
    });
    this.focusListener = this.props.navigation.addListener("tabPress", () => {
      if (this.state.posts.length != 0)
        this.flatList?.scrollToIndex({ index: 0, animated: true });
    });
  }

  loadPosts = async () => {
    let user = firebase.default.auth().currentUser;
    this.setState({ loading: true, posts: [] });
    if (user) {
      let db = firebase.default.firestore().collection("users");
      let result = await db
        .doc(user?.uid)
        .collection("posts")
        .orderBy("time", "desc")
        .limit(5)
        .get();
      let docs = result.docs as firebase.default.firestore.QueryDocumentSnapshot<PostProps>[];
      this.setState({ posts: docs });
      let result_two = await db.doc(user?.uid).collection("contacts").get();
      let docs_two = result_two.docs as firebase.default.firestore.QueryDocumentSnapshot<RoomProps>[];
      docs_two.forEach(async (item) => {
        let resultItem = await db
          .doc(item.data().userUID)
          .collection("posts")
          .orderBy("time", "desc")
          .limit(5)
          .get();
        let arr = resultItem.docs as firebase.default.firestore.QueryDocumentSnapshot<PostProps>[];
        this.setState({ posts: [...this.state.posts, ...arr] });
      });
    } else {
    }
    this.setState({ loading: false });
  };

  sortPosts = () => {
    this.setState({
      posts: this.state.posts.sort((itemFirst, itemSecond) => {
        return (
          itemFirst.data().time.toMillis() - itemSecond.data().time.toMillis()
        );
      }),
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
    const openSettingsWindow = () => {
      this.props.navigation.navigate("Settings");
      this.setState({ menuVisible: false });
    };
    const openLoginWindow = () => {
      this.props.navigation.navigate("Login");
      this.setState({ menuVisible: false });
    };
    const styles = StyleSheet.create({
      mainView: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      },
      hello: {
        fontSize: 32,
        color: colors.primary,
        fontWeight: "bold",
      },
      there: {
        fontSize: 32,
        color: colors.accent,
        fontWeight: "bold",
      },
      message: {
        fontSize: 18,
        color: colors.text,
        marginVertical: 24,
      },
    });
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          title="Dealm"
          right={
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {Platform.OS === "web" && (
                <IconButton
                  icon="refresh"
                  onPress={this.loadPosts}
                  size={21}
                  color={activeColor}
                />
              )}
              <Menu
                anchor={
                  <IconButton
                    icon="dots-vertical"
                    onPress={openMenu}
                    color={activeColor}
                    size={21}
                  />
                }
                contentStyle={{
                  backgroundColor: colors.surface,
                  // borderWidth: 0.25,
                  // borderColor: colors.accent,
                }}
                visible={this.state.menuVisible}
                onDismiss={closeMenu}>
                {firebase.default.auth().currentUser === null && (
                  <Menu.Item title="Register" onPress={openRegisterWindow} />
                )}
                <Menu.Item title="Settings" onPress={openSettingsWindow} />
              </Menu>
            </View>
          }
        />
        {firebase.default.auth().currentUser ? (
          <FlatList
            data={this.state.posts}
            ref={(ref) => (this.flatList = ref)}
            renderItem={({ item }) => <Post {...item.data()} key={item.id} />}
            refreshControl={
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={this.loadPosts}
                progressBackgroundColor={colors.surface}
                colors={[colors.accent]}
              />
            }
            refreshing={this.state.loading}
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
        ) : (
          <View style={styles.mainView}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}>
              <Text style={styles.hello}>Hello </Text>
              <Text style={styles.there}>There</Text>
            </View>
            <Button
              mode="full"
              onPress={openLoginWindow}
              text="Sign in"
              icon="chevron-right"
              style={{ marginTop: 24 }}
            />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

export default withTheme(Home);
