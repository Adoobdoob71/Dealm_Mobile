import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import * as firebase from "firebase";

interface CommentProps {
  nickname?: string | undefined | null;
  userUID?: string | undefined | null;
  profilePicture?: string | undefined | null;
  text: string;
  time: firebase.default.firestore.Timestamp;
  likes: number;
}
function Comment(props: CommentProps) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    mainView: {
      padding: 8,
    },
    topView: {
      flexDirection: "row",
      alignItems: "center",
    },
    nickname: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "bold",
    },
    bullPoint: {
      fontSize: 6,
      color: colors.placeholder,
      marginHorizontal: 4,
    },
    text: {
      fontSize: 14,
      color: colors.text,
      marginLeft: 36,
    },
    profilePicture: {
      width: 28,
      height: 28,
      borderRadius: 14,
      marginRight: 8,
    },
    timestamp: {
      color: colors.placeholder,
      fontSize: 10,
    },
  });

  const timestamp = (): string => {
    let differenceInMins =
      (firebase.default.firestore.Timestamp.now().toMillis() -
        props.time.toMillis()) /
      60000;
    let smallerThan60 = differenceInMins < 60;
    let smallerThan1440 = differenceInMins < 1440;

    if (smallerThan60) return differenceInMins.toFixed(0) + " mins ago";

    if (smallerThan1440)
      return (differenceInMins / 60).toFixed(0) + " hours ago";

    return (differenceInMins / 1440).toFixed(0) + " days ago";
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.topView}>
        <Image
          source={{ uri: props.profilePicture }}
          style={styles.profilePicture}
        />
        <Text style={styles.nickname}>{props.nickname}</Text>
        <Text style={styles.bullPoint}>{"\u2B24"}</Text>
        <Text style={styles.timestamp}>{timestamp()}</Text>
      </View>
      <Text style={styles.text}>{props.text}</Text>
    </View>
  );
}

export { Comment, CommentProps };
