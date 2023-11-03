import { SimpleLineIcons } from '@expo/vector-icons'
import { StackActions, useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Image, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { EmptyButton, TextDefault } from '../../../components'
import { alignment, colors, scale } from '../../../utilities'
import styles from './styles'
import { useDispatch, useSelector } from 'react-redux'
import { changeImages, resetForm, setCreatedAt } from '../../../store/reducers/Item/addItemSlice'
import ProductDescription from '../../HomeStack/ProductDescription/ProductDescription'
import { uploadImages } from '../../../firebase'


function AdPosting() {
    const [ active , setActive ] = useState(true)
    const [error, setError] = useState('')
    const navigation = useNavigation()
    const item = useSelector(state => state.addItem)
    const dispatch = useDispatch()

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        }) 
    }, [])

    async function NavigateScreen() {
        setActive(false)
        const imageArr = await uploadImages(item.images, item.userId + '/' + item.title)
        if(imageArr){
            setError('') 
            dispatch(changeImages(imageArr))
            dispatch(setCreatedAt())
            navigation.dispatch(StackActions.popToTop())
            navigation.navigate('AdPosted')
        }else{
            setError('Нещо се обърка, моля опитайте по-късно!')
            setActive(true)
        }
    }

    return (
        <SafeAreaView style={[styles.safeAreaViewStyles, styles.flex]}>
            <View style={[styles.flex, styles.mainContainer]}>
                <View style={styles.buttonContainer}>
                    <View style={styles.imgContainer}>
                        <ProductDescription preview={item}/>
                        {error ? <TextDefault center style={{color: colors.google, fontWeight: 'bold'}}>{error}</TextDefault> : (
                            <>
                            <View style={[styles.imgResponsive, { marginTop: 10 }]}>
                                <Image style={styles.img}
                                    source={require('../../../assets/images/emptyView/price-tag.png')} />
                            </View>
                            <TextDefault bold H5>
                                {'Продай по-бързо'}
                            </TextDefault>
                            <TextDefault light style={[alignment.MTxSmall, {textAlign: 'center'}]}>
                                {'Промотирането на офертите ви помага да достигнете повече купувачи и да продавате по-бързо.'}
                            </TextDefault>
                            </>
                        )}
                    </View>
                    <EmptyButton
                        title='Публикуване'
                        onPress={() => active && NavigateScreen()}
                        disabled={!active}
                    />

                </View>
            </View>
        </SafeAreaView>
    )
}


export default AdPosting