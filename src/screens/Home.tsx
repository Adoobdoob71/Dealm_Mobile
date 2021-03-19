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
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { PreferencesContext } from "../../Theming";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Post, PostProps } from "../components/Post";
import * as firebase from "firebase";
import { IconButton, Menu, withTheme } from "react-native-paper";
import { RoomProps } from "../components/Classes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Linking from "expo-linking";

interface state {
  posts: firebase.default.firestore.QueryDocumentSnapshot<PostProps>[];
  menuVisible: boolean;
  loading: boolean;
  contacts: string[];
}

class Home extends React.Component<any, state> {
  constructor(props: any) {
    super(props);
    this.state = {
      posts: [],
      menuVisible: false,
      loading: false,
      contacts: [],
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
      this.setState({ posts: [] });
      await this.loadPosts();
      this.sortPosts();
    });
    this.focusListener = this.props.navigation.addListener("tabPress", () => {
      if (this.state.posts.length != 0)
        this.flatList?.scrollToIndex({ index: 0, animated: true });
    });
    Linking.addEventListener("url", async (result) =>
      this.openPost(result.url)
    );
    Linking.getInitialURL().then((result) => this.openPost(result));
  }

  openPost = async (url: string | null) => {
    if (url) {
      let { path, queryParams } = Linking.parse(url);
      switch (path) {
        case "post":
          if (queryParams) {
            let data = await firebase.default
              .firestore()
              .collection("posts")
              .doc(queryParams.id)
              .get();
            let postData = data.data() as PostProps;
            this.props.navigation.navigate("PostScreen", { ...postData });
          }
          break;
      }
    }
  };

  loadPosts = async () => {
    let user = firebase.default.auth().currentUser;
    this.setState({ loading: true, posts: [] });
    if (user) {
      let result = await firebase.default
        .firestore()
        .collection("users")
        .doc(user.uid)
        .collection("contacts")
        .get();
      let docs = result.docs as firebase.default.firestore.QueryDocumentSnapshot<RoomProps>[];
      docs.forEach((item) =>
        this.setState({
          contacts: [...this.state.contacts, item.data().userUID],
        })
      );
      this.setState({ contacts: [...this.state.contacts, user.uid] });
      let postsResult = await firebase.default
        .firestore()
        .collection("posts")
        .where("userUID", "in", this.state.contacts)
        .get();
      this.setState({
        posts: postsResult.docs as firebase.default.firestore.QueryDocumentSnapshot<PostProps>[],
      });
    } else {
      let postsResult = await firebase.default
        .firestore()
        .collection("posts")
        .get();
      this.setState({
        posts: postsResult.docs as firebase.default.firestore.QueryDocumentSnapshot<PostProps>[],
      });
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
    const openSearchPostWindow = () =>
      this.props.navigation.navigate("SearchPost");
    const styles = StyleSheet.create({
      mainView: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      },
      searchButtonView: {
        flex: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.background,
      },
      searchButtonPlaceholder: {
        fontSize: 14,
        color: colors.placeholder,
        marginHorizontal: 16,
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
              <IconButton
                icon="magnify"
                onPress={openSearchPostWindow}
                size={21}
                color={activeColor}
              />
            </View>
          }
        />
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
      </SafeAreaView>
    );
  }
}

export default withTheme(Home);
