import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
} from "react-native";
import { useTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { Button } from "./Button";

interface AlertProps {
  message: string;
  action?: boolean;
  howLong?: number;
  indefinite?: boolean;
  onPress?: () => void;
}

function Alert(props: AlertProps) {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { isThemeDark } = React.useContext(PreferencesContext);
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const styles = StyleSheet.create({
    background: {
      borderRadius: 8,
      borderLeftWidth: 10,
      backgroundColor: colors.surface,
      borderColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      elevation: 1,
      margin: 8,
      position: "absolute",
      ...Platform.select({
        web: {
          top: screenHeight * 0.9,
          left: screenWidth * 0.1,
          right: screenWidth * 0.1,
          paddingHorizontal: 14,
          paddingVertical: 12,
        },
        default: {
          top: screenHeight * 0.85,
          left: screenWidth * 0.1,
          right: screenWidth * 0.1,
          paddingHorizontal: 12,
          paddingVertical: 10,
        },
      }),
    },
    message: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "bold",
      flex: 1,
      marginHorizontal: 12,
    },
  });
  return (
    <SafeAreaView style={styles.background}>
      <Text style={styles.message} numberOfLines={1} ellipsizeMode="tail">
        {props.message}
      </Text>
      {props.action && (
        <Button
          mode="text"
          style={{ marginLeft: 8 }}
          onPress={props.onPress}
          text="Close"
        />
      )}
    </SafeAreaView>
  );
}

export { Alert, AlertProps };
