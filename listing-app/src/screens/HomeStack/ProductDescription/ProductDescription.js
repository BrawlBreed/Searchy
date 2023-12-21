import { useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { View, TouchableOpacity, ScrollView, Image, Linking, Share } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashMessage, LeftButton, ReportModal, RightButton, TextDefault } from '../../../components'
import { alignment, colors, scale } from '../../../utilities'
import styles from './style'
import { FontAwesome, MaterialIcons, Entypo, SimpleLineIcons } from '@expo/vector-icons'
import Swiper from 'react-native-swiper'
import { BorderlessButton } from 'react-native-gesture-handler'
import * as Device from 'expo-device';
import Slider from './Slider'
import MapView, { Marker } from 'react-native-maps'
import { useDispatch, useSelector } from 'react-redux'
import { ADD_TO_FAVORITES, GET_ITEM_BY_ID, GET_ZONES_QUERY, INCREMENT_VIEWS, LIKE_ITEM_MUTATION } from '../../../apollo/server'
import { client } from '../../../apollo'
import { dateStringToDDMMYYYY } from '../../../utilities/methods'
import { appendFavorites, removeFavorite, setFavorites } from '../../../store/reducers/User/userSlice'
import { useLazyQuery } from '@apollo/client'
import { fetchChatsByUserIDs, addChat } from '../../../firebase'
import { generateRandomId } from '../../../store/reducers/Item/helpers'
import { set } from 'react-native-reanimated'
 
function ProductDescription({ route, preview }) {  
    const { refetch, title, price, id, description, location, images, user, createdAt, condition, subCategory, subCategoryId, address, views } = route ? route?.params : preview
    const [isLike, setIsLike] = useState(false);
    const navigation = useNavigation() 
    const { isLoggedIn, uid } = useSelector(state => state.user)
    const [reportModal, setReportModal] = useState(false);
    const [fetched, setFetched] = useState(false);
    const [likesList, setLikesList] = useState([]);
    const dispatch = useDispatch();
    const { favorites } = useSelector(state => state.user)

    useEffect(() => {
        client.query({
            query: GET_ZONES_QUERY,
            variables: { userId: uid }
        })
        .then(({ data }) => {
            const newFavoritesList = Array.from(new Set(data.getUserById.favorites))
            dispatch(setFavorites(newFavoritesList))
        }).then(() => setFetched(true)).then(() => refetch())

        client.query({
            query: GET_ITEM_BY_ID,
            variables: { id: id }
        }).then(({ data }) => {
            const newLikesList = Array.from(new Set(data.getItemById.likes))
            setLikesList(newLikesList)
        }).then(() => refetch())
    }, [uid]);

    useEffect(() => {
        setIsLike(favorites?.includes(id));
    }, [id, favorites]) 

    const handleLike = async () => {
        try{
            setIsLike(prev => !prev)
            const newFavorites = favorites?.includes(id) ? favorites?.filter(item => item !== id) : [...favorites, id];
            const newLikes = likesList?.includes(uid) ? likesList?.filter(item => item !== uid) : [...likesList, uid];
            client.mutate({
                mutation: ADD_TO_FAVORITES,
                variables: { uid: uid, favorites: Array.from(new Set(newFavorites)) }
            }).then(() => {
                dispatch(setFavorites(Array.from(new Set(newFavorites))))
            }).then(() => {
                client.mutate({
                    mutation: LIKE_ITEM_MUTATION,
                    variables: { likes: Array.from(new Set(newLikes)), name: id }
                }).then(() => {
                    setLikesList(Array.from(new Set(newLikes)))
                    refetch()
                })
            })
        }catch(err){
            console.log(err)
        }
    }
    
    useEffect(() => {
        if (!isLoggedIn) {
            setIsLike(false);
            navigation.navigate('Registration');
            return;
        }

    }, [isLike]);
            
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
            client.mutate({
                mutation: INCREMENT_VIEWS,
                variables: { id: id, views: views + 1 }
            }).then(refetch);
        }
    }, [uid, user?._id, id, views, client, refetch]);
    
    async function chatCheck(){
        if(user._id === uid) navigation.navigate('MainAccount')
        else if (!isLoggedIn) navigation.navigate('Registration')
        else{
            const chatObj = {
                name: user.name, image: images[0], avatar: user.avatar, uid: user?._id, adId: id
            }
            const chats = await fetchChatsByUserIDs(uid, user?._id, id);
            if(chats.length){ 
                navigation.navigate('LiveChat', { id: chats[0].id, ...chatObj } ) 
            } else{
                const chatObject = {
                    createdAt: new Date().toISOString(),
                    id: generateRandomId(28),
                    members: [
                        uid,
                        user?._id
                    ],
                    adId: id,
                    image: images[0],
                    title: title,
                };                  
                const chatId = await addChat(chatObject)
                navigation.navigate('LiveChat', { id: chatId, ...chatObj } )
            }

        }
    }

    async function share() {
        try {
            const result = await Share.share({
                title: 'App link',
                message:
                    'Изтегли приложението от тук: ',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                    FlashMessage({ message: 'The invitation has been sent', type: 'success' });
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            FlashMessage({ message: error.message, type: 'warning' });
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
            let url = `sms:${user?.phone}${Platform.OS === "ios" ? "&" : "?"}body=${"This is sample text"}`

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
                <ReportModal visible={reportModal} onModalToggle={toggleModal} />

                <View style={styles.swiperContainer}>
                    <Slider images={images} />
                </View>
                <View style={styles.priceContainer}>
                    <View style={styles.priceRow}>
                        <TextDefault H4 bold>
                            {price} лв.
                        </TextDefault>
                        { route && (
                        <TouchableOpacity activeOpacity={0} onPress={() => handleLike()}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {isLike ? 
                                <FontAwesome name="heart" size={scale(20)} color="black" /> :
                                <FontAwesome name="heart-o" size={scale(20)} color="black" />
                            }
                            {/* <TextDefault style={{ marginLeft: 5 }}>{likesList?.length ? likesList.length : '0'}</TextDefault> */}
                            </View>
                        </TouchableOpacity>
                        )}
                        
                    </View>
                    <TextDefault style={{ fontSize: 20 }}>
                        {title}
                    </TextDefault>
                    <View style={styles.locationRow}>
                        <MaterialIcons name='location-on' size={scale(15)} color={colors.headerText} />
                        <TextDefault numberOfLines={1} style={styles.locationText}>
                            {address.address}
                        </TextDefault>
                        {route && (
                            <TextDefault numberOfLines={1}>
                                от {dateStringToDDMMYYYY(createdAt)}
                            </TextDefault>
                        )}
                        
                    </View>
                    <MapView initialRegion={{
                            latitude: address.coordinates.latitude,
                            longitude: address.coordinates.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005
                        }}
                            style={{width: '100%', height: 200, flexGrow: 1}}
                        >
                            {address.coordinates.latitude && address.coordinates.longitude &&
                                <Marker
                                    coordinate={{ latitude: address.coordinates.latitude, longitude: address.coordinates.longitude }}
                                    title='Местоположение'
                                    description={location}
                                    identifier='местоположение'
                                />}
                        </MapView>

                </View>
                <View style={styles.conditionContainer}>
                    <TextDefault bold H5 style={alignment.MBsmall}>
                        {'Детайли'}
                    </TextDefault>
                    <View style={styles.row}>
                        <TextDefault uppercase light style={{ ...alignment.MBsmall, width: '35%' }}>
                            {'Състояние'}
                        </TextDefault>
                        <TextDefault bold style={alignment.MBsmall}>
                            {condition?.toLowerCase() === 'new' ? 'Ново' : 'Използвано'}
                        </TextDefault>
                    </View>
                    <View style={styles.row}>
                        <TextDefault uppercase light style={{ ...alignment.MBsmall, width: '35%' }}>
                            {'Вид'}
                        </TextDefault>
                        <TextDefault bold style={alignment.MBsmall}>
                            {route ? subCategory.title : subCategoryId}
                        </TextDefault>
                    </View>
                </View>
                <View style={styles.conditionContainer}>
                    <TextDefault bold H5 style={alignment.MBsmall}>
                        {'Описание'}
                    </TextDefault>
                    <TextDefault >
                        {description}
                    </TextDefault>
                </View>
                { route && (
                    user && (
                        <>
                            <TouchableOpacity
                                borderless={false}
                                style={styles.profileContainer}
                                onPress={() => {
                                    if(user?._id === uid){
                                        navigation.navigate('MainAccount')
                                    }else{
                                        navigation.navigate('UserProfile', { ...user })                                    
                                    }
                                }}>
                                <View style={styles.imageResponsive}>
                                    <Image
                                        style={styles.image}
                                        source={user.avatar ? {uri:user.avatar} : require('../../../assets/images/avatar.png')}/>
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
                            <View style={styles.profileContainer}>
                                <TextDefault small>
                                    {`ID на офертата:${id}`}
                                </TextDefault>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => toggleModal()}>
                                    <TextDefault textColor={colors.spinnerColor} uppercase bold>
                                        {'Докладвай обява'}
                                    </TextDefault>
                                </TouchableOpacity>
                            </View>
                        </>
                    )
                    
                )}


                {/* Header */}
                <View style={styles.headerView}>
                    <TouchableOpacity activeOpacity={0.7}>
                        {LeftButton({ iconColor: colors.white, icon: 'back' })}
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} onPress={share}>
                        {RightButton({ iconColor: colors.white, icon: 'share' })}
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {/* Footer */}
            { route && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.button}
                        onPress={chatCheck}
                    >
                        <SimpleLineIcons name='bubble' size={scale(20)} color={colors.white} />
                        <TextDefault textColor={colors.buttonText} uppercase bold style={alignment.PLsmall}>
                            {'Чат'}
                        </TextDefault>
                    </TouchableOpacity>
                    { user?.phone && (
                        <>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={styles.button}
                                onPress={Sms}
                            >
                                <SimpleLineIcons name='envelope' size={scale(20)} color={colors.white} />
                                <TextDefault textColor={colors.buttonText} uppercase bold style={alignment.PLsmall}>
                                    {'Съобщение'}
                                </TextDefault>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={styles.button}
                                onPress={dialCall}
                            >
                                <SimpleLineIcons name='phone' size={scale(20)} color={colors.white} />
                                <TextDefault textColor={colors.buttonText} uppercase bold style={alignment.PLsmall}>
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

export default ProductDescription