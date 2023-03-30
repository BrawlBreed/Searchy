import { useNavigation } from '@react-navigation/native'
import React, { useLayoutEffect, useState } from 'react'
import { Image, Switch, TextInput, View, KeyboardAvoidingView, Keyboard, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { EmptyButton, ModalHeader, TextDefault } from '../../../components'
import { alignment, colors } from '../../../utilities'
import styles from './styles'

function EditPhone() {
    const navigation = useNavigation()
    const [phone, setPhone] = useState('')
    const [focus, setFocus] = useState(false)
    const [margin, marginSetter] = useState(false)
    const [isEnabled, setIsEnabled] = useState(true);
    const toggleSwitch = () => setIsEnabled(prev => !prev);
    const [adColor, setAdColor] = useState(colors.fontThirdColor)

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => null
        })
    }, [navigation])

    function validate() {
        if (phone.length > 0)
            return navigation.goBack()
    }

    return (
        <SafeAreaView style={[styles.flex, styles.safeAreaView]}>
            <KeyboardAvoidingView contentContainerStyle={alignment.PBlarge} style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <TouchableOpacity activeOpacity={1}
                    style={[styles.flex, styles.mainContainer]}
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
                            {'Verify your phone'}
                        </TextDefault>
                        <TextDefault textColor={colors.fontSecondColor} style={[alignment.MTsmall, alignment.PLsmall]}>
                            {'We will send a confirmation code to your phone'}
                        </TextDefault>
                        <View style={styles.phoneRow}>
                            <View style={styles.countryBox}>
                                <TextDefault textColor={colors.fontThirdColor}>
                                    {'Country'}
                                </TextDefault>
                                <TextDefault H5 style={[alignment.PBxSmall, alignment.PTxSmall]}>
                                    {'+92'}
                                </TextDefault>
                            </View>
                            <View style={[styles.numberBox, { borderColor: adColor }]}>
                                <TextDefault textColor={adColor}>
                                    {(focus || phone.length > 0) ? 'Phone Number' : ''}
                                </TextDefault>
                                <TextInput style={styles.flex}
                                    placeholder={focus ? '' : 'Phone Number'}
                                    placeholderTextColor={colors.fontThirdColor}
                                    value={phone}
                                    keyboardType={'phone-pad'}
                                    onFocus={() => {
                                        setFocus(true)
                                        setAdColor(colors.selectedText)
                                    }}
                                    onBlur={() => {
                                        setFocus(false)
                                        setAdColor(colors.fontThirdColor)
                                    }}
                                    onChangeText={text => setPhone(text)}
                                />
                            </View>
                        </View>
                        <View style={styles.smallContainer}>
                            <TextDefault H5 bold style={styles.flex}>
                                {'Show my phone number in ads'}
                            </TextDefault>
                            <Switch
                                trackColor={{ false: colors.headerbackground, true: colors.buttonbackground }}
                                thumbColor={colors.containerBox}
                                ios_backgroundColor={colors.headerbackground}
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                            />
                        </View>
                    </View >
                    <View style={styles.buttonView}>
                        <EmptyButton
                            disabled={phone.length < 1}
                            title='Save'
                            onPress={validate} />
                    </View>
                </TouchableOpacity >
            </KeyboardAvoidingView>
        </SafeAreaView >
    )
}

export default React.memo(EditPhone)