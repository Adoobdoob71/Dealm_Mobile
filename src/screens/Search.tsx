import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { Contact, ContactProps } from "../components/Contact";
import { Header } from "../components/Header";
import * as firebase from "firebase";

function Search() {
  const { colors } = useTheme();
  const { isThemeDark } = React.useContext(PreferencesContext);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [results, setResults] = React.useState<
    firebase.default.firestore.QueryDocumentSnapshot<ContactProps>[]
  >([]);
  const navigation = useNavigation();
  const styles = StyleSheet.create({
    body: {
      flex: 1,
    },
    searchField: {
      flex: 1,
      borderRadius: 8,
      backgroundColor: colors.background,
      paddingHorizontal: 8,
      paddingVertical: 6,
      color: colors.text,
    },
  });
  const activeColor = isThemeDark ? colors.primary : colors.text;

  const goBack = () => navigation.goBack();
  const changeQuery = async (value: string) => {
    setSearchQuery(value);
    let result = await firebase.default
      .firestore()
      .collection("users")
      .orderBy("nickname")
      .startAt(searchQuery)
      .endAt(searchQuery + "\uf8ff")
      .get();
    let docs = result.docs as firebase.default.firestore.QueryDocumentSnapshot<ContactProps>[];
    setResults(docs);
  };
  const addContact = async (item: ContactProps) => {
    let db = firebase.default.firestore().collection("users");
    let result = await firebase.default.firestore().collection("rooms").add({
      default: null,
    });
    await db
      .doc(item.userUID)
      .collection("contacts")
      .doc(firebase.default.auth().currentUser?.uid)
      .set({
        roomID: result.id,
        userUID: firebase.default.auth().currentUser?.uid,
      });
    await db
      .doc(firebase.default.auth().currentUser?.uid)
      .collection("contacts")
      .doc(item.userUID)
      .set({
        roomID: result.id,
        userUID: item.userUID,
      });
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.body}>
      <Header
        left={
          <IconButton icon="arrow-left" onPress={goBack} color={activeColor} />
        }
        center={
          <TextInput
            value={searchQuery}
            onChangeText={changeQuery}
            style={styles.searchField}
            placeholder="Search anything"
            placeholderTextColor={colors.placeholder}
          />
        }
      />
      <FlatList
        data={results}
        renderItem={({ item, index }) => (
          <Contact {...item.data()} onPress={() => addContact(item.data())} />
        )}
      />
    </SafeAreaView>
  );
}

export { Search };
