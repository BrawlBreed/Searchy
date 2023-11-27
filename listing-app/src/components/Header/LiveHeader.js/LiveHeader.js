import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as Device from 'expo-device'
import React, { useEffect, useState } from 'react'
import { Alert, Dimensions, FlatList, Image, Linking, Modal, Platform, TouchableOpacity, View } from 'react-native'
import { BorderlessButton } from 'react-native-gesture-handler'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { alignment, colors, scale } from '../../../utilities'
import { FlashMessage } from '../../FlashMessage/FlashMessage'
import { TextDefault } from '../../Text'
import { LeftButton } from '../HeaderIcons/HeaderIcons'
import styles from './styles'
import { useSelector } from 'react-redux'
import { useLazyQuery } from '@apollo/client'
import { GET_NUMBER } from '../../../apollo/server'
import { deleteChat } from '../../../firebase'

const { width, height } = Dimensions.get('window')

function ModalHeader() {
    const [open, setOpen] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState('')
    const inset = useSafeAreaInsets()
    const route = useRoute();
    const { id, name, image, avatar, uid } = route.params || {};
    const [getNumberById, { loading, data, error } ] = useLazyQuery(GET_NUMBER, {
        variables: { userId: uid },
    })
    const navigation = useNavigation()

    useEffect(() => {
        if(data?.getUserById?.phone) setPhoneNumber(data?.getUserById?.phone)
    }, [data])

    useEffect(() => {
        getNumberById()
    }, [route])

    function dialCall() {
        if (!Device.isDevice)
            FlashMessage({ message: 'This function is not working on Simulator/Emulator', type: 'warning' })
        else {
            let phoneNumber = '';
            if (Platform.OS === 'android') {
                phoneNumber = `tel:${phoneNumber}`;
            }
            else {
                phoneNumber = `telprompt:${phoneNumber}`;
            }

            Linking.openURL(phoneNumber);
        }
    };

    function Sms() {
        let url = `sms:${phoneNumber}${Platform.OS === "ios" ? "&" : "?"}body=${"This is sample text"}`

        Linking.openURL(url);
    };

    function customMessage() {
        FlashMessage({ message: 'Pending Features' })
        setOpen(false)
        // navigation.goBack()
    }

    function onDeleteChat() {
        Alert.alert(
            'Изтриване на чат', // Title
            'Сигурни ли сте, че искате да изтриете този чат?', // Message
            [
                {
                    text: 'Отказ', 
                    style: 'cancel',
                },
                { 
                    text: 'Изтрий', 
                    onPress: () => {
                        deleteChat(id)
                        navigation.goBack()
                    }
                },
            ]
        );

    }

    return (
        <SafeAreaView edges={['top']} style={styles.safeAreaContainer}>
            <View style={styles.headerContainer}>
                <View style={styles.headerContents}>
                    <LeftButton icon='back' iconColor={colors.headerText} />
                    <View style={[styles.flex, styles.titleContainer]}>
                        <View style={styles.imageResponsive}>
                            <Image
                                style={[styles.flex, styles.img]}
                                source={typeof image === 'string' && { uri: image }} />
                            <Image
                                style={styles.profileImg}
                                source={typeof avatar === 'string' && avatar === 'false' || !avatar ? require('../../../assets/images/avatar.png') : { uri: avatar }}
                            />
                        </View>
                        <View style={styles.infoContainer}>
                            <TextDefault bold H5>
                                {name} 
                            </TextDefault>
                        </View>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity
                                style={alignment.PxSmall}
                                borderless={false}
                                onPress={dialCall}>
                                <View accessible>
                                    <Feather name="phone" size={scale(20)} color={colors.headerText} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={alignment.PxSmall}
                                borderless={false}
                                onPress={Sms}>
                                <MaterialCommunityIcons name="message-text-outline" size={scale(20)} color={colors.headerText} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setOpen(true)}
                                style={alignment.PxSmall}
                                borderless={false}>
                                <MaterialCommunityIcons name="dots-vertical" size={scale(20)} color={colors.headerText} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {open &&
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={open}
                            onRequestClose={() => setOpen(false)}
                        >
                            <TouchableOpacity activeOpacity={1} style={styles.flex} onPress={() => setOpen(false)}>
                                <View style={{ width: width * 0.5, backgroundColor: colors.containerBox, position: 'absolute', top: inset.top, right: scale(5) }}>
                                    <TouchableOpacity
                                        onPress={onDeleteChat}
                                        borderless={false}
                                        style={{ ...alignment.Pmedium }}>
                                        <TextDefault bold H5>
                                            Изтрий Чат
                                        </TextDefault>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={customMessage}
                                        borderless={false}
                                        style={{ ...alignment.Pmedium }}>
                                        <TextDefault bold H5>
                                            Докладвай
                                        </TextDefault>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </Modal>
                    }
                </View>
            </View>
        </SafeAreaView >
    )

}
export default React.memo(ModalHeader)