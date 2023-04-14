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

function UploadImages() {
    const navigation = useNavigation()
    const [image, setImage] = useState(null)
    useEffect(() => {
        navigation.setOptions({
            title: 'Upload your photos'
        })
    }, [])

    useEffect(() => {
    }, [])

    async function PickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1
        })
        if (!result.canceled) {
            setImage(result.assets)
        }
    }
    async function CaptureImage() {
        if (!Device.isDevice) {
            FlashMessage({
                message: 'Camers is not working on simulator!',
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
                alert('Sorry, we need camera roll permission to make this work!')
                return
            }
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1
        })
        if (!result.cancelled) {
            setImage(result.assets)
        }
    }
    return (
        <SafeAreaView edges={['bottom']} style={[styles.flex, styles.safeAreaview]}>
            <View style={[styles.flex, styles.mainContainer]}>
                <View style={styles.imgContainer}>
                    <View style={styles.imgResponsive}>
                        <Image style={styles.img}
                            source={require('../../../assets/images/emptyView/photo-album.png')} />
                    </View>
                    <TextDefault H5 center>
                        {'Uploading more photos increases your chance of closing a deal'}
                    </TextDefault>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn} onPress={CaptureImage}>
                            <SimpleLineIcons name='camera' size={scale(35)} color={colors.buttonText} />
                            <TextDefault textColor={colors.buttonText} bold uppercase>
                                {'Take a picture'}
                            </TextDefault>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn} onPress={PickImage}>
                            <SimpleLineIcons name='folder-alt' size={scale(35)} color={colors.buttonText} />
                            <TextDefault textColor={colors.buttonText} bold uppercase>
                                {'Folders'}
                            </TextDefault>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.buttonView}>
                    <EmptyButton
                        disabled={!image}
                        title='Next'
                        onPress={() => {
                            navigation.navigate('Price')
                        }} />
                </View>
            </View>
        </SafeAreaView>
    )
}
export default React.memo(UploadImages)