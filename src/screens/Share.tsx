import * as React from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { IconButton, Modal, Portal, withTheme } from "react-native-paper";
import * as firebase from "firebase";
import {
  ContactProps,
  MessageProps,
  RoomProps,
  User,
} from "../components/Classes";
import { Header } from "../components/Header";
import { PreferencesContext } from "../../Theming";
import { Contact } from "../components/Contact";
import { Alert } from "../components/Alert";
import * as Linking from "expo-linking";
import Clipboard from "expo-clipboard";

interface state {
  contacts: ContactProps[];
  selectedContacts: ContactProps[];
  loading: boolean;
  sending: boolean;
  textMessage: string;
  showModal: boolean;
  alertMessage: string | null;
  userDetails: User | null;
}

class Share extends React.Component<any, state> {
  constructor(props: any) {
    super(props);
    this.state = {
      contacts: [],
      selectedContacts: [],
      loading: false,
      sending: false,
      textMessage: "",
      showModal: false,
      alertMessage: null,
      userDetails: null,
    };
  }

  static contextType = PreferencesContext;

  componentDidMount() {
    this.loadContacts();
    this.loadUserDetails();
  }

  loadUserDetails = async () => {
    let user = firebase.default.auth().currentUser;
    let userDetails = await firebase.default
      .firestore()
      .collection("users")
      .doc(user?.uid)
      .get();
    this.setState({ userDetails: userDetails.data() as User });
  };

  loadContacts = async () => {
    this.setState({ loading: true, contacts: [] });
    let user = await firebase.default.auth().currentUser;
    let data = await firebase.default
      .firestore()
      .collection("users")
      .doc(user?.uid)
      .collection("contacts")
      .get();
    let arr = data.docs as firebase.default.firestore.QueryDocumentSnapshot<RoomProps>[];
    arr.forEach(async (item) => {
      const result = await firebase.default
        .firestore()
        .collection("users")
        .doc(item.data().userUID)
        .get();
      const contactData = result.data() as ContactProps;
      contactData.roomID = item.data().roomID;
      this.setState({ contacts: [...this.state.contacts, contactData] });
    });
    this.setState({ loading: false });
  };

  sharePost = async () => {
    this.setState({ sending: true });
    if (this.state.textMessage.trim().length === 0) {
      this.setState({
        alertMessage: "You haven't written anything in the message box",
      });
      return;
    }
    try {
      let db = firebase.default.firestore().collection("rooms");
      let newMessage: MessageProps = {
        text: this.state.textMessage.trim(),
        profilePicture: this.state.userDetails?.profilePicture,
        imageUrl: this.props.route.params.imageUrl
          ? this.props.route.params.imageUrl
          : "",
        nickname: this.state.userDetails?.nickname,
        time: firebase.default.firestore.Timestamp.now(),
        userUID: this.state.userDetails?.userUID,
        replyData: { ...this.props.route.params },
      };
      this.state.selectedContacts.map(async (item) => {
        await db.doc(item.roomID).collection("messages").add(newMessage);
      });
      this.setState({
        alertMessage: "Successfully sent to all receipients!",
      });
      setTimeout(() => {
        this.props.navigation.goBack();
      }, 5000);
    } catch (exception) {
      this.setState({ alertMessage: exception.message });
      setTimeout(() => {
        this.setState({ alertMessage: null });
      }, 5000);
    }
  };

  setContactAsSelected = (contact: ContactProps) => {
    let selectedContactsTemp = this.state.selectedContacts;
    let contactIndex = selectedContactsTemp.findIndex(
      (item) => item.userUID === contact.userUID
    );
    if (contactIndex !== -1) selectedContactsTemp.splice(contactIndex, 1);
    else selectedContactsTemp.push(contact);
    this.setState({ selectedContacts: selectedContactsTemp });
  };

  copyPostLink = () => {
    let url = Linking.makeUrl("dealm/posts", {
      id: this.props.route.params.postID,
    });
    Clipboard.setString(url);
    this.setState({ alertMessage: "Link copied!" });
  };

  render() {
    const colors = this.props.theme.colors;
    const { isThemeDark } = this.context;
    const activeColor = isThemeDark ? colors.primary : colors.text;
    const navigation = this.props.navigation;
    const goBack = () => navigation.goBack();
    const closeModal = () => this.setState({ showModal: false });
    const openModal = () => this.setState({ showModal: true });
    const onChangeText = (value: string) =>
      this.setState({ textMessage: value });
    const screenHeight = Dimensions.get("window").height;
    const dismissAlert = () => this.setState({ alertMessage: null });
    const styles = StyleSheet.create({
      messageBoxView: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: colors.surface,
        height: screenHeight * 0.45,
        margin: 16,
      },
      messageBoxTitle: {
        color: colors.text,
        fontSize: 18,
        fontWeight: "bold",
      },
      messageBox: {
        flex: 1,
        backgroundColor: colors.background,
        marginTop: 12,
        textAlignVertical: "top",
        color: colors.text,
        fontSize: 14,
        borderRadius: 8,
        padding: 10,
      },
      messageBoxViewTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
    });

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          title="Share post to friends"
          left={
            <IconButton
              icon="arrow-left"
              color={activeColor}
              onPress={goBack}
            />
          }
          right={
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IconButton
                icon="clipboard"
                size={18}
                color={activeColor}
                onPress={this.copyPostLink}
              />
              <IconButton
                icon="check"
                size={18}
                color={activeColor}
                onPress={openModal}
                disabled={
                  this.state.sending || this.state.selectedContacts.length === 0
                }
              />
            </View>
          }
        />
        <FlatList
          data={this.state.contacts}
          renderItem={({ item }) => (
            <Contact
              {...item}
              shareScreen={true}
              checkedContact={this.state.selectedContacts.some(
                (itemTemp) => itemTemp.userUID === item.userUID
              )}
              onPress={() => this.setContactAsSelected(item)}
            />
          )}
        />
        <Portal>
          <Modal visible={this.state.showModal} onDismiss={closeModal}>
            <View style={styles.messageBoxView}>
              <View style={styles.messageBoxViewTop}>
                <Text style={styles.messageBoxTitle}>What's the message?</Text>
                <IconButton
                  icon="send"
                  size={18}
                  color={activeColor}
                  onPress={this.sharePost}
                  disabled={this.state.sending}
                />
              </View>
              <TextInput
                value={this.state.textMessage}
                style={styles.messageBox}
                onChangeText={onChangeText}
                placeholder="Write it here"
                placeholderTextColor={colors.placeholder}
                multiline
              />
            </View>
          </Modal>
        </Portal>
        {this.state.alertMessage && (
          <Alert message={this.state.alertMessage} onPress={dismissAlert} />
        )}
      </SafeAreaView>
    );
  }
}

export default withTheme(Share);
