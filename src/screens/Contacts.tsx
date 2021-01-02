import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { IconButton, useTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { Contact, ContactProps } from "../components/Contact";
import { Header } from "../components/Header";
import * as firebase from "firebase";
import { RoomProps } from "../components/Classes";

function Contacts() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [contacts, setContacts] = React.useState<ContactProps[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const { isThemeDark } = React.useContext(PreferencesContext);
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

  const loadContacts = () => {
    setContacts([]);
    setLoading(true);
    firebase.default
      .firestore()
      .collection("users")
      .doc(firebase.default.auth().currentUser?.uid)
      .collection("contacts")
      .get()
      .then((data) => {
        let arr = data.docs as firebase.default.firestore.QueryDocumentSnapshot<RoomProps>[];
        arr.forEach(async (item) => {
          let result = await firebase.default
            .firestore()
            .collection("users")
            .doc(item.data().userUID)
            .get();
          let contact = (result as firebase.default.firestore.QueryDocumentSnapshot<ContactProps>).data();
          contact.roomID = item.data().roomID;
          contacts.push(contact);
          // setContacts([...contacts, contact]);
        });
        setContacts(contacts);
        setLoading(false);
      });
  };
  React.useEffect(() => {
    firebase.default.auth().onAuthStateChanged((user) => {
      if (user) {
        loadContacts();
      } else {
        setContacts([]);
      }
    });
  }, []);

  const seperator = () => <View style={styles.seperator}></View>;

  const openSearchScreen = () => navigation.navigate("SearchScreen");
  const openRoomScreen = (item: ContactProps) =>
    navigation.navigate("ChatScreen", { ...item });

  const right = (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <IconButton
        icon="magnify"
        onPress={openSearchScreen}
        color={isThemeDark ? colors.primary : colors.text}
        size={21}
      />
      <IconButton
        icon="sort"
        onPress={() => {}}
        color={isThemeDark ? colors.primary : colors.text}
        size={21}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Contacts" right={right} />
      <FlatList
        data={contacts}
        renderItem={({ item, index }) => (
          <Contact {...item} key={index} onPress={() => openRoomScreen(item)} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadContacts}
            colors={[colors.primary]}
            progressBackgroundColor={colors.surface}
          />
        }
        ItemSeparatorComponent={seperator}
      />
    </SafeAreaView>
  );
}

export { Contacts };
