import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StyleSheet, TextInput, Button, Keyboard } from 'react-native'
import styles from '../Registration/styles'
import { ModalHeader, TextDefault } from '../../../components'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image } from 'react-native'
import { changeEmail, changePassword, changePhone, changePhoneCode, checkUserAuth, initialState, setRegister } from '../../../store/reducers/User/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import RNPhoneCodeSelect from "react-native-phone-code-select";
import { TouchableOpacity } from 'react-native-gesture-handler'
import { validateEmailForm, validatePhoneForm } from './validate'
import { colors } from '../../../utilities'
import { createOrSignInWithEmail, createOrSignUpWithPhone } from '../../../firebase'
import { gql, useMutation } from '@apollo/client'

const icon = require('../../../../assets/icon.png')

const Entry = ({ route }) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    phone: ''
  })
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation()
  const inset = useSafeAreaInsets()
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const { name, phoneCode, description, phone, email, password, avatar, createdAt, active, followers, following, notifications, userId, favorites } = useSelector(state => state.user)
  const [mutateFunction, { data, loading, error }] = useMutation(gql`
  mutation MyMutation(
      $name: String!,
      $phoneCode: String!,
      $description: String!,
      $phone: String!,
      $email: String!,
      $avatar: String!,
      $createdAt: String!,
      $active: Boolean!,
      $followers: [String]!,
      $following: [String]!,
      $favorites: [String]!,
      $notifications: NotificationsInput!,
      $userId: String!,
  ) {
      register(
        name: $name
        callingCode: $phoneCode
        description: $description
        phone: $phone
        email: $email
        avatar: $avatar
        createdAt: $createdAt
        active: $active
        followers: $followers
        following: $following
        favorites: $favorites
        notifications: $notifications
        _id: $userId
      )
  }
`, {
  variables: {
      name,
      phoneCode,
      description,
      phone,
      email,
      avatar,
      createdAt,
      active,
      followers,
      following,
      favorites,
      notifications,
      userId
  }})

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

  const handleSubmit = async () => {
    let valid = true
    const error = route.params.email 
    ? validateEmailForm({ email, password }, errors) 
    : validatePhoneForm({ phone, password }, errors)

    setErrors(error)
    for (const key in errors) {
        if(errors[key]) valid = false
    }
    if(valid) {
      const response = route.params.email ? await createOrSignInWithEmail(email, password, dispatch, user
      ) : await createOrSignUpWithPhone(phoneCode + phone, dispatch, mutateFunction)
      
      if(response === 'auth/invalid-login-credentials') {
        setErrors({ ...errors, password: 'Грешна парола!' })
      }else if(response === 'auth/user-not-found') {
        setErrors({ ...errors, email: 'Няма намерен потребител!' })
      }
      else if(response === 'auth/invalid-phone-number') {
        setErrors({ ...errors, phone: 'Невалиден телефонен номер!' })
      }
      else if(response === 'auth/invalid-verification-code') {
        setErrors({ ...errors, phone: 'Невалиден код!' })
      }
      else if(response === 'auth/too-many-requests') {
        setErrors({ ...errors, phone: 'Твърде много опити за вход, опитайте по-късно!' })
      }
      else{
        if(response.user){
          dispatch(checkUserAuth())
          navigation.navigate('Home')
        }
      }

    }
  }

  return (
    <>
      <View style={[
        styles.safeAreaViewStyles,
        styles.flex,
        { paddingTop: inset.top, paddingBottom: inset.bottom }]}>
            <ModalHeader title="Вход" closeModal={() => navigation.goBack()} />
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
      <View style={formStyles.container}>
        {route.params.email ? (
          <>
            <TextDefault textColor={errors.email ? colors.google : colors.fontMainColor} H5 bold style={styles.width100}>
              {'E-mail адрес *'}
            </TextDefault>
            <TextInput
              style={formStyles.input}
              placeholder='Имейл'
              autoCapitalize="none"
              placeholderTextColor='#42A5F5'
              onChangeText={text => dispatch(changeEmail(text))}
            />
            {errors.email &&
              <TextDefault textColor={colors.google} style={styles.width100}>
                {errors.email}
              </TextDefault>
            }
          </>
        ) : (
          <>
            <RNPhoneCodeSelect
              visible={visible}
              onDismiss={() => setVisible(false)}
              onCountryPress={(country) => dispatch(changePhoneCode(country.dial_code))}
              primaryColor="#42A5F5"
              secondaryColor="#42A5F5"
              buttonText="Готово"
            />
            <TextDefault textColor={errors.phone ? colors.google : colors.fontMainColor} H5 bold style={styles.width100}>
              {'Телефонен номер *'}
            </TextDefault>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => setVisible(true)}>
                <Text
                  style={[formStyles.input, {width: 80, textAlign: 'center', paddingTop: 15, marginRight: 0, color: '#42A5F5' }]}
                  autoCapitalize="none"
                  onPress={() => setVisible(true)}
                >{phoneCode}</Text>
              </TouchableOpacity>            
              <TextInput
                style={[formStyles.input, {width: 250}]}
                placeholder='Телефон'
                autoCapitalize="none"
                placeholderTextColor='#42A5F5'
                keyboardType='numeric'
                maxLength={9}
                value={phone}
                onChangeText={text => dispatch(changePhone(text))}
              />
            </View>
            {errors.phone &&
              <TextDefault textColor={colors.google} style={styles.width100}>
                {errors.phone}
              </TextDefault>
            }
          </>
        )}
        <TextDefault textColor={errors.password ? colors.google : colors.fontMainColor} H5 bold 
        // style={[styles.width100, { marginTop: 15}]} 
        >
          {'Парола *'}
        </TextDefault>    
        <TextInput
          style={formStyles.input}
          placeholder='Парола'
          secureTextEntry={true}
          autoCapitalize="none"
          placeholderTextColor='#42A5F5'
          onChangeText={text => dispatch(changePassword(text))}
        />
        {errors.password &&
          <TextDefault textColor={colors.google} style={[styles.width100, { marginBottom: 10 }]}>
            {errors.password}
          </TextDefault>
        }
        <TouchableOpacity
          style={formStyles.button}
          onPress={() => handleSubmit()}
        >
          <Text style={formStyles.buttonText}>Влез</Text>
        </TouchableOpacity>
        <Text style={{color: 'gray'}}></Text> 
        <View style={{ marginBottom: 30}}>
        <Text 
          style={{     
            borderBottomRadius: 3,
            borderBottomWidth: 2,
            borderBottomColor: `#42A5F5`,
            paddingBottom: 3.5
          }}>Забравена парола?</Text>
        </View>
        
      </View>
    </>
  )
} 

export default Entry

const formStyles = StyleSheet.create({
  input: {
    width: 350,
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