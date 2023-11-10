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
import { ADD_TO_FAVORITES, DELETE_ITEM, GET_ZONES_QUERY, LIKE_ITEM_MUTATION } from '../../../apollo/server'
import { client } from '../../../apollo'
import { dateStringToDDMMYYYY } from '../../../utilities/methods'
import { appendFavorites, removeFavorite, setFavorites } from '../../../store/reducers/User/userSlice'
import { useLazyQuery } from '@apollo/client'

function ProductDescription({ route, preview }) { 
    const { title, price, likesCount, id, description, location, images, user, createdAt, condition, subCategory, subCategoryId, address } = route ? route.params : preview
    const [isLike, isLikeSetter] = useState(isLike)
    const navigation = useNavigation()
    const { isLoggedIn, uid, favorites } = useSelector(state => state.user)
    const [reportModal, setReportModal] = useState(false);
    const [fetched, setFetched] = useState(false)
    const [getUser] = useLazyQuery(GET_ZONES_QUERY);
    const dispatch = useDispatch()

    useEffect(() => {
        isLikeSetter(favorites.some(favorite => favorite === id));
    }, [favorites, id])

    const likeItem = async () => {
        try {    
            // Perform the mutation
            const response = await client.mutate({
                mutation: LIKE_ITEM_MUTATION,
                variables: {
                    name: id,
                    likesCount: likesCount
                },
            });
    
            return response.data.likeItem;
        } catch (error) {
            console.error('Error liking the item:', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await getUser({ variables: { userId: uid } });
            if (response.data?.getUserById) {
              return response.data.getUserById;
            }
          } catch (error) {
            console.error('Error fetching user:', error);
          }
        };
      
        fetchUser().then(user => {
          if (user?.favorites) {
            dispatch(setFavorites(user.favorites));
            setFetched(true)
          }
        });
    }, [dispatch, getUser, uid]);
              
    const addToFavourites = async () => {
        try{
            console.log('Favorites: ', favorites)
            const response = await client.mutate({
                mutation: ADD_TO_FAVORITES,
                variables: { uid: uid , favorites: favorites },
            });
        }catch (error) {
            console.error('Error adding item to favourites:', error);
            // Handle the error response here
        }
    }
 
    const deleteItem = async () => {
        try {
          const response = await client.mutate({
            mutation: DELETE_ITEM,
            variables: { id: id },
          });
          console.log('Item deleted:', response.data.deleteItem);
          // Handle the success response here
        } catch (error) {
          console.error('Error deleting the item:', error);
          // Handle the error response here
        }
    };
    
    useEffect(() => {
        if(!user && route){
            deleteItem()
        }
    }, [route])

    useEffect(() => {
        if(fetched){
            addToFavourites() 
        }
    }, [likeItem])

    useEffect(() => {
        console.log(user)
        if(isLike === true && isLoggedIn) {
            likeItem()
            dispatch(appendFavorites(id))
        }else if(isLike === false && isLoggedIn) {
            likeItem() 
            dispatch(removeFavorite(id))
        }else if(isLike === true && !isLoggedIn) {
            isLikeSetter(false)
            navigation.navigate('Registration')
        }
        else if(isLike === false && !isLoggedIn) {
            isLikeSetter(false)
            navigation.navigate('Registration')
        }
    }, [isLike])
    
    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => null
        })
    }, [navigation])

    function toggleModal() {
        setReportModal(prev => !prev)
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
                            <TouchableOpacity activeOpacity={0} onPress={() => {
                                isLikeSetter(prev => !prev)}
                            }>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {isLike ? 
                                <FontAwesome name="heart" size={scale(20)} color="black" /> :
                                <FontAwesome name="heart-o" size={scale(20)} color="black" />
                            }
                            <TextDefault style={{ marginLeft: 5 }}>{isLike ? likesCount + 1 : likesCount}</TextDefault>
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
                            {route ? location : address.address}
                        </TextDefault>
                        <TextDefault numberOfLines={1}>
                            от {dateStringToDDMMYYYY(createdAt)}
                        </TextDefault>
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
                            {condition.toLowerCase() === 'new' ? 'Ново' : 'Използвано'}
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
                                onPress={() => navigation.navigate('UserProfile', { ...user })}>
                                <View style={styles.imageResponsive}>
                                    <Image
                                        style={styles.image}
                                        source={user.avatar}/>
                                </View>
                                <View style={styles.profileInfo}>
                                    <TextDefault bold>
                                        {user.name}
                                    </TextDefault>
                                    <TextDefault light small>
                                        {`Член от ${dateStringToDDMMYYYY(user.createdAt)}`}
                                    </TextDefault>
                                    <TextDefault textColor={colors.spinnerColor} bold style={alignment.MTxSmall}>
                                        {'Виж профил'}
                                    </TextDefault>
                                </View>
                                <Entypo name='chevron-small-right' size={scale(20)} color={colors.buttonbackground} />
                            </TouchableOpacity>
                            <View style={styles.profileContainer}>
                                <TextDefault >
                                    {`ID на офертата:${id}`}
                                </TextDefault>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => toggleModal()}>
                                    <TextDefault textColor={colors.spinnerColor} uppercase bold>
                                        {'Report This AD'}
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
                        onPress={() => navigation.navigate('Chat', { screen: 'LiveChat', initial: false })}
                    >
                        <SimpleLineIcons name='bubble' size={scale(20)} color={colors.white} />
                        <TextDefault textColor={colors.buttonText} uppercase bold style={alignment.PLsmall}>
                            {'Чат'}
                        </TextDefault>
                    </TouchableOpacity>

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
                </View>
            )}
        </SafeAreaView >
    )
}

export default ProductDescription