import * as React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { IconButton, useTheme } from 'react-native-paper';
import { PreferencesContext } from '../../../Theming';
import { Contact, ContactProps } from '../../components/Contact';
import { Header } from '../../components/Header';

function Contacts(){
  const { colors } = useTheme();
  const [contacts, setContacts] = React.useState<ContactProps[]>([]);
  const { isThemeDark } = React.useContext(PreferencesContext);
  const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 8,
      paddingVertical: 6,
      backgroundColor: colors.surface
    },
    seperator: {  
      marginLeft: 64,
      marginRight: 16, 
      height: 0.5, 
      backgroundColor: colors.placeholder 
    },
    headerText: {
      fontSize: 21,
      fontWeight: "bold",
      color: colors.text,
      marginLeft: 8
    }
  });
  React.useEffect(() => {
    setContacts([
      {nickname: "DoritoWizard71", description: "I like riding bikes", profilePicture: "https://images4.alphacoders.com/100/thumb-350-1008904.png"},
      {nickname: "DoritoWizard71", description: "I like riding bikes", profilePicture: "https://images4.alphacoders.com/100/thumb-350-1008904.png"},
      {nickname: "DoritoWizard71", description: "I like riding bikes", profilePicture: "https://images4.alphacoders.com/100/thumb-350-1008904.png"},
      {nickname: "DoritoWizard71", description: "I like riding bikes", profilePicture: "https://images4.alphacoders.com/100/thumb-350-1008904.png"},
      {nickname: "DoritoWizard71", description: "I like riding bikes", profilePicture: "https://images4.alphacoders.com/100/thumb-350-1008904.png"},
      {nickname: "DoritoWizard71", description: "I like riding bikes", profilePicture: "https://images4.alphacoders.com/100/thumb-350-1008904.png"},
      {nickname: "DoritoWizard71", description: "I like riding bikes", profilePicture: "https://images4.alphacoders.com/100/thumb-350-1008904.png"},
      {nickname: "DoritoWizard71", description: "I like riding bikes", profilePicture: "https://images4.alphacoders.com/100/thumb-350-1008904.png"},
    ])
  }, [])

  const seperator = () => (
    <View style={styles.seperator}></View>
  )
  const right = 
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <IconButton icon="magnify" onPress={() => {}} color={isThemeDark ? colors.primary : colors.text} size={21}/>
    <IconButton icon="sort" onPress={() => {}} color={isThemeDark ? colors.primary : colors.text} size={21}/>
  </View>

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Contacts" right={right} />
      <FlatList 
        data={contacts}
        renderItem={({ item, index })  => (
          <Contact nickname={item.nickname} description={item.description} profilePicture={item.profilePicture} key={index}/>
        )}
        ItemSeparatorComponent={seperator}
      />
    </SafeAreaView>
  )
}

export {
  Contacts
}