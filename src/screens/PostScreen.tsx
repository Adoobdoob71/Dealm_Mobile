import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
    const screenWidth = Dimensions.get("screen").width;
    const screenHeight = Dimensions.get("screen").height;

    const closePostWindow = () => navigation.goBack();
    const openAddCommentWindow = () =>
      navigation.navigate("CreateComment", { ...this.props.route.params });
    const openImage = () =>
      navigation.navigate("ImageScreen", {
        imageUrl: this.props.route.params.imageUrl,
        title: this.props.route.params.title,
      });

    const styles = StyleSheet.create({
      mainView: {
        flex: 1,
      },
      postHeaderView: {
        padding: 10,
      },
      top: {
        flexDirection: "row",
        alignItems: "center",
      },
      profilePicture: {
        width: 48,
        height: 48,
        borderRadius: 24,
      },
      userDetailsView: {
        flex: 1,
        marginLeft: 12,
      },
      nickname: {
        fontSize: 16,
        color: colors.text,
        fontWeight: "bold",
      },
      timestamp: {
        fontSize: 14,
        color: colors.placeholder,
      },
      middle: {
        marginVertical: 8,
        padding: 6,
      },
      title: {
        fontSize: 21,
        color: colors.text,
        marginBottom: 8,
        fontWeight: "bold",
      },
      body: {
        fontSize: 14,
        color: colors.text,
        display:
          this.props.route.params.body.trim().length === 0 ? "none" : "flex",
        marginBottom: this.props.route.params.imageUrl ? 8 : 0,
      },
      postImage: {
        height: screenHeight * 0.275,
        borderRadius: 8,
        display: this.props.route.params.imageUrl ? "flex" : "none",
      },
    });

    const timestamp = (): string => {
      let differenceInMins =
        (firebase.default.firestore.Timestamp.now().toMillis() -
          this.props.route.params.time.toMillis()) /
        60000;
      let smallerThan60 = differenceInMins < 60;
      let smallerThan1440 = differenceInMins < 1440;

      if (smallerThan60) return differenceInMins.toFixed(0) + " mins ago";

      if (smallerThan1440)
        return (differenceInMins / 60).toFixed(0) + " hours ago";

      return (differenceInMins / 1440).toFixed(0) + " days ago";
    };

    const openProfileScreen = () =>
      navigation.navigate("ProfileScreen", { ...this.props.route.params });

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
            <IconButton
              icon="plus"
              color={activeColor}
              onPress={openAddCommentWindow}
              size={18}
            />
          }
        />
        <FlatList
          data={this.state.comments}
          renderItem={({ item }) => <Comment {...item.data()} />}
          ListHeaderComponent={() => (
            <View style={styles.postHeaderView}>
              <View style={styles.top}>
                <TouchableOpacity onPress={openProfileScreen}>
                  <Image
                    source={{ uri: this.props.route.params.profilePicture }}
                    style={styles.profilePicture}
                  />
                </TouchableOpacity>
                <View style={styles.userDetailsView}>
                  <Text style={styles.nickname}>
                    {this.props.route.params.nickname}
                  </Text>
                  <Text style={styles.timestamp}>{timestamp()}</Text>
                </View>
              </View>
              <View style={styles.middle}>
                <Text style={styles.title}>
                  {this.props.route.params.title}
                </Text>
                <Text style={styles.body}>{this.props.route.params.body}</Text>
                <TouchableOpacity onPress={openImage}>
                  <Image
                    source={{ uri: this.props.route.params.imageUrl }}
                    style={styles.postImage}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  marginVertical: 10,
                  height: 0.25,
                  backgroundColor: colors.accent,
                  width: "90%",
                  alignSelf: "center",
                }}></View>
            </View>
          )}
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
