import { useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { View, TouchableOpacity, ScrollView, Image, Linking, Share, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashMessage, LeftButton, ReportModal, RightButton, TextDefault } from '../../../components'
import { alignment, colors, scale } from '../../../utilities'
import styles from './style'
import { FontAwesome, MaterialIcons, Entypo, SimpleLineIcons } from '@expo/vector-icons'
import * as Device from 'expo-device';
import Slider from './Slider'
import { useDispatch, useSelector } from 'react-redux'
import { dateStringToDDMMYYYY, formatDateFromFirestore, isDeviceTablet } from '../../../utilities/methods'
import { fetchChatsByUserIDs, addChat } from '../../../firebase'
import { generateRandomId } from '../../../store/reducers/Item/helpers'

function SearchyDescription({ route, preview }) {
    const { refetch, title, inquiry, id, description, image, user, createdAt, views } = route ? route?.params : preview
    const navigation = useNavigation()
    const { isLoggedIn, uid } = useSelector(state => state.user)
    const [reportModal, setReportModal] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => null
        })
    }, [navigation])

    function toggleModal() {
        setReportModal(prev => !prev)
    }

    useEffect(() => {
        if (uid !== user?._id) {
            // To increment views query
        }
    }, [uid, user?._id, id, views, refetch]);

    async function chatCheck() {
        if (user?._id === uid) navigation.navigate('Account')
        else if (!isLoggedIn) navigation.navigate('Registration')
        else {
            const chatObj = {
                name: user.name, image: image, avatar: user.avatar, uid: user?._id, adId: id
            }
            const chats = await fetchChatsByUserIDs(uid, user?._id, id);
            if (chats.length) {
                navigation.navigate('LiveChat', { id: chats[0].id, ...chatObj })
            } else {
                const chatObject = {
                    createdAt: new Date().toISOString(),
                    id: generateRandomId(28),
                    members: [
                        uid,
                        user?._id
                    ],
                    adId: id,
                    image: image,
                    title: title,
                };
                const chatId = await addChat(chatObject)
                navigation.navigate('LiveChat', { id: chatId, ...chatObj })
            }

        }
    }

    function dialCall() {
        if (!isLoggedIn)
            navigation.navigate('Registration')
        else if (!Device.isDevice)
            FlashMessage({ message: 'This function is not working on Simulator/Emulator', type: 'warning' })
        else {
            let phoneNumber = user?.phone;
            if (Platform.OS === 'android') {
                phoneNumber = `tel:${user?.phone}`;
            }
            else {
                phoneNumber = `telprompt:${user?.phone}`;
            }

            Linking.openURL(phoneNumber);
        }
    };

    function Sms() {
        if (!isLoggedIn)
            navigation.navigate('Registration')
        else {
            let url = `sms:${user?.phone}${Platform.OS === "ios" ? "&" : "?"}body=${"Имам интерес от обявата ви за"}`

            Linking.openURL(url);
        }
    };

    return (
        <SafeAreaView style={[styles.flex, styles.safeAreaview]}>
            <ScrollView style={[styles.flex, styles.mainContainer]}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Modal */}
                {route && (
                    <ReportModal adId={id} uid={user?._id} visible={reportModal} onModalToggle={toggleModal} />
                )}
                <View style={styles.swiperContainer}>
                    <Slider images={[image]} />
                </View>
                <View style={styles.priceContainer}>
                    <View style={styles.priceRow}>
                        <TextDefault H4>
                            Търся си <TextDefault H4 bold>{title}</TextDefault>
                        </TextDefault>
                    </View>
                    <TextDefault style={{ fontSize: 20 }}>
                        В замяна: {inquiry}
                    </TextDefault>
                    <View style={styles.locationRow}>
                        {route && (
                            <TextDefault numberOfLines={1}>
                                публикувано на {formatDateFromFirestore(createdAt)}
                            </TextDefault>
                        )}

                    </View>

                </View>
                <View style={styles.conditionContainer}>
                    <TextDefault bold H5 style={alignment.MBsmall}>
                        {'Доълнително пояснение'}
                    </TextDefault>
                    <TextDefault >
                        {description}
                    </TextDefault>
                </View>
                {route && (
                    user && (
                        <>
                            <TouchableOpacity
                                borderless={false}
                                style={styles.profileContainer}
                                onPress={() => {
                                    if (user?._id === uid) {
                                        navigation.navigate('Account')
                                    } else {
                                        navigation.navigate('UserProfile', { ...user })
                                    }
                                }}>
                                <View style={styles.imageResponsive}>
                                    <Image
                                        style={styles.image}
                                        source={user.avatar ? { uri: user.avatar } : require('../../../assets/images/avatar.png')} />
                                </View>
                                <View style={styles.profileInfo}>
                                    <TextDefault bold>
                                        {user.name}
                                    </TextDefault>
                                    <TextDefault light small>
                                        {`Член от ${dateStringToDDMMYYYY(user?.createdAt)}`}
                                    </TextDefault>
                                    <TextDefault textColor={colors.spinnerColor} bold style={alignment.MTxSmall}>
                                        {'Виж профил'}
                                    </TextDefault>
                                </View>
                                <Entypo name='chevron-small-right' size={scale(20)} color={colors.buttonbackground} />
                            </TouchableOpacity>
                        </>
                    )

                )}


                {/* Header */}
                <View style={styles.headerView}>
                    <TouchableOpacity activeOpacity={0.7}>
                        {LeftButton({ iconColor: colors.white, icon: 'back' })}
                    </TouchableOpacity>
                    { route && <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} activeOpacity={0.7} onPress={() => toggleModal()}>
                        <TextDefault textColor={colors.white} uppercase bold>
                            {'Докладвай обява'}
                        </TextDefault>
                        <MaterialIcons style={{ paddingLeft: 5 }} name="flag" size={24} color="white" />
                    </TouchableOpacity>}                    
                </View>
            </ScrollView>
            {/* Footer */}
            {route && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.button}
                        onPress={chatCheck}
                    >
                        <SimpleLineIcons name='bubble' size={scale(isDeviceTablet() ? 15 : 20)} color={colors.white} />
                        <TextDefault textColor={colors.buttonText} uppercase bold style={[alignment.PLsmall, { fontSize: scale(isDeviceTablet() ? 8 : 11) }]}>
                            {'Чат'}
                        </TextDefault>
                    </TouchableOpacity>
                    {user?.phone && (
                        <>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={styles.button}
                                onPress={Sms}
                            >
                                <SimpleLineIcons name='envelope' size={scale(isDeviceTablet() ? 15 : 20)} color={colors.white} />
                                <TextDefault textColor={colors.buttonText} uppercase bold style={[alignment.PLsmall, { fontSize: scale(isDeviceTablet() ? 8 : 11) }]}>
                                    {'Съобщение'}
                                </TextDefault>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={styles.button}
                                onPress={dialCall}
                            >
                                <SimpleLineIcons name='phone' size={scale(isDeviceTablet() ? 15 : 20)} color={colors.white} />
                                <TextDefault textColor={colors.buttonText} uppercase bold style={[alignment.PLsmall, { fontSize: scale(isDeviceTablet() ? 8 : 11) }]}>
                                    {'Обади се'}
                                </TextDefault>
                            </TouchableOpacity>
                        </>
                    )}

                </View>
            )}
        </SafeAreaView >
    )
}

export default SearchyDescription