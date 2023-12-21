import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Image, Switch, TextInput, View, KeyboardAvoidingView, Keyboard, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { EmptyButton, ModalHeader, TextDefault } from '../../../components'
import { alignment, colors } from '../../../utilities'
import styles from './styles'
import { changePhone, changePhoneCode } from '../../../store/reducers/User/userSlice'
import RNPhoneCodeSelect from "react-native-phone-code-select";
import { useDispatch, useSelector } from 'react-redux'
import { gql, useMutation } from '@apollo/client'

function EditPhone() {
    const navigation = useNavigation()
    const [focus, setFocus] = useState(false)
    const [visible, setVisible] = useState(false);
    const [margin, marginSetter] = useState(false)
    const [isEnabled, setIsEnabled] = useState(true);
    const toggleSwitch = () => setIsEnabled(prev => !prev);
    const [adColor, setAdColor] = useState(colors.fontThirdColor)
    const { uid, phoneCode, phone, avatar } = useSelector(state => state.user) || {}
    const dispatch = useDispatch()

    const [mutateFunction, { data, loading, error }] = useMutation(gql`
    mutation MyMutation(
        $uid: String!,
        $phone: String!,
        $phoneCode: String!
    ) {
        changePhone( uid: $uid, phone: $phone, phoneCode: $phoneCode )
    }
    `, {
        variables: {
        uid: uid,
        phone: phone,
        phoneCode: phoneCode
        },
    })

    useEffect(() => {
        if (data?.changePhone) {
            dispatch(changePhone(data.changePhone.phone))
            navigation.goBack()
        }
    }, [data])


    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => null
        })
    }, [navigation])

    return (
        <SafeAreaView style={[styles.flex, styles.safeAreaView]}>
            <KeyboardAvoidingView contentContainerStyle={alignment.PBlarge} style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <TouchableOpacity activeOpacity={1}
                    style={[styles.flex, styles.mainContainer]}
                    onPress={() => Keyboard.dismiss()}>
                    <ModalHeader type='back' title={'Промени Телефон'} closeModal={() => navigation.goBack()} />
                    <View style={[styles.flex, styles.basicInfoContainer]}>
                        <View style={{ alignItems: 'center'}}>
                            <View style={styles.imageContainer}>
                                <Image
                                    style={styles.imgResponsive}
                                    source={avatar ? {uri: avatar } : require('../../../assets/images/avatar.png')}
                                    resizeMode='cover'
                                />
                            </View>
                            <TextDefault textColor={colors.fontMainColor} bold H4 style={[alignment.MTlarge, alignment.PLsmall]}>
                                {'Промени телефона си'}
                            </TextDefault>
                            <TextDefault textColor={colors.fontSecondColor} style={[alignment.MTsmall, alignment.PLsmall, { textAlign: 'center'}]}>
                                {'Добавяйки телефон, ще можеш да се свържеш с други потребители'}
                            </TextDefault>
                        </View>
                        <View style={styles.phoneRow}>
                            <View style={styles.countryBox}>
                                <RNPhoneCodeSelect
                                    visible={visible}
                                    onDismiss={() => setVisible(false)}
                                    onCountryPress={(country) => dispatch(changePhoneCode(country.dial_code))}
                                    primaryColor="#42A5F5"
                                    secondaryColor="#42A5F5"
                                    buttonText="Готово"
                                />
                                <TextDefault textColor={colors.fontThirdColor}>
                                    {'Код'}
                                </TextDefault>
                                <TextDefault H5 style={[alignment.PBxSmall, alignment.PTxSmall]}
                                    onPress={() => setVisible(true)}
                                >{phoneCode}</TextDefault>
                            </View>
                            <View style={[styles.numberBox, { borderColor: adColor }]}>
                                <TextDefault textColor={adColor}>
                                    {(focus || phone.length > 0) ? 'Телефон' : ''}
                                </TextDefault>
                                <TextInput style={styles.flex}
                                    placeholder={focus ? '' : 'Phone Number'}
                                    placeholderTextColor={error ? colors.google : colors.fontThirdColor}
                                    value={phone}
                                    maxLength={9}
                                    keyboardType={'phone-pad'}
                                    onFocus={() => {
                                        setFocus(true)
                                        setAdColor(colors.selectedText)
                                    }}
                                    onBlur={() => {
                                        setFocus(false)
                                        setAdColor(colors.fontThirdColor)
                                    }}
                                    onChangeText={text => dispatch(changePhone(text))}
                                />
                                { error && <TextDefault textColor={colors.google} style={alignment.PTxSmall}>Грешка, опитай по-късно!</TextDefault>}
                            </View>
                        </View>
                    </View >
                    <View style={styles.buttonView}>
                        <EmptyButton
                            disabled={phone.length < 9}
                            title='Save'
                            onPress={mutateFunction} />
                    </View>
                </TouchableOpacity >
            </KeyboardAvoidingView>
        </SafeAreaView >
    )
}

export default React.memo(EditPhone)