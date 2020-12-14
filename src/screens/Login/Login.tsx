import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button as PaperButton, IconButton, useTheme } from 'react-native-paper';
import { PreferencesContext } from '../../../Theming';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { loginWithEmailAndPassword } from './LoginFunctions';
import { Header } from '../../components/Header';

function Login(){

  const { colors } = useTheme();
  const navigation = useNavigation();

  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);

  const styles = StyleSheet.create({
    window: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 12,
    },
    title: {
      fontSize: 42,
      color: colors.text,
      fontWeight: "bold",
      marginVertical: 16
    },
    textFieldsView: {
      marginVertical: 48
    }
  });

  const closeWindow = () => navigation.goBack();
  
  return (
    <SafeAreaView style={styles.window}>
      <Header left={<IconButton icon="close" color={colors.text} size={24} onPress={closeWindow} />} />
      <Text style={styles.title}>Login to your account.</Text>
      <View style={styles.textFieldsView}>
        <TextField inputType="email-address" placeholder="Email" value={email} />
        <View style={{ height: 21 }}></View>
        <TextField secureText={true} placeholder="Password" value={password} showButton/>
      </View>
      <Button mode="full" onPress={() => {}} text="Login" icon="chevron-right" style={{ alignSelf: "flex-end"}}/>
    </SafeAreaView>
  )
}

export {
  Login
}