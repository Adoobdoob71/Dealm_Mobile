import * as React from "react";
import { SafeAreaView, StyleSheet, Text, TextInput } from "react-native";
import { Header } from "../components/Header";
import { Alert } from "../components/Alert";
import { BackButton } from "../components/BackButton";
import { User } from "../components/Classes";
import * as firebase from "firebase";
import { CommentProps } from "../components/Comment";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { PreferencesContext } from "../../Theming";
import { IconButton, withTheme } from "react-native-paper";

interface state {
  commentText: string;
  userDetails: User | null;
  message: string | null;
  loading: boolean;
}
class CreateComment extends React.Component<any, state> {
  constructor(props: any) {
    super(props);
    this.state = {
      commentText: "",
      userDetails: null,
      message: null,
      loading: false,
    };
  }

  static contextType = PreferencesContext;

  loadUserDetails = async () => {
    let user = await firebase.default.auth().currentUser;
    let result = await firebase.default
      .firestore()
      .collection("users")
      .doc(user?.uid)
      .get();
    this.setState({ userDetails: result.data() as User });
  };
  componentDidMount() {
    this.loadUserDetails();
  }

  submitComment = async () => {
    this.setState({ loading: true });
    if (this.state.commentText.trim().length === 0) {
      this.setState({ message: "There's nothing in the comment" });
      this.setState({ loading: false });
      return;
    }
    let comment: CommentProps = {
      text: this.state.commentText.trim(),
      nickname: this.state.userDetails?.nickname,
      profilePicture: this.state.userDetails?.profilePicture,
      userUID: this.state.userDetails?.userUID,
      time: firebase.default.firestore.Timestamp.now(),
      likes: 0,
    };
    await firebase.default
      .firestore()
      .collection("users")
      .doc(this.props.route.params.userUID)
      .collection("posts")
      .doc(this.props.route.params.postID)
      .collection("comments")
      .add(comment);
    this.setState({ message: "Comment submitted! 🎉" });
    setTimeout(() => {
      this.props.navigation.goBack();
    }, 5000);
  };

  render() {
    const colors = this.props.theme.colors;
    const { isThemeDark } = this.context;
    const activeColor = isThemeDark ? colors.primary : colors.text;
    const updateCommentText = (value: string) =>
      this.setState({ commentText: value });
    const styles = StyleSheet.create({
      mainView: {
        flex: 1,
        position: "relative",
      },
      commentText: {
        flex: 1,
        padding: 10,
        fontSize: 14,
        color: colors.text,
        textAlignVertical: "top",
      },
    });
    return (
      <>
        <SafeAreaView style={styles.mainView}>
          <Header
            left={<BackButton imageUrl={this.props.route.params.imageUrl} />}
            title={this.props.route.params.title}
            right={
              <IconButton
                icon="send"
                size={21}
                color={activeColor}
                onPress={this.submitComment}
                disabled={
                  this.state.commentText.trim().length === 0 ||
                  this.state.loading
                }
              />
            }
          />
          <TextInput
            value={this.state.commentText}
            onChangeText={updateCommentText}
            style={styles.commentText}
            placeholder="Say something..."
            placeholderTextColor={colors.placeholder}
          />
        </SafeAreaView>
        {this.state.message && (
          <Alert message={this.state.message} action={true} />
        )}
      </>
    );
  }
}

export default withTheme(CreateComment);
