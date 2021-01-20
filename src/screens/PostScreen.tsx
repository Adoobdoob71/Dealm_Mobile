import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { IconButton, useTheme, withTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { Header } from "../components/Header";
import { PostProps } from "../components/Post";
import * as firebase from "firebase";
import { Comment, CommentProps } from "../components/Comment";

interface state {
  comments: firebase.default.firestore.QueryDocumentSnapshot<CommentProps>[];
  loading: boolean;
  bookmarked: boolean;
}
class PostScreen extends React.Component<any, state> {
  constructor(props: any) {
    super(props);
    this.state = {
      comments: [],
      loading: false,
      bookmarked: false,
    };
  }

  static contextType = PreferencesContext;

  loadComments = async () => {
    this.setState({ loading: true });
    try {
      let db = firebase.default
        .firestore()
        .collection("users")
        .doc(this.props.route.params.userUID)
        .collection("posts")
        .doc(this.props.route.params.postID)
        .collection("comments");
      let result = await db.get();
      this.setState({
        comments: result.docs as firebase.default.firestore.QueryDocumentSnapshot<CommentProps>[],
      });
    } catch (error) {
      console.error(error);
    }
    this.setState({ loading: false });
  };

  componentDidMount() {
    this.loadComments();
  }

  render() {
    const colors = this.props.theme.colors;
    const navigation = this.props.navigation;
    const { isThemeDark } = this.context;
    const activeColor = isThemeDark ? colors.primary : colors.text;

    const changeBookmarkStatus = () =>
      this.setState({ bookmarked: !this.state.bookmarked });
    const closePostWindow = () => navigation.goBack();
    const openAddCommentWindow = () =>
      navigation.navigate("CreateComment", { ...this.props.route.params });

    const styles = StyleSheet.create({
      mainView: {
        flex: 1,
      },
      header: {},
    });

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
          title={this.props.title}
          right={
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IconButton
                icon={this.state.bookmarked ? "bookmark" : "bookmark-outline"}
                color={activeColor}
                onPress={changeBookmarkStatus}
                size={18}
              />
              <IconButton
                icon="plus"
                color={activeColor}
                onPress={openAddCommentWindow}
                size={18}
              />
            </View>
          }
        />
        <FlatList
          data={this.state.comments}
          renderItem={({ item }) => <Comment {...item.data()} />}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 10,
                backgroundColor: "transaprent",
              }}></View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={this.loadComments}
              colors={[colors.accent]}
              progressBackgroundColor={colors.surface}
            />
          }
        />
      </SafeAreaView>
    );
  }
}

export default withTheme(PostScreen);
