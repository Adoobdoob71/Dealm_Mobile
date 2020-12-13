import * as React from 'react';
import { StyleSheet, Text, View, ViewProps } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ButtonProps extends ViewProps {
  mode: "full" | "bordered" | "text";
  text: string;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  color?: string;
  onPress: () => void;
}

function Button(props : ButtonProps){
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    button: {
      backgroundColor: props.disabled || props.loading ? (props.mode === "full" ? colors.disabled : "transparent") : props.mode === "full" ? colors.primary : "transparent",
      borderRadius: 6,
      borderWidth: props.mode === "bordered" ? 1 : 0,
      borderColor: props.mode === "bordered" ? (props.disabled || props.loading ? colors.disabled : colors.primary) : undefined,
      flexDirection: "row",
      paddingHorizontal: 12,
      paddingVertical: 10,
      alignItems: "center"
    },
    left: {
      marginEnd: 10
    },
    text: {
      color: props.mode === "full" ? (props.disabled || props.loading ? colors.disabled : "#FFFFFF") : props.disabled || props.loading ? colors.disabled : colors.primary,
      fontSize: 14,
      fontWeight: "bold",
      textTransform: "uppercase",
      opacity: props.disabled || props.loading ? 0.6 : 1
    }
  })
  return (
      <TouchableOpacity style={[styles.button, props.style]} onPress={props.onPress} disabled={props.loading || props.disabled}>
        {props.loading ? (
          <ActivityIndicator size={16} color={props.mode === "full" ? (props.disabled || props.loading ? colors.disabled : "#FFFFFF") : props.disabled || props.loading ? colors.disabled : colors.primary} style={styles.left}/>
        ) : props.icon && 
          <MaterialCommunityIcons name={props.icon} size={18} color={props.mode === "full" ? (props.disabled || props.loading ? colors.disabled : "#FFFFFF") : props.disabled || props.loading ? colors.disabled : colors.primary} style={styles.left} />
        }
        <Text style={styles.text}>{props.text}</Text>
     </TouchableOpacity>
  )
}

export {
  Button,
  ButtonProps
}