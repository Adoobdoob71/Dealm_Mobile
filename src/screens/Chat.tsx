import * as React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";
import { BackButton } from "../components/BackButton";
import { User } from "../components/Classes";
import { Header } from "../components/Header";
import { Message, MessageProps } from "../components/Message";
import { UserStatus } from "../components/UserStatus";

interface ChatProps {
  userUID?: string;
  user?: User;
  replyToPost?: boolean;
}

function Chat({ route }: any) {
  const { colors } = useTheme();
  const [messages, setMessages] = React.useState<MessageProps[]>([]);
  const { profilePicture, nickname, userUID } = route.params;
  const styles = StyleSheet.create({});
  React.useEffect(() => {}, []);
  return (
    <SafeAreaView>
      <Header
        center={
          <UserStatus nickname={nickname} status={true} userUID={userUID} />
        }
        left={<BackButton imageUrl={profilePicture} />}
      />
      <FlatList
        data={messages}
        renderItem={({ item }) => <Message {...item} />}
      />
    </SafeAreaView>
  );
}

export { Chat, ChatProps };
