import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  Image,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { Header } from "../components/Header";

function About() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const goBack = () => navigation.goBack();
  const { isThemeDark } = React.useContext(PreferencesContext);
  const activeColor = isThemeDark ? colors.primary : colors.text;
  const styles = StyleSheet.create({
    mainView: {
      flex: 1,
    },
    profile_picture: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 16,
    },
    contentView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: -72,
      padding: 24,
    },
    title: {
      fontSize: 32,
      color: colors.text,
      fontWeight: "bold",
      marginBottom: 16,
    },
    description: {
      fontSize: 16,
      color: colors.text,
      marginTop: 16,
    },
    linksView: {
      marginTop: 16,
    },
    linkView: {
      flexDirection: "column",
      alignItems: "center",
      marginTop: 16,
    },
    linkDescription: {
      fontSize: 14,
      color: colors.text,
    },
    link: {
      fontSize: 14,
      color: "#9C9CFF",
      fontWeight: "bold",
      textDecorationLine: "underline",
    },
  });
  return (
    <SafeAreaView style={styles.mainView}>
      <Header
        title="About"
        left={<IconButton icon="close" onPress={goBack} color={activeColor} />}
      />
      <View style={styles.contentView}>
        <Text style={styles.title}>Hello there!</Text>
        <Image
          source={{
            uri:
              "https://avatars.githubusercontent.com/u/46420655?s=460&u=1f7c2297a716b99ba1fb25332d3b4701f69da7ae&v=4",
          }}
          style={styles.profile_picture}
        />
        <Text style={styles.description}>
          My name is Elad Mekonen, I'm mobile/web developer and I like to make
          awesome stuff
        </Text>
        <View style={styles.linksView}>
          <View style={styles.linkView}>
            <Text style={styles.linkDescription}>My GitHub: </Text>
            <Text style={styles.link} dataDetectorType="link">
              https://github.com/Adoobdoob71
            </Text>
          </View>
          <View style={styles.linkView}>
            <Text style={styles.linkDescription}>This project: </Text>
            <Text style={styles.link} dataDetectorType="link">
              https://github.com/Adoobdoob71/Dealm_Mobile
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default About;
