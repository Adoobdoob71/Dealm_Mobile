import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { useTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { Button } from "./Button";

interface AlertProps {
  message: string;
  action?: boolean;
  howLong?: number;
  indefinite?: boolean;
}

function Alert(props: AlertProps) {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { isThemeDark } = React.useContext(PreferencesContext);
  const [visible, setVisible] = React.useState(true);
  const styles = StyleSheet.create({
    background: {
      borderRadius: 8,
      borderLeftWidth: 10,
      backgroundColor: colors.surface,
      borderColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 8,
      elevation: 1,
      display: visible ? "flex" : "none",
      margin: 8,
    },
    message: {
      fontSize: 12,
      color: colors.text,
      flex: 1,
    },
  });

  React.useEffect(() => {
    !props.indefinite &&
      setTimeout(
        () => {
          setVisible(false);
        },
        props.howLong ? props.howLong : 3000
      );
  }, []);
  const dismiss = () => setVisible(false);
  return (
    <SafeAreaView style={styles.background}>
      <Text style={styles.message}>{props.message}</Text>
      {props.action && (
        <Button
          mode="text"
          style={{ marginLeft: 8 }}
          onPress={dismiss}
          text="Close"
        />
      )}
    </SafeAreaView>
  );
}

export { Alert, AlertProps };
