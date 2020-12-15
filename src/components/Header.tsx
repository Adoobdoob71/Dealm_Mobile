import * as React from "react";
import { StyleSheet, Text, View, ViewProps } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";

interface HeaderProps extends ViewProps {
  left?: JSX.Element;
  right?: JSX.Element;
  title?: string;
  onPress?: () => void;
  subTitle?: string;
  center?: JSX.Element;
  transparent?: boolean;
}

function Header(props: HeaderProps) {
  const { colors } = useTheme();
  const { isThemeDark } = React.useContext(PreferencesContext);
  const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      height: 56,
      borderWidth: 0,
      backgroundColor: props.transparent ? "transparent" : colors.surface,
    },
    headerCenterView: {
      flex: 1,
    },
    headerTitleView: {
      flexDirection: "column",
      flex: 1,
      marginHorizontal: 8,
    },
    headerTitle: {
      fontSize: 21,
      fontWeight: "bold",
      color: isThemeDark ? colors.primary : colors.text,
    },
    headerSubtitle: {
      fontSize: 12,
      color: colors.placeholder,
    },
    left: {
      marginRight: 8,
    },
    right: {
      marginLeft: 8,
    },
  });
  return (
    <TouchableWithoutFeedback
      onPress={props.onPress}
      style={{ width: "100%", borderWidth: 0 }}>
      <View style={[styles.header, props.style]}>
        {props.left}
        {props.center ? (
          props.center
        ) : (
          <View style={styles.headerTitleView}>
            {props.title && (
              <Text style={styles.headerTitle}>{props.title}</Text>
            )}
            {props.subTitle && (
              <Text style={styles.headerSubtitle}>{props.subTitle}</Text>
            )}
          </View>
        )}
        {props.right}
      </View>
    </TouchableWithoutFeedback>
  );
}

export { Header, HeaderProps };
