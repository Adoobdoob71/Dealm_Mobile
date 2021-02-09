import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
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
    contentView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: -96,
      padding: 24,
    },
    title: {
      fontSize: 24,
      color: colors.text,
      fontWeight: "bold",
    },
    description: {
      fontSize: 14,
      color: colors.text,
      marginTop: 16,
    },
    linksView: {
      marginTop: 12,
    },
    linkView: {
      flexDirection: "column",
      alignItems: "center",
    },
    linkDescription: {
      fontSize: 12,
      color: colors.text,
    },
    link: {
      fontSize: 12,
      color: "#5050BA",
      fontWeight: "bold",
    },
  });
  return (
    <SafeAreaView style={styles.mainView}>
      <Header
        title="About me"
        left={<IconButton icon="close" onPress={goBack} color={activeColor} />}
      />
      <View style={styles.contentView}>
        <Text style={styles.title}>Hello there!</Text>
        <Text style={styles.description}>
          My name is Elad Mekonen, I'm mobile/web developer that likes to
          awesome stuff
        </Text>
        <View style={styles.linksView}>
          <View style={styles.linkView}>
            <Text style={styles.linkDescription}>My GitHub: </Text>
            <Text style={styles.link}>https://github.com/Adoobdoob71</Text>
          </View>
          <View style={styles.linkView}>
            <Text style={styles.linkDescription}>This project: </Text>
            <Text style={styles.link}>
              https://github.com/Adoobdoob71/Dealm_Mobile
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default About;
