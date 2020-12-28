import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { Alert, FlatList, SafeAreaView, Text, View } from "react-native";
import { PreferencesContext } from "../../Theming";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Post, PostProps } from "../components/Post";
import * as firebase from "firebase";
import { useTheme } from "react-native-paper";

function Home() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const openLoginWindow = () => navigation.navigate("Login");
  const openSettingsWindow = () => navigation.navigate("Settings");
  const openRegisterWindow = () => navigation.navigate("Register");
  const openCreatePostWindow = () => navigation.navigate("CreatePost");
  const [posts, setPosts] = React.useState<
    firebase.default.firestore.QueryDocumentSnapshot<PostProps>[]
  >([]);

  React.useEffect(() => {
    let db = firebase.default
      .firestore()
      .collection("users")
      .doc("QBYEeY3LJFZIVA5B2Obn7jdNQ8u2")
      .collection("posts");
    db.get().then((snapshot) => {
      let arr = snapshot.docs as firebase.default.firestore.QueryDocumentSnapshot<PostProps>[];
      setPosts(arr);
    });
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="Home"
        right={
          <Button
            mode="text"
            text="Create post"
            onPress={openCreatePostWindow}
            fontSize={10}
          />
        }
      />
      {/* <Button
        mode="full"
        text="Settings"
        onPress={openSettingsWindow}
        style={{ alignSelf: "center", marginTop: 48 }}
      />
      <Button
        mode="bordered"
        text="Login"
        onPress={openLoginWindow}
        style={{ alignSelf: "center", marginTop: 32 }}
      />
      <Button
        mode="text"
        text="Button"
        onPress={openRegisterWindow}
        style={{ alignSelf: "center", marginTop: 32 }}
      />
      <Button
        mode="text"
        text="Button"
        onPress={openCreatePostWindow}
        style={{ alignSelf: "center", marginTop: 32 }}
      /> */}
      <FlatList
        data={posts}
        renderItem={({ item }) => <Post {...item.data()} />}
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
