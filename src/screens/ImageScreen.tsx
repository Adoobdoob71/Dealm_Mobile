import * as React from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { IconButton, withTheme } from "react-native-paper";
import { PreferencesContext } from "../../Theming";
import { Header } from "../components/Header";

interface state {
  aspectRatio: number;
}

class ImageScreen extends React.Component<any, state> {
  constructor(props: any) {
    super(props);
    this.state = {
      aspectRatio: 0,
    };
    Image.getSize(props.route.params.imageUrl, (width, height) => {
      this.setState({ aspectRatio: width / height });
    });
  }

  static contextType = PreferencesContext;

  render() {
    const colors = this.props.theme.colors;
    const { isThemeDark } = this.context;
    const activeColor = isThemeDark ? colors.primary : colors.text;
    const navigation = this.props.navigation;
    const screenHeight = Dimensions.get("screen").height;
    const styles = StyleSheet.create({
      mainView: {
        flex: 1,
      },
      image: {
        width: "100%",
        height: undefined,
        aspectRatio: this.state.aspectRatio,
        maxHeight: screenHeight - 80,
        alignSelf: "center",
      },
    });

    const goBack = () => navigation.goBack();
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          left={
            <IconButton
              icon="arrow-left"
              color={activeColor}
              onPress={goBack}
            />
          }
          title={this.props.route.params.title}
          right={
            <IconButton
              icon="download"
              size={18}
              color={activeColor}
              onPress={() => {}}
            />
          }
        />
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Image
            source={{ uri: this.props.route.params.imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default withTheme(ImageScreen);
