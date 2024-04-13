import React, { useEffect, useState } from 'react'
import { Image, Platform, ScrollView, TouchableOpacity, View } from 'react-native'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { EmptyButton, FlashMessage, LeftButton, TextDefault } from '../../../components'
import { SimpleLineIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux'
import { resetForm, setActiveTab, setImage, toggleTab } from '../../../store/reducers/Searchy/searchySlice'
import Slider from '../Slider'
import { colors, scale } from '../../../utilities'
import { uploadSearchy } from '../../../firebase'

function UploadImage() {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const { image, activeTab, ...searchy } = useSelector(state => state.searchy)
    const { uid } = useSelector(state => state.user)
    const dispatch = useDispatch()

    useEffect(() => {
        navigation.setOptions({
            title: 'Качи снимки',
        }) 
    }, [])

    async function handleSubmit(){
        try{
            if(image){
                setLoading(true)
                const res = await uploadSearchy({...searchy, image: image, userId: uid})
                if(res){
                    FlashMessage({ message: 'Успешно публикувахте търсенето си!', type: 'success' })
                    navigation.goBack()
                    dispatch(setActiveTab())
                    dispatch(resetForm())
                }
            }

        }catch(err){
            FlashMessage({ message: 'Появи се грешка при публикуването!', type: 'success' })
        }finally{
            setLoading(false)
        }
    } 

    useEffect(() => {
        dispatch(toggleTab(true))

        return () => {
            dispatch(toggleTab(false))
        }
    }, [])

    async function PickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,            
        })
        if (!result.canceled) {
            dispatch(setImage(result.assets[0].uri))
        }
    }

    return (
        <SafeAreaView edges={['bottom']} style={[styles.flex, styles.safeAreaview]}>
            <View style={[styles.flex, styles.mainContainer]}>
            <View style={[styles.headerView, { top: '3%', zIndex: 9999 } ]}>
                    <TouchableOpacity activeOpacity={0.7}>
                        {LeftButton({ iconColor: colors.white, icon: 'back' })}
                    </TouchableOpacity>
                    
                    {/* <TouchableOpacity activeOpacity={0.7} onPress={share}>
                        {RightButton({ iconColor: colors.white, icon: 'share' })}
                    </TouchableOpacity> */}
                </View>

                <View style={styles.imgContainer}>
                <TextDefault textColor={colors.fontMainColor} center H5 bold style={[styles.width100, { marginBottom: 10}]}>
                                    Снимка за ориентиация на потребителите
                                </TextDefault>

                    {image ? 
                    <Slider images={[image]} remover={true} /> 
                    : 
                    <>
                        <View style={styles.imgResponsive}>
                            <Image style={styles.img}
                                source={require('../../../assets/images/emptyView/photo-album.png')} />
                        </View>
                        <TextDefault H5 center>
                            {'Добавянето на повечето снимки подобрява шансовете за продажба'}
                        </TextDefault>
                    </>}
                    <View style={[styles.buttonContainer, {bottom: '5%'}]}>
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
                        disabled={!image || loading}
                        title='Публикувай Търсене'
                        onPress={handleSubmit} />
                </View>
            </View>
        </SafeAreaView>
    )
}
export default UploadImage