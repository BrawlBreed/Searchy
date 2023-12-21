import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Image, ScrollView, TextInput, TouchableOpacity, View, Text, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import { BackButton, DisconnectButton, EmptyButton, FlashMessage, LeftButton, RightButton, TextDefault } from '../../../components'
import { alignment, colors, scale } from '../../../utilities'
import styles from './styles'
import { Entypo, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context'
import { changeDescription, changeName, setAvatar, setCurrentUser } from '../../../store/reducers/User/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { uploadImage } from '../../../firebase'
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { GET_ZONES_QUERY } from '../../../apollo/server'

function EditProfile() {
    const navigation = useNavigation()
    const [adColor, setAdColor] = useState(colors.fontThirdColor)
    const [descriptionColor, setDescriptionColor] = useState(colors.fontMainColor)
    const [nameError, setNameError] = useState(null)
    const [margin, marginSetter] = useState(false)
    const [descriptionError, setDescriptionError] = useState(null)
    const [image, setImage] = useState(null)
    const dispatch = useDispatch()
    const  user = useSelector(state => state.user)
    const { userId, uid, name, email, description, phone, phoneCode, avatar } = useSelector(state => state.user)
    const [getUser, { loading, data, error }] = useLazyQuery(GET_ZONES_QUERY);
  
    useEffect(() => {
        getUser({ variables: { userId: userId } });
        if (data?.getUserById){
            dispatch(setCurrentUser(data?.getUserById));
        }
    }, [mutateFunction])

    useEffect(() => {
        if(changeResponse?.data){
            navigation.goBack()
        }
    }, [changeResponse?.data])
  
    const [mutateFunction, changeResponse] = useMutation(gql`
    mutation MyMutation(
        $uid: String!,
        $name: String!,
        $description: String!,
        $avatar: String!,
    ) {
        changeEssentials( uid: $uid, name: $name, description: $description, avatar: $avatar )
    }
    `, {
        variables: {
        uid: uid,
        name: name,
        description: description,
        avatar: avatar
        },
    })

    useEffect(() => {
        if(changeResponse?.data){
            navigation.goBack()
            FlashMessage({ message: 'Успешно променихте профила си', type: 'success' })
        }
    }, [changeResponse?.data])

    useEffect(() => {
        async function updateAvatar() {
            const avatar = await uploadImage(image, `${userId}/avatar`);
            dispatch(setAvatar(avatar));
        }
          if (image) {
            updateAvatar();
          }
    }, [image]);
     
    useLayoutEffect(() => {
        navigation.setOptions({
            title: null,
            headerLeft: () => <LeftButton icon='close' iconColor={colors.headerText} />,
            headerRight: () => <RightButton iconColor={colors.headerText} icon='text' title='Запази' onPress={() => mutateFunction()}
            />
        })
    }, [navigation])

    async function PickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1
        })
        if (result.assets.length > 0) {
            setImage(result.assets[0].uri)
        }
    }
    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

        // cleanup function
        return () => {
            Keyboard.removeAllListeners("keyboardDidShow", _keyboardDidShow);
            Keyboard.removeAllListeners("keyboardDidHide", _keyboardDidHide);
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
                                {'Основна информация'}
                            </TextDefault>
                            <View style={styles.upperContainer}>
                                <TouchableOpacity activeOpacity={1} style={styles.imageContainer} onPress={PickImage}>
                                    <Image
                                        style={styles.imgResponsive}
                                        source={avatar ? { uri: avatar } : require('../../../assets/images/avatar.png')}

                                        resizeMode='cover'
                                    />
                                    <View style={{ position: 'absolute', bottom: 0, backgroundColor: 'rgba(30, 59, 250, 0.6)', width: "100%", height: scale(22), justifyContent: "center", alignItems: "center" }}>
                                        <Feather name="camera" size={scale(17)} color={colors.white} />
                                    </View>
                                </TouchableOpacity>
                                <View style={[styles.subContainer, styles.flex]}>
                                    <TextDefault textColor={nameError ? colors.google : adColor} bold style={styles.width100}>
                                        {'Редактирай име *'}
                                    </TextDefault>
                                    <View style={[styles.textContainer, { borderColor: adColor }]}>
                                        <TextInput
                                            style={styles.inputText}
                                            onFocus={() => {
                                                setNameError(null)
                                                setAdColor(colors.selectedText)
                                            }}
                                            onBlur={() => setAdColor(colors.fontThirdColor)}
                                            onChangeText={text => dispatch(changeName(text))}
                                            value={name}
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
                                    {'Описание'}
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
                                        onChangeText={text => dispatch(changeDescription(text))}
                                        value={description}
                                        placeholderTextColor={colors.fontSecondColor}
                                        placeholder={description ? description : 'Напишете нещо за себе си'}
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
                                {'Контакти'}
                            </TextDefault>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.phoneRow}
                                onPress={() => navigation.navigate('EditPhone')}>
                                <View style={styles.countryBox}>
                                    <TextDefault textColor={colors.fontThirdColor}>
                                        {'Код'}
                                    </TextDefault>
                                    <TextDefault H5 style={[alignment.PBxSmall, alignment.PTxSmall]}>
                                        {phoneCode ? phoneCode : '+359'}
                                    </TextDefault>

                                </View>
                                <View style={styles.numberBox}>
                                    <View>
                                        <TextDefault textColor={colors.fontThirdColor}>
                                            {phone?.length < 1 ? '' : 'Телефонен номер'}
                                        </TextDefault>
                                        <TextDefault textColor={phone?.length < 1 ? colors.fontThirdColor : colors.fontMainColor} H5 style={[alignment.PBxSmall, alignment.PTxSmall]}>
                                            {phone?.length < 1 ? 'Телефонен номер' : phone}
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
                                        {email?.length < 1 ? '' : 'Имейл'}
                                    </TextDefault>
                                    <TextDefault textColor={email?.length < 1 ? colors.fontThirdColor : colors.fontMainColor} H5 style={[alignment.PBxSmall, alignment.PTxSmall]}>
                                        {email?.length < 1 ? 'Email' : email}
                                    </TextDefault>
                                </View>
                                <Entypo name="chevron-small-right" size={scale(25)} color={colors.fontMainColor} />
                            </TouchableOpacity>
                            <TextDefault textColor={colors.fontSecondColor} style={[alignment.MTxSmall, alignment.MBsmall]}>
                                {"Този имейл е свързан със съществуващия Ви акаунт и можем да се свържем с Вас по него."}
                            </TextDefault>
                        </View>
                        {/* <View style={styles.basicInfoContainer}>
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
                        </View> */}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView >
        </SafeAreaView>
    )
}

export default React.memo(EditProfile)