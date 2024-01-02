import { View, Text, TouchableOpacity, Share, Button, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useReducer, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { EmptyButton, FlashMessage, LeftButton, ReportModal, RightButton, TextDefault } from '../../../../components'
import { FontAwesome, MaterialIcons, Entypo, SimpleLineIcons } from '@expo/vector-icons'
import Slider from '../../../HomeStack/ProductDescription/Slider'
import styles from '../../../HomeStack/ProductDescription/style'
import s from '../../../SellStack/SellingForm/styles'
import s1 from '../../../SellStack/UploadImages/styles'
import { alignment, colors, scale } from '../../../../utilities'
import MapView, { Marker } from 'react-native-maps'
import * as Device from 'expo-device';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native'
import { client } from '../../../../apollo'
import { EDIT_ITEM } from '../../../../apollo/server'
import { useSelector, useDispatch } from 'react-redux'
import { changeOwnedItems } from '../../../../store/reducers/User/userSlice'
import { validateSellingForm } from '../../../SellStack/SellingForm/validate'
  
function reducer(state, action) {
    switch (action.type) {
      case 'SET_PROPERTY':
        return { ...state, [action.payload.property]: action.payload.value };
        break
      case 'SET_AD':
        return action.payload;
        break
      default:
        throw new Error();
    }
}

const initalState = {
    title: '',
    description: '',
    price: '',
    condition: ''
}

const CONDITIONS = [
    {
        value: 0,
        title: 'Ново'
    },
    {
        value: 1,
        title: 'Използвано'
    },
]
const EditAd = ({route}) => {
    const { refetch, title, price, likes, _id, description, zone, location, images, user, createdAt, condition, subCategory, subCategoryId, address } = route.params
    const [reportModal, setReportModal] = useState(false);
    const [active, setActive] = useState(false)
    const [errors, setErrors] = useState(initalState)
    const [state, dispatch] = useReducer(reducer, { ...initialState, ...route.params });
    const navigation = useNavigation()

    const initialState = {
        title: title,
        price: price,
        likes: likes,
        id: _id,
        condition: condition,
        description: description,
        zone: zone,
        location: location,
        images: images,
        user: user,
        createdAt: createdAt,
        condition: condition,
        subCategory: subCategory,
        subCategoryId: subCategoryId,
        address: {
            address: address.address,
            coordinates: {
                latitude: address.coordinates.latitude,
                longitude: address.coordinates.longitude
            }
        }
    };
    
    function checkChanged () {
        if (state.title !== title || state.price !== price || state.condition !== condition || state.description !== description || state.address.address !== address.address) {
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        setActive(checkChanged())
    }, [state])

    useEffect(() => {
        fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${Number(state.address.coordinates.latitude)}&lon=${Number(state.address.coordinates.longitude)}&apiKey=91d42f0a0fef4305bdc90e6da2b237c9`)
        .then(response => response.json())
        .then(result => {
            if (result.features.length) {
                updateProperty('address', { ...state.address, address: result.features[0].properties.formatted });
            } else {
                console.log("No address found");
            }
        });
    }, [state.address.coordinates]) 

    const updateProperty = (property, value) => {
        dispatch({ type: 'SET_PROPERTY', payload: { property, value } });
      };
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

    async function PickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsMultipleSelection: true
            
        })
        if (!result.canceled) {
            const imagesArr = result.assets.map((item) => item.uri)
            updateProperty('images', imagesArr)
        }
    }
    async function CaptureImage() {
        if (!Device.isDevice) {
            FlashMessage({
                message: 'Камерата не работи на симулатора',
                type: 'warning'
            })
            return
        }

        const { status: checkStatus } = await ImagePicker.getCameraPermissionsAsync()
        if (checkStatus !== 'granted') {
            const { status: CameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
            if (CameraStatus !== 'granted') {
                alert('Sorry, we need camera permission to make this work!')
                return
            }
        }
        const { status: checkStatusRoll } = await ImagePicker.getCameraRollPermissionsAsync()
        if (checkStatusRoll !== 'granted') {
            const { status: CameraRollStatus } = await ImagePicker.requestCameraRollPermissionsAsync()
            if (CameraRollStatus !== 'granted') {
                alert('За съжаление имаме нужда от разрешение за камерата!')
                return
            }
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1
        })
        if (result.assets) {
            setImage(result.assets)
        }
    }

    async function handleEditAd() {
        let valid = true
        setErrors(validateSellingForm(state, errors))
        for (const key in errors) {
            if(errors[key]) valid = false
        }
        if(valid) {
            const res = await client.mutate({
                mutation: EDIT_ITEM,
                variables: {
                    id: state?._id,
                    title: state.title,
                    price: Number(state.price),
                    condition: state.condition,
                    description: state.description,
                    address: {
                        address: state.address.address,
                        coordinates: {
                            latitude: state.address.coordinates.latitude,
                            longitude: state.address.coordinates.longitude
                        }
                    },
                    images: state.images
                }
            })
            .then(() => refetch())
            .then(() => {
                FlashMessage({ message: 'Успешно редактирахте обявата си!', type: 'success' })
                navigation.goBack()
            })
        } 
    }

    return (
        <SafeAreaView style={[styles.flex, styles.safeAreaview]}>
            <KeyboardAvoidingView 
                style={{ flex: 1, backgroundColor: 'white' }}
                behavior={Platform.OS === "ios" ? "padding" : false}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >

                <ScrollView style={[styles.flex, styles.mainContainer]}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Modal */}
                    {/* <ReportModal visible={reportModal} onModalToggle={toggleModal} /> */}

                    <View style={styles.swiperContainer}>
                        {images.length ? 
                            <Slider images={state.images} /> :
                            <>
                                <View style={s1.imgResponsive}>
                                    <Image style={styles.img}
                                        source={require('../../../../assets/images/emptyView/photo-album.png')} />
                                </View>
                                <TextDefault H5 center>
                                    {'Добавянето на повечето снимки подобрява шансовете за продажба'}
                                </TextDefault>
                            </>
                        }
                        <View style={[styles.buttonContainer, { borderWidth: 1, borderColor: colors.fontPlaceholder,backgroundColor: colors.buttonbackground, borderLeftWidth: 0, borderRightWidth: 0, zIndex: 1000}]}>
                            {/* <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn} onPress={CaptureImage}>
                                <SimpleLineIcons name='camera' size={scale(25)} color={colors.containerTheme} />
                                <TextDefault textColor={colors.fontPlaceholder} bold uppercase>
                                    {'Снимай сега'}
                                </TextDefault>
                            </TouchableOpacity> */}
                            <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn} onPress={PickImage}>
                                <SimpleLineIcons name='folder-alt' size={scale(25)} color={colors.containerTheme} />
                                <TextDefault textColor={colors.fontPlaceholder} bold uppercase>
                                    {'Избери от галерията'}
                                </TextDefault>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.priceContainer, { marginTop: '12%' }]}>
                        <TextDefault textColor={errors.price ? colors.google : colors.black} bold H5 style={[alignment.MBsmall]}>
                            {'Цена'}
                        </TextDefault>
                        {errors.price &&
                            <TextDefault textColor={colors.google} style={styles.width100}>
                                {errors.price}
                            </TextDefault>
                        }
                        <View style={[styles.buttonContainer, { width: '40%'}]}>
                            <TextInput keyboardType='numeric' H4 bold style={{ fontSize: 20 }} value={String(state.price)} onChangeText={(newPrice) => updateProperty('price', newPrice)}/> 
                            <TextDefault bold H5 style={[alignment.MBsmall]}>лв.</TextDefault>
                        </View>
                        <TextDefault bold H5 textColor={errors.title ? colors.google : colors.black} style={[alignment.MBsmall]}>
                            {'Заглавие'}
                        </TextDefault>
                        <TextInput style={{ fontSize: 20 }} value={state.title} onChangeText={(newTitle) => updateProperty('title', newTitle)}/>
                        {errors.title &&
                            <TextDefault textColor={colors.google} style={styles.width100}>
                                {errors.title}
                            </TextDefault>
                        }
                        <View style={styles.locationRow}>
                            <MaterialIcons name='location-on' size={scale(15)} color={colors.headerText} />
                            <TextInput numberOfLines={1} style={styles.locationText}>
                                {state.address.address}
                            </TextInput>
                        </View>
                        <MapView
                            onDoublePress={(e) => {
                                updateProperty('address', {
                                    coordinates:{
                                        latitude: e.nativeEvent.coordinate.latitude,
                                        longitude: e.nativeEvent.coordinate.longitude 
                                    }
                                })
                            }}
                            initialRegion={{
                                latitude: state.address.coordinates.latitude,
                                longitude: state.address.coordinates.longitude,
                                latitudeDelta: 0.005,
                                longitudeDelta: 0.005
                            }}
                                style={{width: '100%', height: 200, flexGrow: 1}}
                            >
                                {state.address.coordinates.latitude && state.address.coordinates.longitude &&
                                    <Marker
                                        coordinate={{ latitude: state.address.coordinates.latitude, longitude: state.address.coordinates.longitude }}
                                        title='Местоположение'
                                        description={state.address.address}
                                        identifier='местоположение'
                                    />}
                        </MapView>
                    </View>
                    <View style={styles.conditionContainer}>
                        <TextDefault textColor={errors.condition ? colors.google : colors.black} bold H5 style={alignment.MBsmall}>
                            {'Състояние'}
                        </TextDefault>
                        <View style={styles.row}>
                            <View style={s.subContainerRow}>
                                {CONDITIONS.map((item, index) => (
                                    <TouchableOpacity key={item.value}
                                        style={[s.conditionBox, s.boxContainer, item.title === state.condition ? s.selected : s.notSelected]}
                                        onPress={() => updateProperty('condition', item.title)} 
                                        >
                                        <TextDefault style={item.value === state.condition ? s.selectedText : s.unSelectedText}>
                                            {item.title}
                                        </TextDefault>
                                    </TouchableOpacity>
                                ))
                                }
                            </View>
                            {errors.condition &&
                                <TextDefault textColor={colors.google} style={styles.width100}>
                                    {errors.condition}
                                </TextDefault>
                            }
                        </View>
                    </View>
                    <View style={styles.conditionContainer}>
                        <TextDefault textColor={errors.description ? colors.google : colors.black} bold H5 style={alignment.MBsmall}>
                            {'Описание'}
                        </TextDefault>
                        <TextInput value={state.description} onChangeText={newDescription => updateProperty('description', newDescription)}/>
                        {errors.description &&
                            <TextDefault textColor={colors.google} style={styles.width100}>
                                {errors.description}
                            </TextDefault>
                        }
                    </View>
                    {/* Header */}
                    <View style={styles.headerView}>
                        <TouchableOpacity activeOpacity={0.7}>
                            {LeftButton({ iconColor: colors.white, icon: 'back' })}
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} onPress={share}>
                            {RightButton({ iconColor: colors.white, icon: 'share' })}
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.buttonView, { marginVertical: 10 }]}>
                        <Button
                            style={{backgroundColor: colors.buttonbackground }}
                            disabled={!images.length && active}
                            color={images.length && active ? colors.buttonbackground : colors.fontThirdColor}
                            title='Запази промените'
                            onPress={() => {
                                
                                images.length && active && handleEditAd()
                            }} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView> 
        </SafeAreaView >
        // <></>
    )
}

export default React.memo(EditAd)