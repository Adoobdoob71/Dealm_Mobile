import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  Checkbox,
  IconButton,
  Menu,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import * as firebase from "firebase";
import { ContactProps } from "./Classes";
import { useNavigation } from "@react-navigation/native";

function Contact(
  props: ContactProps & { shareScreen?: boolean; checkedContact?: boolean }
) {
  const { colors } = useTheme();
  const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);
  const navigation = useNavigation();
  const styles = StyleSheet.create({
    contactView: {
      flexDirection: "row",
      padding: 10,
      alignItems: "center",
    },
    profilePicture: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },
    contactDetails: {
      flexDirection: "column",
      flex: 1,
      marginHorizontal: 10,
    },
    contactNickname: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "bold",
    },
    contactDescription: {
      fontSize: 14,
      marginTop: 4,
      color: colors.placeholder,
    },
  });

  const activeColor = isThemeDark ? colors.primary : colors.text;
  const openProfile = () => navigation.navigate("ProfileScreen", { ...props });

  return (
    <>
      <TouchableRipple
        onPress={props.onPress}
        rippleColor={colors.primary}
        onLongPress={openProfile}>
        <View style={styles.contactView}>
          {props.shareScreen && (
            <View style={{ marginRight: 10 }}>
              <Checkbox
                status={props.checkedContact ? "checked" : "unchecked"}
                color={activeColor}
              />
            </View>
          )}
          <Image
            source={{ uri: props.profilePicture }}
            style={styles.profilePicture}
          />
          <View style={styles.contactDetails}>
            <Text style={styles.contactNickname}>{props.nickname}</Text>
            <Text style={styles.contactDescription}>{props.description}</Text>
          </View>
        </View>
      </TouchableRipple>
    </>
  );
}

export { Contact, ContactProps };
