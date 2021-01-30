import * as React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  View,
  TouchableNativeFeedback,
} from "react-native";
import { TouchableRipple, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PreferencesContext } from "../../Theming";
import { useNavigation } from "@react-navigation/native";

interface BackButtonProps {
  imageUrl?: string;
}
function BackButton({ imageUrl }: BackButtonProps) {
  const { isThemeDark } = React.useContext(PreferencesContext);

  const { colors } = useTheme();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    body: {
      flexDirection: "row",
      padding: 2,
      alignItems: "center",
      justifyContent: imageUrl ? undefined : "center",
    },
    image: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginLeft: 6,
    },
    barrier: {
      borderRadius: 24,
      width: imageUrl ? 68 : 40,
      height: imageUrl ? 40 : 40,
      overflow: "hidden",
      justifyContent: "center",
    },
  });
  const activeColor = isThemeDark ? colors.primary : colors.text;

  const popScreen = () => navigation.goBack();
  return (
    <View style={styles.barrier}>
      <TouchableRipple
        onPress={popScreen}
        background={
          Platform.OS === "android"
            ? TouchableNativeFeedback.Ripple(
                isThemeDark ? "#FFFFFF42" : colors.primary,
                true
              )
            : undefined
        }>
        <View style={styles.body}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={24}
            color={activeColor}
          />
          {imageUrl && (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          )}
        </View>
      </TouchableRipple>
    </View>
  );
}

export { BackButton, BackButtonProps };
