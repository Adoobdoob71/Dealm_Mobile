import * as React from "react";
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Button as PaperButton,
  IconButton,
  useTheme,
} from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { TextField } from "../components/TextField";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { ScrollView } from "react-native-gesture-handler";
import * as firebase from "firebase";
import { Alert } from "../components/Alert";

function Login() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [randomizedImage, setRandomizedImage] = React.useState<any>(null);

  const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);
  const activeColor = isThemeDark ? colors.primary : "#FFFFFF";
  const images = [
    "https://i.pinimg.com/originals/e3/dc/ab/e3dcab0829e56f4f1c9d58099f080de9.png",
    "https://i.pinimg.com/originals/76/f2/3e/76f23ef08dc1ebabf4589ca0daa1fc14.jpg",
    "https://i.pinimg.com/originals/8a/74/6d/8a746d8eb265ab3ef533fa491e93f8b4.jpg",
    "https://wallpaperstock.net/wallpapers/thumbs1/6898.jpg",
    "https://images.pexels.com/photos/2526105/pexels-photo-2526105.jpeg",
    "https://media-cdn.tripadvisor.com/media/photo-s/0a/fc/ff/66/kayuputi-at-st-regis.jpg",
  ];

  const styles = StyleSheet.create({
    window: {
      flex: 1,
      backgroundColor: colors.background,
      position: "relative",
    },
    title: {
      fontSize: 42,
      color: "#FFFFFF",
      fontWeight: "bold",
      marginVertical: 16,
    },
    textFieldsView: {
      marginVertical: 48,
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
  });

  const closeWindow = () => navigation.goBack();
  const togglePasswordSecurity = () => setShowPassword(!showPassword);
  const dismissAlert = () => setMessage(null);

  const loginWithEmailAndPassword = () => {
    setLoading(true);
    setMessage(null);
    firebase.default
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        setMessage("Successfully signed in! 🎉");
        setLoading(false);
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      })
      .catch((error) => {
        setMessage(error.message);
        setLoading(false);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      });
  };
  React.useEffect(() => {
    setInterval(() => {
      setRandomizedImage(images[Math.floor(Math.random() * 6)]);
    }, 10000);
  }, []);

  return (
    <SafeAreaView style={styles.window}>
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
              size={24}
              onPress={closeWindow}
            />
          }
          style={{ backgroundColor: colors.backdrop }}
        />
        <ScrollView
          style={{
            flex: 1,
            paddingHorizontal: 12,
            backgroundColor: colors.backdrop,
          }}>
          <Text style={styles.title}>Login to your account.</Text>
          <View style={styles.textFieldsView}>
            <View style={styles.textField}>
              <TextInput
                keyboardType="email-address"
                placeholder="Email"
                style={{ color: "#FFF", flex: 1, fontSize: 14 }}
                placeholderTextColor={colors.placeholder}
                value={email}
                onChangeText={(value) => setEmail(value)}
              />
            </View>
            <View style={{ height: 21 }}></View>
            <View style={styles.textField}>
              <TextInput
                placeholder="Password"
                secureTextEntry={showPassword === false}
                style={{ color: "#FFF", flex: 1, fontSize: 14 }}
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
                style={{ marginStart: 6 }}
                animated
              />
            </View>
          </View>
          <Button
            mode="full"
            onPress={loginWithEmailAndPassword}
            text="Login"
            icon="chevron-right"
            style={{ alignSelf: "flex-end" }}
            loading={loading}
          />
        </ScrollView>
      </ImageBackground>
      {message && (
        <Alert message={message} action={true} onPress={dismissAlert} />
      )}
    </SafeAreaView>
  );
}

export { Login };
