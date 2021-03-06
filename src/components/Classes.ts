import * as firebase from "firebase";

interface User {
  userUID: string | undefined;
  profilePicture: string;
  nickname: string;
  email: string;
  online: boolean;
  lastOnline: firebase.default.firestore.Timestamp;
  private_messages?: Map<String, PrivateRoom>;
  backgroundPicture: string;
  description?: string;
  createdOn?: firebase.default.firestore.Timestamp
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
  profilePicture?: string;
  time: firebase.default.firestore.Timestamp;
  postID?: string;
}

interface ContactProps {
  profilePicture?: string;
  nickname: string;
  description: string;
  userUID: string;
  onPress?: () => void;
  roomID?: string;
}

interface ReplyProps {
  title: string;
  body: string;
  imageUrl?: string;
  postID: string;
  profilePicture?: string;
  nickname?: string;
  time: firebase.default.firestore.Timestamp;
}

interface MessageProps {
  text: string;
  userUID?: string;
  nickname?: string;
  profilePicture?: string;
  time?: firebase.default.firestore.Timestamp;
  imageUrl?: string;
  replyData?: ReplyProps;
}

interface RoomProps {
  userUID: string;
  roomID: string;
}

export {
  User,
  PrivateRoom,
  PostProps,
  ContactProps,
  ReplyProps,
  MessageProps,
  RoomProps
}