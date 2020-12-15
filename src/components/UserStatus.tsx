import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Badge, useTheme } from "react-native-paper";

interface UserStatusProps {
  nickname: string;
  status: boolean;
  userUID: string;
}

function UserStatus({ nickname, status, userUID }: UserStatusProps) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    body: {
      flex: 1,
    },
    nickname: {
      fontSize: 18,
      color: colors.text,
    },
    status: {
      flexDirection: "row",
      alignItems: "center",
    },
    statusText: {
      fontSize: 14,
      color: colors.placeholder,
    },
    badge: {
      width: 10,
      height: 10,
      display: status ? "flex" : "none",
      backgroundColor: status ? "#17ff3e" : "#6b6b6b",
    },
  });
  return (
    <View style={styles.body}>
      <Text style={styles.nickname}>{nickname}</Text>
      <View style={styles.status}>
        <Text style={styles.statusText}>{status}</Text>
        <View style={styles.badge}></View>
      </View>
    </View>
  );
}

export { UserStatus, UserStatusProps };
