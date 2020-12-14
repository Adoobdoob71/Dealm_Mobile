import * as React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { PreferencesContext } from '../../Theming';

interface ContactProps {
  profilePicture?: string;
  nickname: string;
  description: string;
}

function Contact(props : ContactProps){
  const { colors } = useTheme();
  const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);
  const styles = StyleSheet.create({
    contactView: {
      flexDirection: "row",
      padding: 10,
      alignItems: "center",
    },
    profilePicture: {
      width: 48,
      height: 48,
      borderRadius: 24
    },
    contactDetails: {
      flexDirection: "column",
      flex: 1,
      marginHorizontal: 10
    },
    contactNickname: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "bold"
    },
    contactDescription: {
      fontSize: 14,
      marginTop: 4,
      color: colors.placeholder,
    }
  })
  return (
    <>
      <TouchableRipple onPress={() => {}} rippleColor={colors.primary}>
        <View style={styles.contactView}>
        <Image source={{ uri: props.profilePicture }} style={styles.profilePicture} />
        <View style={styles.contactDetails}>
          <Text style={styles.contactNickname}>{props.nickname}</Text>
          <Text style={styles.contactDescription}>{props.description}</Text>
        </View>
        </View>
      </TouchableRipple>
      {/* <View style={styles.bar}></View> */}
    </>
  )
}

export {
  Contact,
  ContactProps
}