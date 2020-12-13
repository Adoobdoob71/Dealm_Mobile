import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { List, useTheme  } from 'react-native-paper';

function Settings(){
  const { colors } = useTheme();
  const navigation = useNavigation();
  const styles = StyleSheet.create({

  })
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <List.Item title="Account Details" description="Change account details" onPress={() => {}} left={() => <List.Icon icon="account" />}/>
      </List.Section>
      <List.Section>
        <List.Subheader>Appearance</List.Subheader>
        <List.Item title="Secondary Color" description="Change the secondary color of the app" onPress={() => {}} left={() => <List.Icon icon="palette" />}/>
      </List.Section>
    </SafeAreaView>
  )
}

export {
  Settings
}