import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  IconButton,
  Menu,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import * as firebase from "firebase";
import { ContactProps } from "./Classes";

function Contact(props: ContactProps) {
  const { colors } = useTheme();
  const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);

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

  const openMenu = () => setMenuOpen(true);
  const dismissMenu = () => setMenuOpen(false);
  return (
    <>
      <TouchableRipple onPress={props.onPress} rippleColor={colors.primary}>
        <View style={styles.contactView}>
          <Image
            source={{ uri: props.profilePicture }}
            style={styles.profilePicture}
          />
          <View style={styles.contactDetails}>
            <Text style={styles.contactNickname}>{props.nickname}</Text>
            <Text style={styles.contactDescription}>{props.description}</Text>
          </View>
          {/* <Menu
            anchor={
              <IconButton
                icon="chevron-down"
                color={activeColor}
                onPress={openMenu}
                size={18}
                style={{ alignSelf: "flex-start" }}
              />
            }
            onDismiss={dismissMenu}
            visible={menuOpen}
            contentStyle={{
              backgroundColor: colors.surface,
              alignSelf: "flex-start",
            }}>
            <Menu.Item
              title={`Follow ${props.nickname}`}
              disabled={!firebase.default.auth().currentUser}
            />
          </Menu> */}
        </View>
      </TouchableRipple>
      {/* <View style={styles.bar}></View> */}
    </>
  );
}

export { Contact, ContactProps };
