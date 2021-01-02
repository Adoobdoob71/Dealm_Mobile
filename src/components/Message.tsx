import * as React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { ReplyProps } from "./Classes";
import * as firebase from "firebase";
import { MessageProps } from "./Classes";

function Message(props: MessageProps) {
  const { colors } = useTheme();
  const { isThemeDark } = React.useContext(PreferencesContext);
  const activeColor = isThemeDark ? colors.primary : colors.text;
  const styles = StyleSheet.create({
    mainView: {
      flexDirection: "row",
      padding: 10,
    },
    profilePicture: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    bodyView: {
      flex: 1,
      marginHorizontal: 10,
    },
    nickname: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.text,
    },
    body: {
      fontSize: 12,
      color: colors.text,
    },
    time: {
      fontSize: 10,
      color: colors.placeholder,
    },
  });

  const timestamp = (): string => {
    let differenceInSecs =
      (firebase.default.firestore.Timestamp.now().toMillis() -
        props.time.toMillis()) /
      1000;
    let smallerThan60 = differenceInSecs < 60;
    let smallerThan3600 = differenceInSecs < 3600;
    let smallerThan86400 = differenceInSecs < 86400;

    if (smallerThan60) return differenceInSecs.toFixed(0) + " seconds ago";

    if (smallerThan3600)
      return (differenceInSecs / 60).toFixed(0) + " mins ago";

    if (smallerThan86400)
      return (differenceInSecs / 3600).toFixed(0) + " hours ago";

    return (differenceInSecs / 86400).toFixed(0) + " days ago";
  };
  return (
    <View style={styles.mainView}>
      <Image
        source={{ uri: props.profilePicture }}
        style={styles.profilePicture}
      />
      <View style={styles.bodyView}>
        <Text style={styles.nickname}>{props.nickname}</Text>
        <Text style={styles.body}>{props.text}</Text>
      </View>
      <Text style={styles.time}>{timestamp()}</Text>
    </View>
  );
}

export { Message, MessageProps };
