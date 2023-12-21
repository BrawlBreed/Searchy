import React, { useEffect, useState } from 'react'
import { Image, Platform, TouchableOpacity, View } from 'react-native'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { EmptyButton, FlashMessage, TextDefault } from '../../../components'
import { alignment, colors, scale } from '../../../utilities'
import { SimpleLineIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Device from 'expo-device';
import {
    changeImages
} from '../../../store/reducers/Item/addItemSlice'
import { useDispatch, useSelector } from 'react-redux'
import Slider from '../../HomeStack/ProductDescription/Slider'

function UploadImages() {
    const navigation = useNavigation()
    const { images } = useSelector(state => state.addItem)
    const dispatch = useDispatch()

    useEffect(() => {
        navigation.setOptions({
            title: 'Качи снимки',
        }) 
    }, [])

    useEffect(() => {
        
    }, [images])

    async function PickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsMultipleSelection: true
            
        })
        if (!result.canceled) {
            const imagesArr = result.assets.map((item) => item.uri)
            dispatch(changeImages(imagesArr))
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
    return (
        <SafeAreaView edges={['bottom']} style={[styles.flex, styles.safeAreaview]}>
            <View style={[styles.flex, styles.mainContainer]}>
                <View style={styles.imgContainer}>
                    {images.length ? 
                    <Slider images={images} remover={true} /> : 
                    <>
                        <View style={styles.imgResponsive}>
                            <Image style={styles.img}
                                source={require('../../../assets/images/emptyView/photo-album.png')} />
                        </View>
                        <TextDefault H5 center>
                            {'Добавянето на повечето снимки подобрява шансовете за продажба'}
                        </TextDefault>
                    </>}
                    <View style={styles.buttonContainer}>
                        {/* <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn} onPress={CaptureImage}>
                            <SimpleLineIcons name='camera' size={scale(35)} color={colors.buttonText} />
                            <TextDefault textColor={colors.buttonText} bold uppercase>
                                {'Снимай сега'}
                            </TextDefault>
                        </TouchableOpacity> */}
                        <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn} onPress={PickImage}>
                            <SimpleLineIcons name='folder-alt' size={scale(35)} color={colors.buttonText} />
                            <TextDefault textColor={colors.buttonText} bold uppercase>
                                {'Избери от галерията'}
                            </TextDefault>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.buttonView]}>
                    <EmptyButton
                        disabled={!images.length}
                        title='Следваща стъпка'
                        onPress={() => {
                            images.length && navigation.navigate('LocationConfirm')
                        }} />
                </View>
            </View>
        </SafeAreaView>
    )
}
export default UploadImages