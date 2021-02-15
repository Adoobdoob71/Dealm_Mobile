import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { TouchableRipple, useTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { PostProps } from "./Post";

function PostSnippet(props: PostProps & { onPress?: () => void }) {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { isThemeDark } = React.useContext(PreferencesContext);
  const activeColor = isThemeDark ? colors.primary : colors.text;
  const styles = StyleSheet.create({
    mainView: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
    },
    postImage: {
      width: 40,
      height: 40,
      borderRadius: 8,
    },
    postDetailsView: {
      flex: 1,
      marginHorizontal: 10,
    },
    nickname: {
      fontSize: 10,
      marginBottom: 2,
      color: colors.placeholder,
    },
    title: {
      fontSize: 12,
      color: colors.text,
      fontWeight: "bold",
    },
    body: {
      fontSize: 10,
      color: colors.text,
    },
  });
  return (
    <TouchableRipple onPress={props.onPress} rippleColor={colors.primary}>
      <View style={styles.mainView}>
        <View style={styles.postDetailsView}>
          <Text style={styles.nickname} numberOfLines={1} ellipsizeMode="tail">
            Posted by - {props.nickname}
          </Text>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {props.title}
          </Text>
          <Text style={styles.body} numberOfLines={1} ellipsizeMode="tail">
            {props.body}
          </Text>
        </View>
        {props.imageUrl && (
          <Image style={styles.postImage} source={{ uri: props.imageUrl }} />
        )}
      </View>
    </TouchableRipple>
  );
}

export default PostSnippet;
