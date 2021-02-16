import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Image,
  FlatList,
  Alert,
} from "react-native";
import { IconButton, useTheme, withTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { Header } from "../components/Header";
import * as firebase from "firebase";
import { PostProps, User } from "../components/Classes";
import { Post } from "../components/Post";
import { Button } from "../components/Button";

interface state {
  userDetails: (User & { postsAmount: number; friendsAmount: number }) | null;
  posts: firebase.default.firestore.QueryDocumentSnapshot<PostProps>[];
}
class Profile extends React.Component<any, state> {
  constructor(props: any) {
    super(props);
    this.state = {
      userDetails: null,
      posts: [],
    };
  }

  static contextType = PreferencesContext;

  loadUserDetails = async (userUID?: string) => {
    let ref = firebase.default.firestore().collection("users").doc(userUID);
    let result = await ref.get();
    let userData: User & {
      postsAmount: number;
      friendsAmount: number;
    } = result.data() as User & { postsAmount: number; friendsAmount: number };
    let postsResult = await firebase.default
      .firestore()
      .collection("posts")
      .where("userUID", "==", userUID)
      .get();
    let postsResultData = postsResult.docs as firebase.default.firestore.QueryDocumentSnapshot<PostProps>[];
    this.setState({ posts: postsResultData });
    userData.postsAmount = postsResult.docs.length;
    let friendsAmountResult = await ref.collection("contacts").get();
    userData.friendsAmount = friendsAmountResult.docs.length;
    this.setState({ userDetails: userData });
  };

  componentDidMount() {
    let userProfile = this.props.route.params.bottomNavigator;
    if (userProfile) {
      firebase.default.auth().onAuthStateChanged((user) => {
        if (user) {
          this.loadUserDetails(user?.uid);
        } else this.setState({ posts: [], userDetails: null });
      });
    } else {
      this.loadUserDetails(this.props.route.params.userUID);
    }
  }
  render() {
    const colors = this.props.theme.colors;
    const { isThemeDark } = this.context;
    const navigation = this.props.navigation;
    const activeColor = isThemeDark ? colors.primary : colors.text;

    const goBack = () => this.props.navigation.goBack();
    const openSettingsWindow = () => this.props.navigation.navigate("Settings");

    const styles = StyleSheet.create({
      header: {
        flexDirection: "column",
        marginBottom: 12,
      },
      content: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
      },
      profilePicture: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: activeColor,
      },
      nickname: {
        fontSize: 21,
        color: colors.text,
        fontWeight: "bold",
        marginRight: 12,
      },
      profileDetails: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        margin: 8,
      },
      activeSince: {
        fontSize: 12,
        color: colors.placeholder,
      },
      profileTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 8,
      },
    });
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          title={this.state.userDetails?.nickname}
          left={
            this.props.route.params.bottomNavigator ? undefined : (
              <IconButton icon="close" color={activeColor} onPress={goBack} />
            )
          }
          right={
            this.props.route.params.bottomNavigator && (
              <IconButton
                icon="cog"
                color={activeColor}
                onPress={openSettingsWindow}
                size={21}
              />
            )
          }
        />
        <FlatList
          data={this.state.posts}
          style={{ height: 0 }}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <View style={styles.content}>
                <Image
                  source={{ uri: this.state.userDetails?.profilePicture }}
                  style={styles.profilePicture}
                />
                <View style={{ flex: 1, marginHorizontal: 10 }}>
                  <View style={styles.profileTop}>
                    <Text
                      style={styles.nickname}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {this.state.userDetails?.nickname}
                    </Text>
                  </View>
                  <View style={styles.profileDetails}>
                    <ProfileDetailView
                      title="Posts"
                      amount={this.state.userDetails?.postsAmount}
                    />
                    <ProfileDetailView
                      title="Friends"
                      amount={this.state.userDetails?.friendsAmount}
                    />
                    <ProfileDetailView
                      title="Created on"
                      amount={this.state.userDetails?.createdOn
                        ?.toDate()
                        .toDateString()}
                    />
                  </View>
                </View>
              </View>
              <View
                style={{
                  height: 0.25,
                  backgroundColor: colors.accent,
                  width: "90%",
                  alignSelf: "center",
                }}></View>
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 0.25,
                backgroundColor: colors.accent,
                width: "90%",
                alignSelf: "center",
              }}></View>
          )}
          renderItem={({ item }) => <Post {...item.data()} key={item.id} />}
        />
      </SafeAreaView>
    );
  }
}

function ProfileDetailView(props: { title: string; amount?: any }) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    parent: {
      flexDirection: "column",
      alignItems: "center",
    },
    title: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "bold",
    },
    amount: {
      fontSize: 12,
      marginTop: 4,
      color: colors.text,
    },
  });
  return (
    <View style={styles.parent}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.amount}>{props.amount ? props.amount : "N/A"}</Text>
    </View>
  );
}
export default withTheme(Profile);
