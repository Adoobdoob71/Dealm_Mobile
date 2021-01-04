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
import { IconButton, Menu, useTheme } from "react-native-paper";
import { RoomProps } from "../components/Classes";

function Home() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const openLoginWindow = () =>
    InteractionManager.runAfterInteractions(() => {
      closeMenu();
      navigation.navigate("Login");
    });
  const openSettingsWindow = () =>
    InteractionManager.runAfterInteractions(() => {
      closeMenu();
      navigation.navigate("Settings");
    });
  const openRegisterWindow = () =>
    InteractionManager.runAfterInteractions(() => {
      closeMenu();
      navigation.navigate("Register");
    });
  const openCreatePostWindow = () =>
    InteractionManager.runAfterInteractions(() => {
      closeMenu();
      navigation.navigate("CreatePost");
    });
  const [posts, setPosts] = React.useState<
    firebase.default.firestore.QueryDocumentSnapshot<PostProps>[]
  >([]);
  const { isThemeDark } = React.useContext(PreferencesContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
  const activeColor = isThemeDark ? colors.primary : colors.text;
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const loadPosts = async (user?: firebase.default.User | null) => {
    setLoading(true);
    posts.splice(0, posts.length);
    setPosts([]);
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
      posts.push(...arr);
      setPosts(posts);
    });
    setLoading(false);
  };

  React.useEffect(() => {
    firebase.default.auth().onAuthStateChanged(async (user) => {
      if (user) {
        loadPosts(user);
      } else {
        setPosts([]);
      }
    });
  }, []);

  React.useEffect(() => {
    let sortedArr = posts.sort((itemFirst, itemSecond) => {
      return -(
        itemFirst.data().time.toMillis() - itemSecond.data().time.toMillis()
      );
    });
    setPosts(sortedArr);
  }, [posts.length]);
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
              visible={menuVisible}
              onDismiss={closeMenu}>
              <Menu.Item title="Register" onPress={openRegisterWindow} />
              <Menu.Item
                title={firebase.default.auth().currentUser ? "Logout" : "Login"}
                onPress={
                  firebase.default.auth().currentUser
                    ? async () => {
                        await firebase.default
                          .firestore()
                          .collection("users")
                          .doc(firebase.default.auth().currentUser?.uid)
                          .update({
                            online: false,
                          });
                        firebase.default.auth().signOut();
                      }
                    : openLoginWindow
                }
              />
              <Menu.Item title="Settings" onPress={openSettingsWindow} />
            </Menu>
          </View>
        }
      />
      <FlatList
        data={posts}
        renderItem={({ item }) => <Post {...item.data()} />}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadPosts}
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

export { Home };
