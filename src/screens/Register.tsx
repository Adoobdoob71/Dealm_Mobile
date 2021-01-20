import * as React from "react";
import * as firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { FAB, IconButton, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Button } from "../components/Button";
import { PrivateRoom, User } from "../components/Classes";
import { Header } from "../components/Header";
import { PreferencesContext } from "../../Theming";
import { Alert } from "../components/Alert";

function Register() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { isThemeDark } = React.useContext(PreferencesContext);
  const activeColor = isThemeDark ? colors.primary : "#FFFFFF";

  const [email, setEmail] = React.useState<string>("");
  const [nickname, setNickname] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [imageBlob, setImageBlob] = React.useState<Blob | null>(null);
  const [imageUri, setImageUri] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [randomizedImage, setRandomizedImage] = React.useState<any>(null);
  const [disabledButton, setDisabledButton] = React.useState<boolean>(false);

  const images = [
    "https://i.pinimg.com/originals/e3/dc/ab/e3dcab0829e56f4f1c9d58099f080de9.png",
    "https://i.pinimg.com/originals/76/f2/3e/76f23ef08dc1ebabf4589ca0daa1fc14.jpg",
    "https://i.pinimg.com/originals/8a/74/6d/8a746d8eb265ab3ef533fa491e93f8b4.jpg",
    "https://wallpaperstock.net/wallpapers/thumbs1/6898.jpg",
    "https://images.pexels.com/photos/2526105/pexels-photo-2526105.jpeg",
    "https://media-cdn.tripadvisor.com/media/photo-s/0a/fc/ff/66/kayuputi-at-st-regis.jpg",
  ];

  const styles = StyleSheet.create({
    body: {
      flex: 1,
      backgroundColor: colors.background,
      position: "relative",
    },
    title: {
      fontSize: 42,
      color: "#FFFFFF",
      fontWeight: "bold",
      marginBottom: 12,
      marginHorizontal: 16,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.surface,
    },
    textField: {
      paddingHorizontal: 8,
      height: 42,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
    },
    fab: {
      marginLeft: -21,
      alignSelf: "flex-end",
    },
    imageView: {
      flexDirection: "row",
      justifyContent: "center",
    },
    textFieldsView: {
      marginTop: 42,
      justifyContent: "center",
      paddingHorizontal: 16,
    },
  });

  React.useEffect(() => {
    setInterval(() => {
      setRandomizedImage(images[Math.floor(Math.random() * 6)]);
    }, 10000);
  }, []);

  const togglePasswordSecurity = () => setShowPassword(!showPassword);
  const goBack = () => navigation.goBack();
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
    return !(
      email.trim().length === 0 ||
      password.trim().length === 0 ||
      nickname.trim().length === 0
    );
  };
  const registerWithEmailAndPassword = () => {
    setLoading(true);
    if (!validateForm()) {
      setMessage("Check your form, some of the inputs are empty");
      setLoading(false);
      setTimeout(() => setMessage(null), 5000);
      return;
    }
    try {
      firebase.default
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async ({ user }) => {
          let storageRef = firebase.default
            .storage()
            .ref("images/users")
            .child(user.uid);
          let db = firebase.default.firestore().collection("users");
          await storageRef.put(imageBlob);
          let result = await storageRef.getDownloadURL();
          const newUser: User = {
            email: email.trim(),
            nickname: nickname.trim(),
            online: true,
            lastOnline: "",
            profilePicture: result,
            userUID: user?.uid,
            backgroundPicture: "",
            description: "Default Description",
          };
          await db.doc(user?.uid).set(newUser);
          setMessage("Successfully registered! 🎉");
          setDisabledButton(true);
          setLoading(false);
          setTimeout(() => {
            navigation.goBack();
          }, 2000);
        });
    } catch (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };
  return (
    <>
      <SafeAreaView style={styles.body}>
        <ImageBackground
          source={randomizedImage && { uri: randomizedImage }}
          style={{
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width,
          }}>
          <Header
            left={
              <IconButton
                icon="close"
                color={activeColor}
                onPress={goBack}
                size={24}
              />
            }
            style={{ backgroundColor: colors.backdrop }}
          />
          <ScrollView style={{ flex: 1, backgroundColor: colors.backdrop }}>
            <Text style={styles.title}>Create a new account.</Text>
            <View style={styles.imageView}>
              <Image
                source={{ uri: imageUri ? imageUri : undefined }}
                style={styles.image}
              />
              <FAB
                icon="image"
                style={styles.fab}
                color={colors.surface}
                onPress={pickImage}
                small
              />
            </View>
            <View style={styles.textFieldsView}>
              <View style={styles.textField}>
                <TextInput
                  keyboardType="email-address"
                  placeholder="Email"
                  style={{ color: colors.text, flex: 1, fontSize: 14 }}
                  placeholderTextColor={colors.placeholder}
                  value={email}
                  onChangeText={(value) => setEmail(value)}
                />
              </View>
              <View style={{ height: 21 }}></View>
              <View style={styles.textField}>
                <TextInput
                  keyboardType="default"
                  placeholder="Nickname"
                  style={{ color: colors.text, flex: 1, fontSize: 14 }}
                  placeholderTextColor={colors.placeholder}
                  value={nickname}
                  onChangeText={(value) => setNickname(value)}
                />
              </View>
              <View style={{ height: 21 }}></View>
              <View style={styles.textField}>
                <TextInput
                  placeholder="Password"
                  secureTextEntry={showPassword}
                  style={{ color: colors.text, flex: 1, fontSize: 14 }}
                  placeholderTextColor={colors.placeholder}
                  value={password}
                  onChangeText={(value) => setPassword(value)}
                />
                <IconButton
                  icon={
                    showPassword === false ? "eye-off-outline" : "eye-outline"
                  }
                  onPress={togglePasswordSecurity}
                  size={16}
                  color={colors.placeholder}
                  style={{ marginLeft: 6 }}
                  animated
                />
              </View>
            </View>
            <Button
              mode="full"
              text="Register"
              onPress={registerWithEmailAndPassword}
              icon="chevron-right"
              loading={loading}
              disabled={disabledButton}
              style={{ alignSelf: "flex-end", margin: 16, marginTop: 24 }}
            />
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
      {message && <Alert message={message} action={true} />}
    </>
  );
}

export { Register };
