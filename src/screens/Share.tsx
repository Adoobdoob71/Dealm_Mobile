import * as React from "react";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import { IconButton, withTheme } from "react-native-paper";
import * as firebase from "firebase";
import { ContactProps, RoomProps } from "../components/Classes";
import { Header } from "../components/Header";
import { PreferencesContext } from "../../Theming";
import { Contact } from "../components/Contact";

interface state {
  contacts: ContactProps[];
  selectedContacts: ContactProps[];
  loading: boolean;
  sending: boolean;
}

class Share extends React.Component<any, state> {
  constructor(props: any) {
    super(props);
    this.state = {
      contacts: [],
      selectedContacts: [],
      loading: false,
      sending: false,
    };
  }

  static contextType = PreferencesContext;

  componentDidMount() {
    this.loadContacts();
  }

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

  sharePost = () => {
    this.setState({ sending: true });
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

  render() {
    const colors = this.props.theme.colors;
    const { isThemeDark } = this.context;
    const activeColor = isThemeDark ? colors.primary : colors.text;
    const navigation = this.props.navigation;
    const goBack = () => navigation.goBack();

    return (
      <SafeAreaView>
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
            <IconButton
              icon="send"
              size={18}
              color={activeColor}
              onPress={this.sharePost}
              disabled={this.state.sending}
            />
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
      </SafeAreaView>
    );
  }
}

export default withTheme(Share);
