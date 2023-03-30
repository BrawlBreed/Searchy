import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Image, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View, Keyboard } from 'react-native'
import { EmptyButton, LeftButton, ModalHeader, TextDefault } from '../../../components'
import { alignment, colors, scale } from '../../../utilities'
import styles from './styles'
import { Entypo } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

function EditEmail() {
    const navigation = useNavigation()
    const [Email, setEmail] = useState('')
    const [focus, setFocus] = useState(false)
    const [margin, marginSetter] = useState(false)
    const [adColor, setAdColor] = useState(colors.fontThirdColor)


    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => null
        })
    }, [navigation])

    function validate() {
        if (Email.length > 0)
            return navigation.goBack()
    }

    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

        // cleanup function
        return () => {
            Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
            Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
    }, []);
    function _keyboardDidShow() {
        marginSetter(true)
    }
    function _keyboardDidHide() {
        marginSetter(false)
    }

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
                                source={require('../../../assets/images/avatar.png')}
                                resizeMode='cover'
                            />
                        </View>
                        <TextDefault textColor={colors.fontMainColor} bold H4 style={[alignment.MTlarge, alignment.PLsmall]}>
                            {'Enter your Email'}
                        </TextDefault>
                        <View style={[styles.numberBox, { borderColor: adColor }]}>
                            <TextDefault textColor={adColor} style={alignment.MBxSmall}>
                                {(focus || Email.length > 0) ? 'Email' : ''}
                            </TextDefault>
                            <TextInput
                                style={alignment.PBxSmall}
                                placeholder={focus ? '' : 'Email'}
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
                    </View >
                    <View style={styles.buttonView}>
                        <EmptyButton
                            disabled={Email.length < 1}
                            title='Next'
                            onPress={validate} />
                    </View>
                </TouchableOpacity>
            </KeyboardAvoidingView >
        </SafeAreaView >
    )
}

export default React.memo(EditEmail)