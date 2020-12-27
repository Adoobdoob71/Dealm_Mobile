import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import * as firebase from "firebase";

interface PostProps {
  userUID: string;
  title: string;
  body: string;
  imageUrl?: string;
  nickname: string;
  profilePicture: string;
  time: firebase.default.firestore.Timestamp;
}
function Post(props: PostProps) {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { isThemeDark } = React.useContext(PreferencesContext);
  const activeColor = isThemeDark ? colors.accent : colors.text;
  const screenWidth = Dimensions.get("screen").width;
  const screenHeight = Dimensions.get("screen").height;

  const styles = StyleSheet.create({
    mainView: {
      padding: 10,
    },
    top: {
      flexDirection: "row",
      alignItems: "center",
    },
    profilePicture: {
      width: 42,
      height: 42,
      borderRadius: 21,
    },
    userDetailsView: {
      flex: 1,
    },
    nickname: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "bold",
    },
    timestamp: {
      fontSize: 14,
      color: colors.placeholder,
    },
    middle: {
      marginVertical: 10,
      padding: 6,
    },
    body: {
      fontSize: 14,
      color: colors.text,
      display: props.body.trim().length === 0 ? "none" : "flex",
      marginBottom: 8,
    },
    postImage: {
      height: screenHeight * 0.25,
      width: "70%",
      borderRadius: 8,
    },
  });

  const openImage = () =>
    navigation.navigate("ImageScreen", { imageUrl: props.imageUrl });

  const openPost = () => navigation.navigate("PostScreen", { ...props });

  const timestamp = (): string => {
    let differenceInMins =
      (firebase.default.firestore.Timestamp.now().toMillis() -
        (props.time.toMillis() % 60000)) /
      1000;
    let smallerThan60 = differenceInMins < 60;
    let smallerThan1440 = differenceInMins < 1440;

    if (smallerThan60) return differenceInMins + " mins ago";

    if (smallerThan1440)
      return (differenceInMins / 60).toFixed(0) + " hours ago";

    return (differenceInMins / 1440).toFixed(0) + " days ago";
  };

  return (
    <TouchableOpacity onPress={openPost}>
      <View style={styles.mainView}>
        <View style={styles.top}>
          <Image source={{ uri: "" }} style={styles.profilePicture} />
          <View style={styles.userDetailsView}>
            <Text style={styles.nickname}>{props.nickname}</Text>
            <Text style={styles.timestamp}>{timestamp}</Text>
          </View>
          <IconButton icon="send" size={16} color={activeColor} />
        </View>
        <View style={styles.middle}>
          <Text style={styles.body}>{props.body}</Text>
          <TouchableOpacity onPress={openImage}>
            <Image source={{ uri: props.imageUrl }} style={styles.postImage} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export { Post, PostProps };
