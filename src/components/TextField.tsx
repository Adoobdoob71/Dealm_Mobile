import * as React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

interface TextFieldProps {
  inputType?: "default" | "email-address" | "numeric" | "phone-pad" | "number-pad" | "decimal-pad" | "visible-password" | "ascii-capable" | "numbers-and-punctuation" | "url" | "name-phone-pad" | "twitter" | "web-search" | undefined,
  clearButton?: boolean,
  showButton?: boolean,
  secureText?: boolean,
  placeholder: string,
  value: string | number;
}

function TextField({ inputType, clearButton, showButton, secureText, placeholder } : TextFieldProps){
  const { colors } = useTheme();
  const [showButtonState, setShowButtonState] = React.useState(true);
  const styles = StyleSheet.create({
    background: {
      paddingHorizontal: 8, 
      height: 42,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary,
      flexDirection: "row",
      alignItems: "center"
    }
  });
  const togglePasswordSecurity = () => setShowButtonState(!showButtonState);
  return (
    <View style={styles.background}>
      <TextInput 
        keyboardType={inputType}
        secureTextEntry={showButton ? showButtonState : undefined} 
        placeholder={placeholder} 
        style={{ color: colors.text, flex: 1, fontSize: 14 }}
        placeholderTextColor={colors.placeholder} 
      />
      <IconButton 
        icon={showButtonState ? "eye-off-outline" : "eye-outline"} 
        onPress={togglePasswordSecurity} 
        size={16} color={colors.placeholder} 
        style={{ display: showButton ? "flex" : "none", marginStart: 6 }} 
        animated
      />
    </View>
  )
}

export {
  TextField,
  TextFieldProps
}