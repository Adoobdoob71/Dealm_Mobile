import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  InteractionManager,
  Alert,
} from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import * as firebase from "firebase";
import { PostProps, RoomProps } from "./Classes";

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
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 12,
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
      marginVertical: 8,
      padding: 6,
    },
    title: {
      fontSize: 21,
      color: colors.text,
      marginBottom: 8,
      fontWeight: "bold",
    },
    body: {
      fontSize: 14,
      color: colors.text,
      display: props.body.trim().length === 0 ? "none" : "flex",
      marginBottom: props.imageUrl ? 8 : 0,
    },
    postImage: {
      height: screenHeight * 0.275,
      borderRadius: 8,
      display: props.imageUrl ? "flex" : "none",
    },
  });

  const openImage = () =>
    navigation.navigate("ImageScreen", { imageUrl: props.imageUrl });

  const openPost = () => navigation.navigate("PostScreen", { ...props });

  const replyPrivately = () => {
    InteractionManager.runAfterInteractions(() => {
      firebase.default
        .firestore()
        .collection("users")
        .doc(firebase.default.auth().currentUser?.uid)
        .collection("contacts")
        .doc(props.userUID)
        .get()
        .then((result) => {
          let room = result as firebase.default.firestore.QueryDocumentSnapshot<RoomProps>;
          navigation.navigate("ChatScreen", {
            ...props,
            roomID: room.data().roomID,
          });
        });
    });
  };

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
      <View style={styles.top}>
        <Image
          source={{ uri: props.profilePicture }}
          style={styles.profilePicture}
        />
        <View style={styles.userDetailsView}>
          <Text style={styles.nickname}>{props.nickname}</Text>
          <Text style={styles.timestamp}>{timestamp()}</Text>
        </View>
        <IconButton
          icon="send"
          size={16}
          color={activeColor}
          onPress={replyPrivately}
        />
      </View>
      <View style={styles.middle}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.body}>{props.body}</Text>
        <TouchableOpacity onPress={openImage}>
          <Image source={{ uri: props.imageUrl }} style={styles.postImage} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export { Post, PostProps };
