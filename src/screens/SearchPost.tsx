import * as React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import * as firebase from "firebase";
import { PostProps } from "../components/Post";
import { IconButton, withTheme } from "react-native-paper";
import { Header } from "../components/Header";
import { PreferencesContext } from "../../Theming";
import PostSnippet from "../components/PostSnippet";

interface state {
  posts: firebase.default.firestore.QueryDocumentSnapshot<PostProps>[];
  queryString: string;
}
class SearchPost extends React.Component<any, state> {
  constructor(props: any) {
    super(props);
    this.state = {
      posts: [],
      queryString: "",
    };
  }

  static contextType = PreferencesContext;

  changeQuery = async (value: string) => {
    this.setState({ queryString: value });
    let result = await firebase.default
      .firestore()
      .collection("posts")
      .orderBy("title")
      .startAt(this.state.queryString)
      .endAt(this.state.queryString + "\uf8ff")
      .get();
    let docs = result.docs as firebase.default.firestore.QueryDocumentSnapshot<PostProps>[];
    this.setState({ posts: docs });
  };

  render() {
    const colors = this.props.theme.colors;
    const { isThemeDark } = this.context;
    const activeColor = isThemeDark ? colors.primary : colors.text;
    const goBack = () => this.props.navigation.goBack();
    const styles = StyleSheet.create({
      mainView: {
        flex: 1,
      },
      searchField: {
        flex: 1,
        borderRadius: 8,
        backgroundColor: colors.background,
        paddingHorizontal: 8,
        paddingVertical: 6,
        color: colors.text,
      },
    });
    return (
      <SafeAreaView style={styles.mainView}>
        <Header
          left={
            <IconButton
              icon="arrow-left"
              onPress={goBack}
              color={activeColor}
            />
          }
          center={
            <TextInput
              value={this.state.queryString}
              onChangeText={this.changeQuery}
              style={styles.searchField}
              placeholder="Search anything"
              placeholderTextColor={colors.placeholder}
            />
          }
        />
        <FlatList
          data={this.state.posts}
          style={{ height: 0 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }}></View>}
          renderItem={({ item, index }) => (
            <PostSnippet
              {...item.data()}
              key={index}
              onPress={() =>
                this.props.navigation.navigate("PostScreen", { ...item.data() })
              }
            />
          )}
        />
      </SafeAreaView>
    );
  }
}

export default withTheme(SearchPost);
