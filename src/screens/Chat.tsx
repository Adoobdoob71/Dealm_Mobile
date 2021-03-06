import * as React from "react";
import {
  Alert,
  Dimensions,
  FlatListProps,
  Image,
  ImageBackground,
  InteractionManager,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { IconButton, useTheme, withTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { BackButton } from "../components/BackButton";
import { ReplyProps, User } from "../components/Classes";
import { Header } from "../components/Header";
import { Message, MessageProps } from "../components/Message";
import { UserStatus } from "../components/UserStatus";
import * as ImagePicker from "expo-image-picker";
import * as firebase from "firebase";

interface state {
  messages: MessageProps[];
  imageBlob: Blob | null;
  imageUri: string;
  message: string | null;
  textMessage: string;
  submitting: boolean;
  userDetails: User | null;
  online: boolean;
  lastOnline: firebase.default.firestore.Timestamp | null;
  replyPrivately: boolean;
}

interface props {
  profilePicture: string;
  nickname: string;
  userUID: string;
  roomID: string;
}
class Chat extends React.Component<any, state> {
  constructor(props: any) {
    super(props);
    this.state = {
      messages: [],
      imageBlob: null,
      imageUri: "",
      message: null,
      textMessage: "",
      submitting: false,
      userDetails: null,
      online: false,
      replyPrivately: this.props.route.params.postID !== undefined,
      lastOnline: null,
    };
  }

  static contextType = PreferencesContext;
  flatList:
    | FlatList<firebase.default.firestore.QueryDocumentSnapshot<MessageProps>>
    | null
    | undefined;

  loadMessages = () => {
    firebase.default
      .firestore()
      .collection("rooms")
      .doc(this.props.route.params.roomID)
      .collection("messages")
      .orderBy("time", "asc")
      .limitToLast(10)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            let item = change.doc.data() as MessageProps;
            this.setState({ messages: [...this.state.messages, item] });
          }
        });
      });
  };

  componentDidMount() {
    this.loadUserData();
    this.loadMessages();
    this.GuestOnlineStatus();
  }

  componentWillUnMount() {
    this.loadMessages();
    this.GuestOnlineStatus();
  }

  loadUserData = async () => {
    const user = await firebase.default.auth().currentUser;
    firebase.default
      .firestore()
      .collection("users")
      .doc(user?.uid)
      .get()
      .then((result) => {
        let details = result as firebase.default.firestore.QueryDocumentSnapshot<User>;
        this.setState({ userDetails: details.data() });
      });
  };

  GuestOnlineStatus = () => {
    firebase.default
      .firestore()
      .collection("users")
      .doc(this.props.route.params.userUID)
      .onSnapshot((result) => {
        let user = result.data() as User;
        this.setState({ online: user.online, lastOnline: user.lastOnline });
      });
  };

  pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.cancelled) {
        const res = await fetch(result.uri);
        let blob = await res.blob();
        this.setState({ imageUri: result.uri, imageBlob: blob });
      }
    } catch (error) {
      this.setState({ message: error.message });
    }
  };

  sendText = () => {
    InteractionManager.runAfterInteractions(async () => {
      if (
        this.state.textMessage.trim().length == 0 ||
        this.state.userDetails === null
      ) {
        Alert.alert("something's wrong");
        return;
      }
      this.setState({ submitting: true });
      let newMessage: MessageProps;

      let db = firebase.default
        .firestore()
        .collection("rooms")
        .doc(this.props.route.params.roomID)
        .collection("messages");
      if (this.state.replyPrivately) {
        let reply: ReplyProps = {
          body: this.props.route.params.body,
          time: this.props.route.params.time,
          title: this.props.route.params.title,
          imageUrl: this.props.route.params.imageUrl,
          postID: this.props.route.params.postID,
        };
        newMessage = {
          nickname: this.state.userDetails?.nickname,
          profilePicture: this.state.userDetails?.profilePicture,
          text: this.state.textMessage.trim(),
          time: firebase.default.firestore.Timestamp.now(),
          userUID: this.state.userDetails?.userUID,
          replyData: reply,
        };
      } else {
        newMessage = {
          nickname: this.state.userDetails?.nickname,
          profilePicture: this.state.userDetails?.profilePicture,
          text: this.state.textMessage.trim(),
          time: firebase.default.firestore.Timestamp.now(),
          userUID: this.state.userDetails?.userUID,
        };
      }

      await db.add(newMessage);

      this.setState({
        textMessage: "",
        submitting: false,
        replyPrivately: false,
      });
      this.flatList?.scrollToEnd({ animated: true });
    });
  };

  render() {
    const colors = this.props.theme.colors;
    const { isThemeDark } = this.context;
    const activeColor = isThemeDark ? colors.primary : colors.text;
    const styles = StyleSheet.create({
      chatBox: {
        width: "100%",
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: colors.surface,
      },
      chatBoxBottom: {
        flexDirection: "row",
        alignItems: "center",
      },
      textInput: {
        backgroundColor: colors.background,
        flex: 1,
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 8,
        marginHorizontal: 8,
        color: colors.text,
      },
      specialDataView: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        backgroundColor: `${colors.placeholder}22`,
        borderRadius: 8,
        padding: 6,
      },
      postImage: {
        width: 40,
        height: 40,
        borderRadius: 6,
        marginRight: 8,
      },
      postDetailView: {
        flexDirection: "column",
        flex: 1,
      },
      postTitle: {
        fontSize: 14,
        color: colors.text,
        fontWeight: "bold",
      },
      postBody: {
        fontSize: 12,
        color: colors.placeholder,
      },
      closeButton: {
        backgroundColor: `${colors.placeholder}55`,
        alignSelf: "flex-start",
      },
    });

    const navigation = this.props.navigation;
    const onChangeTextMessage = (value: string) =>
      this.setState({ textMessage: value });

    const removeImage = () => {
      this.setState({ imageBlob: null, imageUri: "" });
    };

    const closeReply = () => this.setState({ replyPrivately: false });

    const openProfile = () =>
      navigation.navigate("ProfileScreen", { ...this.props.route.params });

    const lastOnline = () => {
      let differenceInMins =
        (firebase.default.firestore.Timestamp.now().toMillis() -
          this.state.lastOnline?.toMillis()) /
        60000;
      let smallerThan60 = differenceInMins < 60;
      let smallerThan1440 = differenceInMins < 1440;

      if (smallerThan60) return differenceInMins.toFixed(0) + " mins ago";

      if (smallerThan1440)
        return (differenceInMins / 60).toFixed(0) + " hours ago";

      return (differenceInMins / 1440).toFixed(0) + " days ago";
    };

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          center={
            <UserStatus
              nickname={this.props.route.params.nickname}
              status={this.state.online}
              lastOnline={lastOnline()}
              userUID={this.props.route.params.userUID}
              onPress={openProfile}
            />
          }
          left={
            <BackButton imageUrl={this.props.route.params.profilePicture} />
          }
          right={
            <IconButton
              icon="dots-vertical"
              color={activeColor}
              onPress={() => {}}
              size={21}
            />
          }
        />
        <FlatList
          data={this.state.messages}
          ref={(ref) => (this.flatList = ref)}
          style={{ height: 0, width: "100%" }}
          renderItem={({ item }) => <Message {...item} />}
        />
        <View style={styles.chatBox}>
          {this.props.route.params.postID != undefined &&
            this.state.replyPrivately && (
              <View style={styles.specialDataView}>
                <Image
                  style={styles.postImage}
                  source={{ uri: this.props.route.params.imageUrl }}
                />
                <View style={styles.postDetailView}>
                  <Text
                    style={styles.postTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {this.props.route.params.title}
                  </Text>
                  <Text
                    style={styles.postBody}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {this.props.route.params.body}
                  </Text>
                </View>
                <IconButton
                  icon="close"
                  style={styles.closeButton}
                  size={10}
                  onPress={closeReply}
                  color={activeColor}
                />
              </View>
            )}
          <View style={styles.chatBoxBottom}>
            {/* <IconButton
            icon="attachment"
            color={activeColor}
            size={16}
            onPress={pickImage}
          /> */}
            <TextInput
              value={this.state.textMessage}
              onChangeText={onChangeTextMessage}
              style={styles.textInput}
              placeholder="Say something"
              placeholderTextColor={colors.placeholder}
            />
            <IconButton
              icon="send"
              color={activeColor}
              size={16}
              disabled={
                this.state.submitting ||
                this.state.userDetails === null ||
                this.state.textMessage.trim().length === 0
              }
              onPress={this.sendText}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default withTheme(Chat);
