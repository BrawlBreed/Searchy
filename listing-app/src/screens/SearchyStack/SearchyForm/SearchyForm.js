import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, ScrollView, TextInput, Image, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { EmptyButton, TextDefault } from '../../../components'
import { alignment, colors, scale } from '../../../utilities'
import styles from './styles.js'
import { useDispatch, useSelector } from 'react-redux'
import {   
    changeTitle,
    changeDescription,
    changeInquiry,
    toggleTab
   } from '../../../store/reducers/Searchy/searchySlice'
import { validateSearchyForm } from './validate'

const initalState = {
    title: '',
    description: '',
    inquiry: '',
    condition: ''
}
function SearchyForm() {
    const navigation = useNavigation()
    const [margin, marginSetter] = useState(false)
    const [adColor, setAdColor] = useState(colors.fontMainColor)
    const [descriptionColor, setDescriptionColor] = useState(colors.fontMainColor)
    const [errors, setErrors] = useState(initalState)
    const searchyState = useSelector(state => state.searchy)
    const { title, description, inquiry, hiddenTab } = searchyState
    const dispatch = useDispatch(); 

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
                        
    function handleSubmit () {
        let valid = true
        const newErrors = validateSearchyForm(searchyState, {})
        setErrors(newErrors)
        for (const key in newErrors) {
            if(newErrors[key]) valid = false
        }
        if(valid) {
            navigation.navigate('UploadImageInquiry')
        }
    }

    return (
                <ScrollView
                    keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.scrollviewContent, { marginBottom: 0, top: '5%', overflow: 'hidden'}]}
                    style={[styles.flex, styles.mainContainer]}>
                    <View style={[styles.flex, { justifyContent: "space-between" }]}>
                        <View>
                            <TextDefault center style={{ paddingBottom: 10}} H2 bold>Търся Си...</TextDefault>
                            <View style={styles.line} />
                            <View style={styles.line} />
                            <View style={styles.subContainer}>
                                <TextDefault textColor={errors.title ? colors.google : adColor} H5 bold style={styles.width100}>
                                    {'Какво търсите ?'}
                                </TextDefault>
                                <View style={[styles.textContainer, { borderColor: adColor }]}>
                                    <TextInput
                                        style={styles.inputText}
                                        maxLength={70}
                                        onFocus={() => {
                                            setAdColor(colors.selectedText)
                                        }}
                                        onBlur={() => setAdColor(colors.fontMainColor)}
                                        onChangeText={(text) => dispatch(changeTitle(text))}
                                        value={title}
                                        placeholderTextColor={colors.fontSecondColor}
                                        placeholder={'Заглавие на търсеното от вас'}
                                    />
                                </View>
                                <TextDefault light small right style={alignment.MTxSmall}>
                                    {title.length + '/ 70'}
                                </TextDefault>
                                {errors.title &&
                                    <TextDefault textColor={colors.google} style={styles.width100}>
                                        {errors.title}
                                    </TextDefault>
                                }
                            </View>
                            <View style={{ paddingHorizontal: 10}}>
                                <TextDefault textColor={errors.title ? colors.google : adColor} H5 bold style={styles.width100}>
                                    {'Колко сте готови да заплатите ?'}
                                </TextDefault>
                                <View style={[styles.descriptionContainer, { borderColor: adColor }]}>
                                    <TextInput
                                        style={styles.inputText}
                                        maxLength={70}
                                        multiline={true}
                                        onFocus={() => {
                                            setAdColor(colors.selectedText)
                                        }}
                                        onBlur={() => setAdColor(colors.fontMainColor)}
                                        onChangeText={text => dispatch(changeInquiry(text))
                                        }  
                                        value={inquiry}
                                        placeholderTextColor={colors.fontSecondColor}
                                        placeholder={'Приблизителна цена или бартер в замяна на търсеното от вас(напишете с думи)'}
                                    />
                                </View>
                                {errors.inquiry &&
                                    <TextDefault textColor={colors.google} style={styles.width100}>
                                        {errors.inquiry}
                                    </TextDefault>
                                }
                            </View>
                            <View style={styles.line} />
                            <View style={styles.subContainer}>
                                <TextDefault textColor={errors.description ? colors.google : descriptionColor} H5 bold style={styles.width100}>
                                    {'Повече информация *'}
                                </TextDefault>
                                <View style={[styles.descriptionContainer, { borderColor: descriptionColor }]}>
                                    <TextInput
                                        style={styles.inputText}
                                        maxLength={4096}
                                        multiline={true}
                                        onFocus={() => {
                                            setDescriptionColor(colors.selectedText)
                                        }}
                                        onBlur={() => setDescriptionColor(colors.fontMainColor)}
                                        onChangeText={text => dispatch(changeDescription(text))}
                                        value={description}
                                        placeholderTextColor={colors.fontSecondColor}
                                        placeholder={'Подробности за търсеното от Вас(размер, цвят, и тн.) '}
                                    />
                                </View>
                                <TextDefault light small right style={alignment.MTxSmall}>
                                    {description.length + '/ 4096'}
                                </TextDefault>
                                {errors.description &&
                                    <TextDefault textColor={colors.google} style={styles.width100}>
                                        {errors.description}
                                    </TextDefault>
                                }
                            </View>
                        </View>
                        <View style={[styles.buttonView, { marginBottom: 10}]}>
                            <EmptyButton
                                style={{ padding: scale(10) }}
                                title='Следваща стъпка'
                                onPress={handleSubmit} 
                                />
                        </View>
                    </View>
                </ScrollView>
    )
}
export default SearchyForm