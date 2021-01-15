import * as React from "react";
import {
  Alert,
  Dimensions,
  FlatListProps,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { IconButton, useTheme, withTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { BackButton } from "../components/BackButton";
import { User } from "../components/Classes";
import { Header } from "../components/Header";
import { Message, MessageProps } from "../components/Message";
import { UserStatus } from "../components/UserStatus";
import * as ImagePicker from "expo-image-picker";
import * as firebase from "firebase";

interface state {
  messages: firebase.default.firestore.QueryDocumentSnapshot<MessageProps>[];
  imageBlob: Blob | null;
  imageUri: string;
  message: string | null;
  textMessage: string;
  submitting: boolean;
  userDetails: User | null;
  online: boolean;
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
    };
  }

  static contextType = PreferencesContext;

  loadMessages = () => {
    firebase.default
      .firestore()
      .collection("rooms")
      .doc(this.props.route.params.roomID)
      .collection("messages")
      .orderBy("time", "asc")
      .onSnapshot((snapshot) => {
        let msgs = snapshot.docs as firebase.default.firestore.QueryDocumentSnapshot<MessageProps>[];
        this.setState({ messages: msgs });
        // flatListRef.current.scrollToEnd({ animated: true });
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
        this.setState({ online: user.online });
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

  sendText = async () => {
    if (
      this.state.textMessage.trim().length == 0 ||
      this.state.userDetails === null
    ) {
      Alert.alert("something's wrong");
      return;
    }
    this.setState({ submitting: true });
    let newMessage: MessageProps = {
      nickname: this.state.userDetails?.nickname,
      profilePicture: this.state.userDetails?.profilePicture,
      text: this.state.textMessage.trim(),
      time: firebase.default.firestore.Timestamp.now(),
      userUID: this.state.userDetails?.userUID,
    };
    await firebase.default
      .firestore()
      .collection("rooms")
      .doc(this.props.route.params.roomID)
      .collection("messages")
      .add(newMessage);

    this.setState({ textMessage: "", submitting: false });
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
      imageBackground: {
        display: this.state.imageBlob ? "flex" : "none",
        height: Dimensions.get("screen").height * 0.3,
        flex: 1,
        marginRight: 8,
      },
      specialDataView: {
        display: this.state.imageBlob ? "flex" : "none",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
      },
    });

    const onChangeTextMessage = (value: string) =>
      this.setState({ textMessage: value });

    const removeImage = () => {
      this.setState({ imageBlob: null, imageUri: "" });
    };
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          center={
            <UserStatus
              nickname={this.props.route.params.nickname}
              status={this.state.online}
              userUID={this.props.route.params.userUID}
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
          style={{ height: 0, width: "100%" }}
          renderItem={({ item }) => <Message {...item.data()} />}
        />
        <View style={styles.chatBox}>
          <View style={styles.specialDataView}>
            {/* <ImageBackground
            style={styles.imageBackground}
            source={{ uri: imageUri }}
            imageStyle={{ borderRadius: 8 }}>
            <IconButton
              icon="close"
              color={activeColor}
              onPress={removeImage}
              size={16}
              background={colors.backdrop}
            />
          </ImageBackground>
          <IconButton
            icon="pencil"
            color={colors.accent}
            onPress={() => {}}
            size={16}
          /> */}
          </View>
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
                this.state.submitting || this.state.userDetails === null
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
