import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Image, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View, Keyboard } from 'react-native'
import { EmptyButton, LeftButton, ModalHeader, TextDefault } from '../../../components'
import { alignment, colors, scale } from '../../../utilities'
import styles from './styles'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { changeEmail, checkUserAuth, setAwaitingEmailVerification, setEmailChanged } from '../../../store/reducers/User/userSlice'
import { gql, useMutation } from '@apollo/client'
import { updateEmail, updateAndVerifyEmail, auth } from '../../../firebase'
import { set } from 'firebase/database'
import { useChangeEmailMutation } from '../../../hooks/changeEmail'
import { onIdTokenChanged } from 'firebase/auth'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
function EditEmail() {
    const navigation = useNavigation()
    const [Email, setEmail] = useState('') 
    const [Password, setPassword] = useState('') 
    const [focus, setFocus] = useState(false)
    const [margin, marginSetter] = useState(false)
    const [authError, setAuthError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [adColor, setAdColor] = useState(colors.fontThirdColor)
    const [step, setStep] = useState(false)
    const dispatch = useDispatch()
    const { uid, avatar, email, awaitingEmailVerification, emailChanged } = useSelector(state => state.user)
    const { emailMutation, data, loading, error } = useChangeEmailMutation()

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => null
        }) 
    }, [navigation])

    const validate = async () => {
        if (Email.length > 0 && Email.includes('@')){            
            const res = await updateEmail(Email);
            if (res.code === 'auth/invalid-email'){
                setAuthError('Невалиден имейл')

            }
            else if(res.code === 'auth/email-already-in-use'){
                setAuthError('Имейлът е зает')
            }
            else if (res.code === 'auth/operation-not-allowed'){
                setStep(true)
            }
            else{
                emailMutation(uid, email)
                navigation.goBack()
            }
          
        }
    };

    const handleSuccess = () => {
        dispatch(changeEmail(Email))
        dispatch(setAwaitingEmailVerification(false))
        dispatch(setEmailChanged(false))
        setStep(false)
    }

    useEffect(() => {
        if(awaitingEmailVerification){
            console.log('Awaiting email verification')
            // Define a function that reloads the user's auth state and checks for email verification
            const checkEmailVerification = async () => {
                const user = auth.currentUser;
                user.reload()
                if (user && awaitingEmailVerification) {
                    await user.getIdToken(true);
                    await user.reload(); // This will trigger onIdTokenChanged if the email has been verified
                }
            };
            // Set up an interval to check for email verification
            const intervalId = setInterval(checkEmailVerification, 5000);

            // Clean up the interval when the component unmounts
            return () => clearInterval(intervalId);
        }
        
        // Clean up the interval when the component unmounts
      }, [dispatch, emailMutation, navigation]); // Dependencies are functions and objects used in the effect
                            

    const getResponse = async () => {
        if(passwordRegex.test(Password.trim())){
            const res = await updateAndVerifyEmail(Email, Password)
            if (res?.code === 'auth/invalid-email'){
                setAuthError('Невалиден имейл')
            }    
            else if(res?.code === 'auth/invalid-login-credentials'){
                setPasswordError('Грешна парола')
            }
            else if(res?.code === 'auth/email-already-in-use'){
                setAuthError('Имейлът е зает')
            }
            else if (res?.code === 'auth/operation-not-allowed'){
                setAuthError('Операцията не е разрешена')
            }
            else if (res?.code === 'auth/too-many-requests'){
                setAuthError('Твърде много опити за вход, опитайте по-късно!')
                navigation.goBack()
            }
            else if(res === 'Sent'){
                dispatch(setAwaitingEmailVerification(true))
            }
        }
    }



    return (
        !awaitingEmailVerification ? (
            <SafeAreaView style={[styles.flex, styles.safeAreaView]}>
                <KeyboardAvoidingView contentContainerStyle={alignment.PBlarge} style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <TouchableOpacity activeOpacity={1}
                        style={[styles.flex, styles.mainContainer, { paddingBottom: margin ? scale(70) : scale(0) }]}
                        onPress={() => Keyboard.dismiss()}>
                        <ModalHeader closeModal={() => {
                            navigation.goBack()
                            dispatch(setAwaitingEmailVerification(false))
                        }} />
                        <View style={[styles.flex, styles.basicInfoContainer, {alignItems: 'center'}]}>
                            <View style={styles.imageContainer}>
                                <Image
                                    style={styles.imgResponsive}
                                    source={avatar ? {uri: avatar} : require('../../../assets/images/avatar.png')}
                                    resizeMode='cover'
                                />
                            </View>
                            {!step ? (
                                <>
                                    <TextDefault textColor={colors.fontMainColor} bold H4 style={[alignment.MTlarge, alignment.PLsmall]}>
                                        {'Въведи нов имейл'}
                                    </TextDefault>
                                    <View style={[styles.numberBox, { borderColor: adColor }]}>
                                        <TextDefault textColor={error || authError ? colors.google : adColor} style={[alignment.MBxSmall]}>
                                            {(focus || Email.length > 0) ? 'Email' : ''}
                                        </TextDefault>
                                        <TextInput
                                            style={alignment.PBxSmall}
                                            placeholder={focus ? '' : 'Имейл'}
                                            placeholderTextColor={colors.fontThirdColor}
                                            value={Email}
                                            keyboardType={'email-address'}
                                            onFocus={() => {
                                                setFocus(true)
                                                setAdColor(colors.selectedText)
                                            }}
                                            onBlur={() => {
                                                setFocus(false)
                                                setAdColor(colors.fontThirdColor)
                                            }}
                                            onChangeText={text => setEmail(text)}
                                        />
                                    </View>
                                    {authError.length > 0 && <TextDefault textColor={colors.google} style={[alignment.MBxSmall]}>
                                            {authError}
                                        </TextDefault>}
                                </>
                            ) : (
                                <>
                                    <TextDefault textColor={colors.fontMainColor} bold H4 style={[alignment.MTlarge, alignment.PLsmall]}>
                                        {'Въведи парола'}
                                    </TextDefault>
                                    <View style={[styles.numberBox, { borderColor: adColor }]}>
                                        <TextDefault textColor={error || passwordError ? colors.google : adColor} style={[alignment.MBxSmall]}>
                                            {(focus || Email.length > 0) ? 'Парола' : ''}
                                        </TextDefault>
                                        <TextInput
                                            style={alignment.PBxSmall}
                                            placeholder={focus ? '' : 'Паролата на вашия акаунт'}
                                            placeholderTextColor={colors.fontThirdColor}
                                            value={Password}
                                            secureTextEntry={true} // This makes the text input show dots instead of the actual characters
                                            onFocus={() => {
                                                setFocus(true)
                                                setAdColor(colors.selectedText)
                                            }}
                                            onBlur={() => {
                                                setFocus(false)
                                                setAdColor(colors.fontThirdColor)
                                            }}
                                            onChangeText={text => setPassword(text)}
                                        />
                                    </View>
                                    {passwordError.length > 0 && <TextDefault textColor={colors.google} style={[alignment.MBxSmall]}>
                                            {passwordError}
                                        </TextDefault>}
                                </>
                            )}
                        </View >
                        <View style={[styles.buttonView]}>
                            {!step ? <EmptyButton
                                disabled={Email.length < 1 || !Email.includes('@')}
                                title={'Напред'}
                                onPress={() => validate()} />
                            :    <EmptyButton
                                disabled={!passwordRegex.test(Password.trim())}
                                title={'Изпрати'}
                                onPress={() => getResponse()} /> 
                            }
                            
                            
                        </View>
                    </TouchableOpacity>
                </KeyboardAvoidingView >
            </SafeAreaView >
        ) : (
            <SafeAreaView style={[styles.flex, styles.safeAreaView]}>
                <KeyboardAvoidingView contentContainerStyle={alignment.PBlarge} style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <TouchableOpacity 
                        activeOpacity={1}
                        style={[styles.flex, styles.mainContainer, { paddingBottom: margin ? scale(70) : scale(0) }]}
                        onPress={() => Keyboard.dismiss()}>
                        <ModalHeader closeModal={() => navigation.goBack()} />
                        <View style={{alignItems: 'center'}}>
                            <View style={[styles.imageContainer]}>
                                <Image
                                    style={styles.imgResponsive}
                                    source={avatar ? {uri: avatar} : require('../../../assets/images/avatar.png')}
                                    resizeMode='cover'
                                />
                            </View>
                        </View>
                        { emailChanged ? (
                            <View style={[styles.flex, styles.basicInfoContainer, { alignItems: 'center', paddingBottom: 20}]}>
                                <TextDefault textColor={colors.black} bold H4 style={[alignment.MTlarge, alignment.PLsmall]}>
                                    {'Успешно променихте имейла си!'}
                                </TextDefault>
                                <View style={[styles.imgResponsive, { marginTop: 10 }]}>
                                    <Ionicons name="checkmark-circle" size={50} color={colors.spinnerColor}/>
                                </View>
                                <EmptyButton
                                    title={'Готово'}
                                    onPress={() => {
                                        handleSuccess()
                                        navigation.goBack()
                                    }} 
                                />
                            </View>
                        ) : (
                            <View style={[styles.flex, styles.basicInfoContainer, { alignItems: 'center'}]}>
                                <TextDefault textColor={colors.black} bold H4 style={[alignment.MTlarge, alignment.PLsmall]}>
                                    {'Провери имейла си'}
                                </TextDefault>
                                <TextDefault textColor={colors.black} style={[alignment.MTsmall, alignment.PLsmall, { textAlign: 'center'}]}>
                                    {'Провери имейла си за потвърждаване на новият имейл!'}
                                </TextDefault>
                                <EmptyButton
                                    title={'Изпрати отново'}
                                    onPress={() => {
                                        dispatch(setAwaitingEmailVerification(false))
                                        setStep(false)
                                    }} 
                                />
                            </View>
                        )}
                    </TouchableOpacity>
                </KeyboardAvoidingView >
            </SafeAreaView >
        )
    )
    
}

export default React.memo(EditEmail)