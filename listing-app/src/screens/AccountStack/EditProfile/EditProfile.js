import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Image, ScrollView, TextInput, TouchableOpacity, View, Text, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import { BackButton, DisconnectButton, EmptyButton, LeftButton, RightButton, TextDefault } from '../../../components'
import { alignment, colors, scale } from '../../../utilities'
import styles from './styles'
import { Entypo, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context'

const phone = ''
const email = ''

function EditProfile() {
    const navigation = useNavigation()
    const [adColor, setAdColor] = useState(colors.fontThirdColor)
    const [descriptionColor, setDescriptionColor] = useState(colors.fontMainColor)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [nameError, setNameError] = useState(null)
    const [margin, marginSetter] = useState(false)
    const [descriptionError, setDescriptionError] = useState(null)
    const [image, setImage] = useState(null)

    useLayoutEffect(() => {
        navigation.setOptions({
            title: null,
            headerLeft: () => <LeftButton icon='close' iconColor={colors.headerText} />,
            headerRight: () => <RightButton iconColor={colors.headerText} icon='text' title='Save' onPress={() => navigation.goBack()}
            />
        })
    }, [navigation])

    async function PickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1
        })
        if (!result.cancelled) {
            setImage(result.uri)
        }
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
        <SafeAreaView edges={['bottom']} style={[styles.flex, styles.safeAreaView]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={styles.flex}>
                <ScrollView
                    keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                    style={styles.flex}
                    alwaysBounceVertical={false}
                    contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.themeBackground, paddingBottom: Platform.OS === 'ios' ? margin ? scale(70) : 0 : 0 }}>
                    <View style={styles.flex}>
                        <View style={styles.basicInfoContainer}>
                            <TextDefault textColor={colors.fontMainColor} bold H4 style={alignment.MTlarge}>
                                {'Basic information'}
                            </TextDefault>
                            <View style={styles.upperContainer}>
                                <TouchableOpacity activeOpacity={1} style={styles.imageContainer} onPress={PickImage}>
                                    <Image
                                        style={styles.imgResponsive}
                                        source={image ? { uri: image } : require('../../../assets/images/avatar.png')}

                                        resizeMode='cover'
                                    />
                                    <View style={{ position: 'absolute', bottom: 0, backgroundColor: 'rgba(30, 59, 250, 0.6)', width: "100%", height: scale(22), justifyContent: "center", alignItems: "center" }}>
                                        <Feather name="camera" size={scale(17)} color={colors.white} />
                                    </View>
                                </TouchableOpacity>
                                <View style={[styles.subContainer, styles.flex]}>
                                    <TextDefault textColor={nameError ? colors.google : adColor} bold style={styles.width100}>
                                        {'Enter Name *'}
                                    </TextDefault>
                                    <View style={[styles.textContainer, { borderColor: adColor }]}>
                                        <TextInput
                                            style={styles.inputText}
                                            onFocus={() => {
                                                setNameError(null)
                                                setAdColor(colors.selectedText)
                                            }}
                                            onBlur={() => setAdColor(colors.fontThirdColor)}
                                            onChangeText={text => setName(text)}
                                            placeholderTextColor={colors.fontThirdColor}
                                            placeholder={'Enter your name'}
                                        />
                                    </View>
                                    {nameError &&
                                        <TextDefault textColor={colors.google} style={styles.width100}>
                                            {nameError}
                                        </TextDefault>
                                    }
                                </View>
                            </View>
                            <View style={styles.subContainer}>
                                <TextDefault textColor={descriptionError ? colors.google : descriptionColor} bold style={styles.width100}>
                                    {'Description'}
                                </TextDefault>
                                <View style={[styles.descriptionContainer, { borderColor: descriptionColor }]}>
                                    <TextInput
                                        style={styles.inputText}
                                        maxLength={140}
                                        multiline={true}
                                        onFocus={() => {
                                            setDescriptionError(null)
                                            setDescriptionColor(colors.selectedText)
                                        }}
                                        onBlur={() => setDescriptionColor(colors.fontMainColor)}
                                        onChangeText={text => setDescription(text)}
                                        placeholderTextColor={colors.fontSecondColor}
                                        placeholder={'Something about you'}
                                    />
                                </View>
                                <TextDefault light small right style={alignment.MTxSmall}>
                                    {description.length + '/ 140'}
                                </TextDefault>
                                {descriptionError &&
                                    <TextDefault textColor={colors.google} style={styles.width100}>
                                        {descriptionError}
                                    </TextDefault>
                                }
                            </View>
                        </View>

                        <View style={styles.basicInfoContainer}>
                            <TextDefault textColor={colors.fontMainColor} bold H4>
                                {'Contact information'}
                            </TextDefault>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.phoneRow}
                                onPress={() => navigation.navigate('EditPhone')}>
                                <View style={styles.countryBox}>
                                    <TextDefault textColor={colors.fontThirdColor}>
                                        {'Country'}
                                    </TextDefault>
                                    <TextDefault H5 style={[alignment.PBxSmall, alignment.PTxSmall]}>
                                        {'+92'}
                                    </TextDefault>

                                </View>
                                <View style={styles.numberBox}>
                                    <View>
                                        <TextDefault textColor={colors.fontThirdColor}>
                                            {phone.length < 1 ? '' : 'Phone Number'}
                                        </TextDefault>
                                        <TextDefault textColor={phone.length < 1 ? colors.fontThirdColor : colors.fontMainColor} H5 style={[alignment.PBxSmall, alignment.PTxSmall]}>
                                            {phone.length < 1 ? 'Phone Number' : phone}
                                        </TextDefault>
                                    </View>
                                    <Entypo name="chevron-small-right" size={scale(25)} color={colors.fontMainColor} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.emailBox}
                                activeOpacity={1}
                                onPress={() => navigation.navigate('EditEmail')}>
                                <View>
                                    <TextDefault textColor={colors.fontThirdColor}>
                                        {email.length < 1 ? '' : 'Email'}
                                    </TextDefault>
                                    <TextDefault textColor={email.length < 1 ? colors.fontThirdColor : colors.fontMainColor} H5 style={[alignment.PBxSmall, alignment.PTxSmall]}>
                                        {email.length < 1 ? 'Email' : email}
                                    </TextDefault>
                                </View>
                                <Entypo name="chevron-small-right" size={scale(25)} color={colors.fontMainColor} />
                            </TouchableOpacity>
                            <TextDefault textColor={colors.fontSecondColor} style={[alignment.MTxSmall, alignment.MBsmall]}>
                                {"This email will be useful to keep in touch. We won't share your private email with other APP users."}
                            </TextDefault>
                        </View>
                        <View style={styles.basicInfoContainer}>
                            <TextDefault textColor={colors.fontMainColor} bold H4>
                                {'Optional information'}
                            </TextDefault>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.phoneRow}>
                                <View style={styles.optionalLeft}>
                                    <TextDefault textColor={colors.fontMainColor} H5 style={alignment.MBsmall}>
                                        {'Facebook'}
                                    </TextDefault>
                                    <TextDefault textColor={colors.fontSecondColor} style={[alignment.PBxSmall, alignment.PTxSmall]}>
                                        {'Sign in with Facebook and discover your trusted connections to buyers'}
                                    </TextDefault>
                                </View>
                                <View style={styles.optionalRight}>
                                    <EmptyButton
                                        title='Connect'
                                        onPress={() => navigation.goBack()} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.phoneRow}>
                                <View style={styles.optionalLeft}>
                                    <TextDefault textColor={colors.fontMainColor} H5 style={alignment.MBsmall}>
                                        {'Google'}
                                    </TextDefault>
                                    <TextDefault textColor={colors.fontSecondColor} style={[alignment.PBxSmall, alignment.PTxSmall]}>
                                        {'Connect your APP account to your Google account for simplicity and ease.'}
                                    </TextDefault>
                                </View>
                                <View style={styles.optionalRight}>
                                    <DisconnectButton
                                        title='Disconnect'
                                        onPress={() => navigation.goBack()} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView >
        </SafeAreaView>
    )
}

export default React.memo(EditProfile)