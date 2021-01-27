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
  const replyBool = props.replyData !== undefined;
  const styles = StyleSheet.create({
    mainView: {
      flexDirection: "row",
      paddingHorizontal: 10,
      paddingVertical: 8,
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
      fontSize: 12,
      color: colors.placeholder,
    },
    body: {
      fontSize: 12,
      color: colors.text,
    },
    time: {
      fontSize: 10,
      color: colors.placeholder,
    },
    specialDataView: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: `${colors.placeholder}20`,
      borderRadius: 10,
      marginLeft: 52,
      marginRight: 10,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    postImage: {
      width: 30,
      height: 30,
      borderRadius: 6,
      marginRight: 8,
    },
    postDetailView: {
      flexDirection: "column",
      flex: 1,
    },
    postTitle: {
      fontSize: 12,
      color: colors.text,
      fontWeight: "bold",
    },
    postBody: {
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

    if (smallerThan3600)
      return (differenceInSecs / 60).toFixed(0) + " mins ago";

    if (smallerThan86400)
      return (differenceInSecs / 3600).toFixed(0) + " hours ago";

    return (differenceInSecs / 86400).toFixed(0) + " days ago";
  };
  return (
    <View
      style={{
        // backgroundColor: replyBool ? `${colors.placeholder}10` : "transparent",
        padding: replyBool ? 4 : 0,
      }}>
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
      {props.replyData !== undefined && (
        <View style={styles.specialDataView}>
          <Image
            style={styles.postImage}
            source={{ uri: props.replyData?.imageUrl }}
          />
          <View style={styles.postDetailView}>
            <Text
              style={styles.postTitle}
              numberOfLines={1}
              ellipsizeMode="tail">
              {props.replyData?.title}
            </Text>
            <Text
              style={styles.postBody}
              numberOfLines={1}
              ellipsizeMode="tail">
              {props.replyData?.body}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

export { Message, MessageProps };
