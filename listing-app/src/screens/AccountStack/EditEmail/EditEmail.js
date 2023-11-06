import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Image, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View, Keyboard } from 'react-native'
import { EmptyButton, LeftButton, ModalHeader, TextDefault } from '../../../components'
import { alignment, colors, scale } from '../../../utilities'
import styles from './styles'
import { Entypo } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { changeEmail } from '../../../store/reducers/User/userSlice'
import { gql, useMutation } from '@apollo/client'
import { sendVerificationEmail, updateEmail } from '../../../firebase'

function EditEmail() {
    const navigation = useNavigation()
    const [Email, setEmail] = useState('') 
    const [focus, setFocus] = useState(false)
    const [margin, marginSetter] = useState(false)
    const [authError, setAuthError] = useState('')
    const [adColor, setAdColor] = useState(colors.fontThirdColor)
    const dispatch = useDispatch()
    const { uid, avatar, email } = useSelector(state => state.user)

    const [mutateFunction, { data, loading, error }] = useMutation(gql`
    mutation MyMutation(
        $uid: String!,
        $email: String!,
    ) {
        changeEmail( uid: $uid, email: $email )
    }
    `, {
        variables: {
        uid: uid,
        email: Email
        },
    })

    useEffect(() => {
        if (data?.changeEmail) {
            dispatch(changeEmail(data.changeEmail.email))
            navigation.goBack()
        }
    }, [data])


    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => null
        })
    }, [navigation])

    const validate = async () => {
        if (Email.length > 0 && Email.includes('@')){
            const res = await sendVerificationEmail(Email)
            console.log(res)
            // const res = await updateEmail(Email);
            // if (res.code === 'auth/invalid-email'){
            //     setAuthError('Невалиден имейл')
      
            //     return data
            // }
            // else if(res.code === 'auth/email-already-in-use'){
            //     setAuthError('Имейлът е зает')
            //     return data
            // }
            // else {

            // }
          
        }
    };
    
    

    return (
        <SafeAreaView style={[styles.flex, styles.safeAreaView]}>
            <KeyboardAvoidingView contentContainerStyle={alignment.PBlarge} style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <TouchableOpacity activeOpacity={1}
                    style={[styles.flex, styles.mainContainer, { paddingBottom: margin ? scale(70) : scale(0) }]}
                    onPress={() => Keyboard.dismiss()}>
                    <ModalHeader closeModal={() => navigation.goBack()} />
                    <View style={[styles.flex, styles.basicInfoContainer]}>
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.imgResponsive}
                                source={avatar ? {uri: avatar} : require('../../../assets/images/avatar.png')}
                                resizeMode='cover'
                            />
                        </View>
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
                            {authError.length > 0 && <TextDefault textColor={colors.google} style={[alignment.MBxSmall]}>
                                {authError}
                            </TextDefault>}
                        </View>
                    </View >
                    <View style={[styles.buttonView]}>
                        <EmptyButton
                            disabled={Email.length < 1 || !Email.includes('@')}
                            title='Запази'
                            onPress={() => validate()} />
                    </View>
                </TouchableOpacity>
            </KeyboardAvoidingView >
        </SafeAreaView >
    )
}

export default React.memo(EditEmail)