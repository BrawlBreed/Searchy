import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StyleSheet, TextInput, Button, Keyboard } from 'react-native'
import { FlashMessage, LeftButton, ModalHeader, TextDefault } from '../../../components'
import { useDispatch } from 'react-redux'
import { changeEmail } from '../../../store/reducers/User/userSlice'
import { colors } from '../../../utilities'
import styles from '../Registration/styles'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { sendForgotPasswordEmail } from '../../../firebase'
import { validateEmailForm } from './validate'
import { KeyboardAvoidingView } from 'react-native'

const icon = require('../../../../assets/icon.png')

const ForgotPassword = () => {
  const [emailError, setEmailError] = useState('')
  const [ email, setEmail ] = useState('')
  const inset = useSafeAreaInsets()
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const handleSubmit = async () => {
    const emailError = validateEmailForm({ email: email }, { email: emailError })
    if (emailError.email) {
      setEmailError(emailError.email)
      return
    }
    const res = await sendForgotPasswordEmail(email)
    if (res) {
      FlashMessage({ message: 'Успешно изпратихме имейла за смяна на парола!', type: 'info', duration: 50000 })
    }
    else{
      FlashMessage({ message: 'Грешка при изпращането на имейла за смяна на паролата.', type: 'danger' })
    }
    navigation.goBack()
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // Keyboard is open
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // Keyboard is closed
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <>
     <View style={[
        styles.safeAreaview,
        styles.flex,
        { paddingTop: inset.top, paddingBottom: inset.bottom }]}>
        <ModalHeader type='back' title="Забравена парола" closeModal={() => navigation.goBack()} />
        <View style={styles.logoContainer}>
          <View style={styles.image}>
            { !isKeyboardVisible && (
                <Image
                source={icon}
                style={styles.imgResponsive}
                resizeMode='contain' />
            )}
            
          </View>
        </View>
      </View>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : false}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >

        <View style={formStyles.container}>
          <TextDefault textColor={emailError ? colors.google : colors.fontMainColor} H5 bold style={styles.width100}>
            {'Вашият E-mail адрес'}
          </TextDefault>
          <TextInput
            style={formStyles.input}
            placeholder='Имейл'
            autoCapitalize="none"
            placeholderTextColor='#42A5F5'
            value={email}
            onChangeText={text => setEmail(text)}
          />
          {emailError &&
            <TextDefault textColor={colors.google} style={styles.width100}>
              {emailError}
            </TextDefault>
          }
          <Text style={{color: 'gray'}}></Text> 
          <Button
            title='Изпрати'
            onPress={() => handleSubmit()}
          />
          <Text style={{color: 'gray'}}></Text> 
        </View>
      </KeyboardAvoidingView>
    </>
    

  )
}

export default ForgotPassword

const formStyles = StyleSheet.create({
  input: {
    width: '85%',
    height: 55,
    backgroundColor: 'transparent',
    margin: 10,
    padding: 8,
    color: '#42A5F5',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: `#42A5F5`,
    fontSize: 18,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.themeBackground,
  },
  button: {
    backgroundColor: '#42A5F5',
    color: 'white',
    paddingVertical: 8,
    paddingHorizontal: 20,
    paddingHorizontal: 20,
    borderRadius: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  }

})
