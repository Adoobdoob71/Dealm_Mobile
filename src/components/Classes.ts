import * as firebase from "firebase";

interface User {
  userUID: string;
  profilePicture: string;
  nickname: string;
  email: string;
  online: boolean;
  lastOnline: string;
  private_messages?: Map<String, PrivateRoom>;
  backgroundPicture: string;
}

interface PrivateRoom {
  roomID: string;
  guestUID: string;
}

interface PostProps {
  userUID: string | undefined;
  title: string;
  body: string;
  imageUrl?: string;
  nickname: string;
  profilePicture: string;
  time: firebase.default.firestore.Timestamp;
}

interface ContactProps {
  profilePicture?: string;
  nickname: string;
  description: string;
  userUID: string;
  onPress?: () => void;
}

interface ReplyProps {
  title: string;
  body: string;
  imageUrl?: string;
  time: firebase.default.firestore.Timestamp;
}

interface MessageProps {
  text: string;
  userUID: string;
  nickname: string;
  profilePicture: string;
  time: firebase.default.firestore.Timestamp;
  imageUrl?: string;
  replyData?: ReplyProps;
}

export {
  User,
  PrivateRoom,
  PostProps,
  ContactProps,
  ReplyProps,
  MessageProps
}