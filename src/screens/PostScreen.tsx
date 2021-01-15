import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { Header } from "../components/Header";
import { PostProps } from "../components/Post";
import * as firebase from "firebase";
import { Comment, CommentProps } from "../components/Comment";

function PostScreen(props: PostProps) {
  const { isThemeDark } = React.useContext(PreferencesContext);
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [comments, setComments] = React.useState<
    firebase.default.firestore.QueryDocumentSnapshot<CommentProps>[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [bookmarked, setBookmarked] = React.useState<boolean>(false);

  const activeColor = isThemeDark ? colors.primary : colors.text;

  const styles = StyleSheet.create({
    mainView: {
      flex: 1,
    },
    header: {},
  });

  const closePostWindow = () => navigation.goBack();
  const openAddCommentWindow = () =>
    navigation.navigate("CreateCommentScreen", { ...props });

  const loadComments = async () => {
    setLoading(true);
    try {
      let db = firebase.default
        .firestore()
        .collection("users")
        .doc(props.userUID)
        .collection("comments");
      let result = await db.get();
      setComments(
        result.docs as firebase.default.firestore.QueryDocumentSnapshot<CommentProps>[]
      );
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const changeBookmarkStatus = () => {
    setBookmarked(!bookmarked);
  };
  React.useEffect(() => {
    loadComments();
  }, []);
  return (
    <SafeAreaView style={styles.mainView}>
      <Header
        left={
          <IconButton
            icon="close"
            color={activeColor}
            onPress={closePostWindow}
          />
        }
        title={props.title}
        right={
          <IconButton
            icon={bookmarked ? "bookmark" : "bookmark-outline"}
            color={activeColor}
            onPress={changeBookmarkStatus}
            size={21}
          />
        }
      />
      <FlatList
        data={comments}
        renderItem={({ item }) => <Comment {...item.data()} />}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 0.25,
              backgroundColor: colors.accent,
              width: "100%",
            }}></View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadComments}
            colors={[colors.accent]}
            progressBackgroundColor={colors.surface}
          />
        }
      />
    </SafeAreaView>
  );
}

export { PostScreen };
