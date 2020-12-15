import * as React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { BackButton } from "../components/BackButton";
import { User } from "../components/Classes";
import { Header } from "../components/Header";
import { UserStatus } from "../components/UserStatus";

interface ChatProps {
  userUID: string;
  user: User;
}

function Chat({ user, userUID }: ChatProps) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({});
  return (
    <SafeAreaView>
      <Header
        center={<UserStatus nickname="DotWiz" status={true} userUID="12" />}
        left={<BackButton imageUrl={user.profilePicture} />}
      />
    </SafeAreaView>
  );
}
