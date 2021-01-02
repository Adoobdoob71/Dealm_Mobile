import * as React from "react";
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { IconButton, useTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { BackButton } from "../components/BackButton";
import { User } from "../components/Classes";
import { Header } from "../components/Header";
import { Message, MessageProps } from "../components/Message";
import { UserStatus } from "../components/UserStatus";
import * as ImagePicker from "expo-image-picker";
import * as firease from "firebase";

interface ChatProps {
  userUID?: string;
  user?: User;
  replyToPost?: boolean;
}

function Chat({ route }: any) {
  const { colors } = useTheme();
  const [messages, setMessages] = React.useState<MessageProps[]>([]);
  const [imageBlob, setImageBlob] = React.useState<Blob | null>(null);
  const [imageUri, setImageUri] = React.useState<string>("");
  const [message, setMessage] = React.useState<string | null>("");
  const [textMessage, setTextMessage] = React.useState<string>("");
  const [submitting, setSubmitting] = React.useState<boolean>(true);

  const { isThemeDark } = React.useContext(PreferencesContext);
  const activeColor = isThemeDark ? colors.primary : colors.text;
  const flatListHeight = Dimensions.get("screen").height - 56 - 100;
  const { profilePicture, nickname, userUID } = route.params;
  const styles = StyleSheet.create({
    chatBox: {
      width: "100%",
      paddingHorizontal: 10,
      paddingVertical: 8,
      backgroundColor: colors.surface,
    },
    chatBoxBottom: {
      flexDirection: "row",
      alignItems: "center",
    },
    textInput: {
      backgroundColor: colors.background,
      flex: 1,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 8,
      marginHorizontal: 8,
      color: colors.text,
    },
    imageBackground: {
      display: imageBlob ? "flex" : "none",
      height: Dimensions.get("screen").height * 0.3,
      flex: 1,
      marginRight: 8,
    },
    specialDataView: {
      display: imageBlob ? "flex" : "none",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
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

  const sendText = async () => {
    if (textMessage.trim().length == 0) {
      return;
    }
    // firebase.default.firestore().collection("rooms").doc()
  };

  const onChangeTextMessage = (value: string) => setTextMessage(value);

  const removeImage = () => {
    setImageBlob(null);
    setImageUri("");
  };

  React.useEffect(() => {}, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        center={
          <UserStatus nickname={nickname} status={true} userUID={userUID} />
        }
        left={<BackButton imageUrl={profilePicture} />}
        right={
          <IconButton
            icon="dots-vertical"
            color={activeColor}
            onPress={() => {}}
            size={21}
          />
        }
      />
      <FlatList
        data={messages}
        style={{ flex: 1 }}
        renderItem={({ item }) => <Message {...item} />}
      />
      <View style={styles.chatBox}>
        <View style={styles.specialDataView}>
          {/* <ImageBackground
            style={styles.imageBackground}
            source={{ uri: imageUri }}
            imageStyle={{ borderRadius: 8 }}>
            <IconButton
              icon="close"
              color={activeColor}
              onPress={removeImage}
              size={16}
              background={colors.backdrop}
            />
          </ImageBackground>
          <IconButton
            icon="pencil"
            color={colors.accent}
            onPress={() => {}}
            size={16}
          /> */}
        </View>
        <View style={styles.chatBoxBottom}>
          {/* <IconButton
            icon="attachment"
            color={activeColor}
            size={16}
            onPress={pickImage}
          /> */}
          <TextInput
            value={textMessage}
            onChangeText={onChangeTextMessage}
            style={styles.textInput}
            placeholder="Say something"
            placeholderTextColor={colors.placeholder}
          />
          <IconButton
            icon="send"
            color={activeColor}
            size={16}
            onPress={sendText}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export { Chat, ChatProps };
