interface User {
  userUID: string;
  profilePicture: string;
  nickname: string;
  email: string;
  online: boolean;
  lastOnline: string;
  private_messages?: Map<String, PrivateRoom>;
}

interface PrivateRoom {
  roomID: string;
  guestUID: string;
}


export {
  User,
  PrivateRoom
}