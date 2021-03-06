import * as React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { IconButton, useTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import * as ImagePicker from "expo-image-picker";
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/native";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { PostProps } from "../components/Post";
import { User } from "../components/Classes";
import { Alert } from "../components/Alert";

function CreatePost() {
  const { colors } = useTheme();
  const { isThemeDark } = React.useContext(PreferencesContext);

  const [title, setTitle] = React.useState<string>("");
  const [body, setBody] = React.useState<string>("");
  const [imageUri, setImageUri] = React.useState<string | null>(null);
  const [imageBlob, setImageBlob] = React.useState<Blob | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState<boolean>(false);

  const activeColor = isThemeDark ? colors.primary : colors.text;
  const navigation = useNavigation();
  const screenHeight = Dimensions.get("screen").height;
  const styles = StyleSheet.create({
    mainBody: {
      flex: 1,
    },
    title: {
      fontSize: 14,
      color: colors.text,
    },
    body: {
      fontSize: 12,
      marginTop: 16,
      color: colors.text,
      textAlignVertical: "top",
    },
    imagePreview: {
      width: "85%",
      height: screenHeight * 0.35,
      display: imageBlob ? "flex" : "none",
      alignSelf: "center",
      borderRadius: 8,
      marginBottom: 12,
    },
    headerButtonsView: {
      flexDirection: "row",
      alignItems: "center",
    },
  });

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.cancelled) {
        const res = await fetch(result.uri);
        let blob = await res.blob();
        setImageUri(result.uri);
        setImageBlob(blob);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const validateForm = (): boolean => {
    return title.trim().length !== 0 && body.trim().length !== 0;
  };
  const submitPost = async () => {
    setSubmitting(true);
    if (!validateForm()) {
      setMessage("Are you sure all the fields are filled?");
      setSubmitting(false);
      return;
    }
    try {
      const user = firebase.default.auth().currentUser;
      let db = firebase.default.firestore().collection("users");
      let data = await db.doc(user?.uid).get();
      let userDetails: User = (data.data() as unknown) as User;
      const newPost: PostProps = {
        body: body,
        title: title,
        nickname: userDetails.nickname,
        profilePicture: userDetails.profilePicture,
        time: firebase.default.firestore.Timestamp.now(),
        userUID: user?.uid,
      };
      let result = await firebase.default
        .firestore()
        .collection("posts")
        .add(newPost);
      if (imageBlob) {
        let storageRef = firebase.default
          .storage()
          .ref("images/users/posts/" + result.id);
        await storageRef.put(imageBlob);
        let downloadUrl = await storageRef.getDownloadURL();
        await firebase.default
          .firestore()
          .collection("posts")
          .doc(result.id)
          .update({
            imageUrl: downloadUrl,
            postID: result.id,
          });
      } else
        await firebase.default
          .firestore()
          .collection("posts")
          .doc(result.id)
          .update({
            postID: result.id,
          });
      setMessage("Successfully posted! 🎉");
      setSubmitting(false);
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } catch (error) {
      setMessage(error.message);
      setSubmitting(false);
    }
  };

  const goBack = () => navigation.goBack();
  const goToPreview = () => navigation.navigate("PreviewScreen");
  const dismissAlert = () => setMessage(null);
  return (
    <SafeAreaView style={styles.mainBody}>
      <Header
        left={
          <IconButton icon="arrow-left" color={activeColor} onPress={goBack} />
        }
        title="Create a post"
        right={
          <View style={styles.headerButtonsView}>
            {/* <Button
                mode="text"
                fontSize={10}
                text="Preview"
                onPress={goToPreview}
              /> */}
            <IconButton
              icon="image"
              onPress={pickImage}
              color={activeColor}
              disabled={submitting}
              size={18}
            />
            <IconButton
              icon="plus"
              onPress={submitPost}
              color={activeColor}
              disabled={submitting || !firebase.default.auth().currentUser}
              size={18}
            />
          </View>
        }
      />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 16 }}>
          <TextInput
            value={title}
            style={styles.title}
            placeholderTextColor={colors.placeholder}
            placeholder="Title"
            multiline={false}
            onChangeText={(value) => setTitle(value)}
          />
          <TextInput
            value={body}
            style={styles.body}
            placeholderTextColor={colors.placeholder}
            placeholder="Body"
            multiline={true}
            onChangeText={(value) => setBody(value)}
          />
        </View>
        <Image
          source={{ uri: imageUri ? imageUri : "" }}
          style={styles.imagePreview}
        />
      </ScrollView>
      {message && (
        <Alert message={message} action={true} onPress={dismissAlert} />
      )}
    </SafeAreaView>
  );
}

export { CreatePost };
