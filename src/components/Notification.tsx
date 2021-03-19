import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Dimensions,
  SafeAreaView,
  Animated,
  Easing
} from "react-native";
import { useTheme } from "react-native-paper";

interface NotificationProps {
  text: string;
  onPress?: () => void;
  timeMax: number;
  currentTime: number;
  nickname: string;
}

const Notification: React.FC<NotificationProps> = (props) => {
  const [growAnim, setGrowAnim] = React.useState<number>(1);

  const SPEED = 0.2; // The less, the slower
  const SMOOTHNESS = 10; // The less, the smoother

  const growAnimation = () => {
    if (growAnim >= 99.75)
      return;
    setGrowAnim(growAnim + SPEED);
  };
  
  React.useEffect(() => {
    setTimeout(() => {
      growAnimation();
    }, SMOOTHNESS);
  }, [growAnim]);

  const { colors } = useTheme();
  const screenHeight = Dimensions.get("screen").height;
  const screenWidth = Dimensions.get("screen").width;
  const styles = styleClasses(colors, props, screenHeight, screenWidth);
  return (
    <SafeAreaView style={styles.mainView}>
      <View style={{ flexDirection: "row", alignItems: "center", margin: 16 }}>
        <Text style={styles.nickname} numberOfLines={1} ellipsizeMode="tail">
          {props.nickname}:
        </Text>
        <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
          {props.text}
        </Text>
      </View>
      <View
        style={[styles.progressBar, { width: `${growAnim}%` }]}></View>
    </SafeAreaView>
  );
};

function styleClasses(
  colors: any,
  props: NotificationProps,
  screenHeight: number,
  screenWidth: number
) {
  return StyleSheet.create({
    mainView: {
      borderTopRightRadius: 8,
      borderTopLeftRadius: 8,
      backgroundColor: colors.surface,
      position: "absolute",
      ...Platform.select({
        web: {
          top: screenHeight * 0.075,
          left: screenWidth * 0.1,
          right: screenWidth * 0.1,
        },
        default: {
          width: screenWidth * 0.85,
          top: screenHeight * 0.075,
          left: (screenWidth - screenWidth * 0.85) / 2,
        },
      }),
      elevation: 2,
    },
    nickname: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "bold",
      marginRight: 12,
    },
    text: {
      fontSize: 14,
      color: colors.text,
      flex: 1,
    },
    progressBar: {
      backgroundColor: colors.accent,
      height: 1,
    },
  });
}

export { Notification, NotificationProps };
