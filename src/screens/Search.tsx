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
  const [results, setResults] = React.useState<ContactProps[]>([]);
  const navigation = useNavigation();
  const styles = StyleSheet.create({
    body: {
      flex: 1,
    },
    searchField: {
      flex: 1,
      borderRadius: 8,
      backgroundColor: colors.backdrop,
    },
  });
  const activeColor = isThemeDark ? colors.primary : colors.text;

  const goBack = () => navigation.goBack();
  const changeQuery = (value: string) => setSearchQuery(value);
  const addContact = (item: ContactProps) => {
    let db = firebase.default.firestore().collection("users");
    // db.doc(item.userUID).
  };
  return (
    <SafeAreaView style={styles.body}>
      <Header
        left={
          <IconButton icon="arrow-left" onPress={goBack} color={activeColor} />
        }
        center={
          <View style={styles.searchField}>
            <TextInput
              value={searchQuery}
              onChangeText={changeQuery}
              style={{ flex: 1 }}
              placeholder="Search anything"
              placeholderTextColor={colors.placeholder}
            />
          </View>
        }
      />
      <FlatList
        data={results}
        renderItem={({ item, index }) => (
          <Contact
            nickname={item.nickname}
            description={item.description}
            profilePicture={item.profilePicture}
            onPress={() => addContact(item)}
            userUID={item.userUID}
          />
        )}
      />
    </SafeAreaView>
  );
}
