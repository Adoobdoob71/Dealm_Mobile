import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Badge, useTheme } from "react-native-paper";

interface UserStatusProps {
  nickname: string;
  status: boolean;
  userUID: string;
  lastOnline: string;
  onPress?: () => void;
}

function UserStatus({
  nickname,
  status,
  userUID,
  lastOnline,
  onPress,
}: UserStatusProps) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    body: {
      flex: 1,
      marginHorizontal: 12,
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
      fontSize: 12,
      color: colors.placeholder,
      marginRight: 8,
    },
    badge: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: status ? "#17ff3e" : "#6b6b6b",
    },
  });
  return (
    <View style={styles.body}>
      <Text style={styles.nickname} onLongPress={onPress}>
        {nickname}
      </Text>
      <View style={styles.status}>
        <Text style={styles.statusText}>
          {status ? "Online" : `Last seen ${lastOnline}`}
        </Text>
        <View style={styles.badge}></View>
      </View>
    </View>
  );
}

export { UserStatus, UserStatusProps };
