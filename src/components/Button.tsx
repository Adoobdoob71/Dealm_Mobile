import * as React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ViewProps,
  TouchableNativeFeedback,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  ActivityIndicator,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ButtonProps extends ViewProps {
  mode: "full" | "bordered" | "text";
  text?: string;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  color?: string;
  onPress: () => void;
  iconButton?: boolean;
  fontSize?: number;
}

function Button(props: ButtonProps) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    button: {
      backgroundColor:
        props.disabled || props.loading
          ? props.mode === "full"
            ? colors.disabled
            : "transparent"
          : props.mode === "full"
          ? props.color
            ? props.color
            : colors.primary
          : "transparent",
      borderRadius: 6,
      borderWidth: props.mode === "bordered" ? 1 : undefined,
      borderColor:
        props.mode === "bordered"
          ? props.disabled || props.loading
            ? colors.disabled
            : colors.primary
          : undefined,
      flexDirection: "row",
      paddingHorizontal: 8,
      paddingVertical: 6,
      alignItems: "center",
    },
    left: {
      marginEnd: 10,
    },
    text: {
      color:
        props.mode === "full"
          ? props.disabled || props.loading
            ? colors.disabled
            : "#FFFFFF"
          : props.disabled || props.loading
          ? colors.disabled
          : colors.primary,
      fontSize: props.fontSize ? props.fontSize : 14,
      fontWeight: "bold",
      textTransform: "uppercase",
      opacity: props.disabled || props.loading ? 0.6 : 1,
      display: props.text ? "flex" : "none",
    },
  });
  return (
    <View
      style={[
        {
          borderRadius: 6,
          overflow: "hidden",
          elevation: props.mode === "full" ? 1 : 0,
        },
        props.style,
      ]}>
      <TouchableRipple
        onPress={props.onPress}
        disabled={props.loading || props.disabled}
        rippleColor={Platform.OS === "web" ? "#ff8e7175" : undefined}
        background={
          Platform.OS === "android"
            ? TouchableNativeFeedback.Ripple(colors.primary, true)
            : undefined
        }>
        <View style={styles.button}>
          {props.loading ? (
            <ActivityIndicator
              size={16}
              color={
                props.mode === "full"
                  ? props.disabled || props.loading
                    ? colors.disabled
                    : "#FFFFFF"
                  : props.disabled || props.loading
                  ? colors.disabled
                  : colors.primary
              }
              style={styles.left}
            />
          ) : (
            props.icon && (
              <MaterialCommunityIcons
                name={props.icon}
                size={props.fontSize ? props.fontSize + 4 : 18}
                color={
                  props.mode === "full"
                    ? props.disabled || props.loading
                      ? colors.disabled
                      : "#FFFFFF"
                    : props.disabled || props.loading
                    ? colors.disabled
                    : colors.primary
                }
                style={styles.left}
              />
            )
          )}
          <Text style={styles.text}>{props.text}</Text>
        </View>
      </TouchableRipple>
    </View>
  );
}

export { Button, ButtonProps };
