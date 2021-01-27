import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  Alert,
  InteractionManager,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { IconButton, useTheme, withTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { Contact, ContactProps } from "../components/Contact";
import { Header } from "../components/Header";
import * as firebase from "firebase";
import { RoomProps, User } from "../components/Classes";

interface state {
  contacts: ContactProps[];
  loading: boolean;
}
class Contacts extends React.Component<any, state> {
  constructor(props: any) {
    super(props);
    this.state = {
      contacts: [],
      loading: false,
    };
  }

  static contextType = PreferencesContext;

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

  componentDidMount() {
    firebase.default.auth().onAuthStateChanged((user) => {
      if (user) {
        this.loadContacts();
      } else {
        this.setState({ contacts: [] });
      }
    });
  }

  sortContacts = () => {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        contacts: this.state.contacts.sort((itemFirst, itemSecond) => {
          return -(itemFirst.nickname.length - itemSecond.nickname.length);
        }),
      });
    });
  };

  render() {
    const colors = this.props.theme.colors;
    const { isThemeDark } = this.context;
    const activeColor = isThemeDark ? colors.primary : colors.text;
    const openSearchScreen = () =>
      this.props.navigation.navigate("SearchScreen");
    const openRoomScreen = (item: ContactProps) =>
      this.props.navigation.navigate("ChatScreen", { ...item });

    const styles = StyleSheet.create({
      header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 8,
        paddingVertical: 6,
        backgroundColor: colors.surface,
      },
      seperator: {
        marginLeft: 64,
        marginRight: 16,
        height: 0.5,
        backgroundColor: colors.placeholder,
      },
      headerText: {
        fontSize: 21,
        fontWeight: "bold",
        color: colors.text,
        marginLeft: 8,
      },
    });

    const right = (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {Platform.OS === "web" && (
          <IconButton
            icon="refresh"
            onPress={this.loadContacts}
            color={activeColor}
            size={21}
          />
        )}
        <IconButton
          icon="magnify"
          onPress={openSearchScreen}
          color={activeColor}
          size={21}
        />
      </View>
    );
    const seperator = () => <View style={styles.seperator}></View>;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Contacts" right={right} />
        <FlatList
          data={this.state.contacts}
          renderItem={({ item, index }) => (
            <Contact
              {...item}
              key={index}
              onPress={() => openRoomScreen(item)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={this.loadContacts}
              colors={[colors.accent]}
              progressBackgroundColor={colors.surface}
            />
          }
          ItemSeparatorComponent={seperator}
        />
      </SafeAreaView>
    );
  }
}

export default withTheme(Contacts);
